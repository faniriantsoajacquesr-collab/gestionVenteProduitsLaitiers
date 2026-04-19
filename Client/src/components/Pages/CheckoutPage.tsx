import { supabase } from "@/lib/supabase";
import { ShoppingBag, Landmark, Smartphone, ChevronLeft, ArrowRight, Loader2, Check, UserCircle, Edit3 } from "lucide-react";
import { useState,useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
    unit: string;
    product_gallery: { image_url: string }[];
  };
}

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/placeholder-product.png";
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CheckoutPage() {
  const [deliveryOption, setDeliveryOption] = useState<string>('standard');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoSource, setInfoSource] = useState<'profile' | 'custom'>('profile');
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  
  // Placeholder states for address fields
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');


  const fetchCart = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("http://localhost:5000/api/cart", {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      const data = await response.json();
      setCartItems(Array.isArray(data) ? data : []);
      setEmail(session.user.email || '');

      // Fetch Profile Data for auto-fill
      const profileRes = await fetch("http://localhost:5000/api/auth/me", {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      const pData = await profileRes.json();
      setProfileData(pData);
      
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const paymentMethods = [
    { id: "orange_money", label: "Orange money", icon: <Smartphone size={20} />, dbValue: "Orange Money" },
    { id: "mvola", label: "Payer par MVola", icon: <img src="/mvola-logo.png" className="h-4" alt="MVola" />, dbValue: "MVola" },
    { id: "airtel_money", label: "Airtel Money", icon: <Smartphone size={20} />, dbValue: "Airtel Money" },
    { id: "virement_bancaire", label: "Payer par virement bancaire", icon: <Landmark size={20} />, dbValue: "Paiement par virement bancaire" },
  ];

  // Ensure initial paymentMethod is one of the valid IDs
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].id);
  useEffect(() => {
    fetchCart();
  }, []);

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Veuillez vous connecter.");
        return;
      }

      const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: session.user.id,
          email: infoSource === 'profile' ? profileData?.email : email,
          deliveryAddress: infoSource === 'profile' ? profileData?.address : address,
          firstName: infoSource === 'profile' ? profileData?.first_name : firstName,
          lastName: infoSource === 'profile' ? profileData?.last_name : lastName,
          phoneNumber: infoSource === 'profile' ? profileData?.phone_number : phoneNumber,
          deliverySpeed: deliveryOption === 'standard' ? 'standard delivery' : 'rush delivery',
          paymentMethod: selectedMethod?.dbValue || 'Orange Money'
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to create order");

      toast.success("Commande confirmée avec succès !");
      navigate('/orders');

    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de la création de la commande : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + (item.products.price * item.quantity), 0)
  , [cartItems]);

  const canProceed = useMemo(() => {
    if (infoSource === 'profile') {
      return !!(email && profileData?.first_name && profileData?.last_name && profileData?.address && profileData?.phone_number);
    }
    return !!(email && firstName && lastName && address && phoneNumber);
  }, [infoSource, profileData, email, firstName, lastName, address, phoneNumber]);

  return (
    <div className="container mx-auto p-6 pt-32 max-w-7xl">
      <h1 className="text-4xl font-black font-headline mb-12 text-on-surface text-center md:text-left">Passer la Commande</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: ORDER SUMMARY (Based on Image 2) */}
        <div className="w-full lg:w-5/12 order-2 lg:order-1">
          <div className="bg-surface-container-lowest border border-outline/10 rounded-3xl p-8 sticky top-32 shadow-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-outline/10 pb-4">
                <ShoppingBag className="text-primary" size={24} />
                <h2 className="text-2xl font-bold font-headline">Your bag</h2>
            </div>

            <div className="space-y-6 mb-8 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.length === 0 && !isLoading ? (
                <p className="text-on-surface-variant text-center py-10">Your bag is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="size-20 bg-surface-container rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img 
                        src={getImageUrl(item.products.product_gallery[0]?.image_url)} 
                        alt={item.products.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-lg text-on-surface">{item.products.name}</h4>
                        <span className="text-xs font-bold text-outline uppercase tracking-tighter bg-surface-container px-2 py-1 rounded">
                            {item.products.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-3 text-on-surface-variant">
                            <span className="text-sm font-medium">Qty: {item.quantity}</span>
                        </div>
                        <span className="font-black text-primary text-lg">
                            {(item.products.price * item.quantity).toLocaleString()} Ar
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-6 border-t-2 border-dashed border-outline/20 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-medium">Subtotal</span>
                <span className="text-3xl font-black text-on-surface font-headline">{subtotal.toLocaleString()} Ar</span>
              </div>
              <p className="text-xs text-outline italic leading-tight">
                Taxes and shipping calculated at checkout. Enjoy our zero-waste loop delivery.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SHIPPING FORM (Based on Image 1) */}
        <div className="w-full lg:w-7/12 order-1 lg:order-2 space-y-8 transition-all">
          {step === 'shipping' ? (
            <>
          {/* Welcome Message */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-primary/10">
            <h2 className="text-xl font-bold text-on-surface">Welcome back</h2>
            <p className="text-on-surface-variant text-sm">You are logged in as <span className="font-bold text-primary">{profileData?.username || 'User'}</span></p>
          </div>

          {/* Contact Information & Shipping Section */}
          <section className="bg-surface-container-low p-8 rounded-3xl shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center">1</span>
                Contact Information
            </h2>

            {/* Selection logic - Radio Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button 
                onClick={() => setInfoSource('profile')}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${infoSource === 'profile' ? 'border-primary bg-primary/5' : 'border-outline/10 hover:border-primary/50'}`}
              >
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${infoSource === 'profile' ? 'border-primary' : 'border-outline'}`}>
                  {infoSource === 'profile' && <div className="size-2.5 bg-primary rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm flex items-center gap-2"><UserCircle size={16}/> Utiliser mon profil</p>
                  <p className="text-[10px] text-on-surface-variant">Auto-remplissage sécurisé</p>
                </div>
              </button>

              <button 
                onClick={() => setInfoSource('custom')}
                className={`flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${infoSource === 'custom' ? 'border-primary bg-primary/5' : 'border-outline/10 hover:border-primary/50'}`}
              >
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${infoSource === 'custom' ? 'border-primary' : 'border-outline'}`}>
                  {infoSource === 'custom' && <div className="size-2.5 bg-primary rounded-full" />}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm flex items-center gap-2"><Edit3 size={16}/> Informations personnalisées</p>
                  <p className="text-[10px] text-on-surface-variant">Saisir une autre adresse</p>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <input 
                  type="email" placeholder="Email Address" 
                  className={`p-4 border border-outline/20 rounded-2xl outline-none focus:border-primary transition-colors md:col-span-2 ${infoSource === 'profile' ? 'bg-surface-container-high opacity-60' : 'bg-surface-container-lowest'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  readOnly={infoSource === 'profile'}
                />
                <input 
                  type="text" placeholder="First Name" 
                  className={`p-4 border border-outline/20 rounded-2xl outline-none focus:border-primary transition-colors ${infoSource === 'profile' ? 'bg-surface-container-high opacity-60' : 'bg-surface-container-lowest'}`}
                  value={infoSource === 'profile' ? (profileData?.first_name || '') : firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  readOnly={infoSource === 'profile'}
                />
                <input 
                  type="text" placeholder="Last Name" 
                  className={`p-4 border border-outline/20 rounded-2xl outline-none focus:border-primary transition-colors ${infoSource === 'profile' ? 'bg-surface-container-high opacity-60' : 'bg-surface-container-lowest'}`}
                  value={infoSource === 'profile' ? (profileData?.last_name || '') : lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  readOnly={infoSource === 'profile'}
                />
                <input 
                  type="text" placeholder="Address" 
                  className={`p-4 border border-outline/20 rounded-2xl outline-none focus:border-primary transition-colors ${infoSource === 'profile' ? 'bg-surface-container-high opacity-60' : 'bg-surface-container-lowest'}`}
                  value={infoSource === 'profile' ? (profileData?.address || '') : address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  readOnly={infoSource === 'profile'}
                />
                <input 
                  type="text" placeholder="Phone Number" 
                  className={`p-4 border border-outline/20 rounded-2xl outline-none focus:border-primary transition-colors ${infoSource === 'profile' ? 'bg-surface-container-high opacity-60' : 'bg-surface-container-lowest'}`}
                  value={infoSource === 'profile' ? (profileData?.phone_number || '') : phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  readOnly={infoSource === 'profile'}
                />
              </div>

            <div className="mt-8 pt-8 border-t border-outline/20 space-y-3">
               <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                 <span className="size-6 rounded-full bg-primary text-on-primary text-xs flex items-center justify-center">2</span>
                 Delivery Speed
               </h3>
               {['standard', 'rush'].map((option) => (
                   <label key={option} className="flex items-center p-4 rounded-2xl hover:bg-surface-container-high transition-colors cursor-pointer group">
                       <input 
                            type="radio" 
                            name="delivery" 
                            checked={deliveryOption === option} 
                            onChange={() => setDeliveryOption(option)}
                            className="mr-4 accent-primary size-4" 
                        />
                       <div className="flex-1">
                           <span className="font-bold capitalize text-on-surface">{option === 'standard' ? 'Standard Delivery' : 'Rush Delivery'}</span>
                           <p className="text-xs text-on-surface-variant">Arrival in {option === 'standard' ? '3-5' : '1-2'} business days</p>
                       </div>
                       <span className="font-black text-primary">{option === 'standard' ? 'FREE' : ' Ar'}</span> {/* Assuming rush delivery has a fixed price */}
                   </label>
               ))}
            </div>
          </section>

          <button 
            onClick={() => setStep('payment')}
            disabled={!canProceed}
            className="w-full creamy-gradient text-on-primary font-black py-6 rounded-full hover:scale-[1.02] hover:shadow-xl transition-all active:scale-95 text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
            Continue to Payment <ArrowRight size={20} />
          </button>
          </>
          ) : (
            /* PAYMENT STEP */
            <section className="bg-surface-container-low p-8 rounded-3xl shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                <button onClick={() => setStep('shipping')} className="flex items-center gap-2 text-primary font-bold mb-6 hover:underline">
                    <ChevronLeft size={20} /> Retour aux informations de livraison
                </button>
                
                <h2 className="text-2xl font-bold text-on-surface mb-8">Méthode de Paiement</h2>
                
                <div className="space-y-4 mb-10">
                    {paymentMethods.map((method) => (
                        <label 
                            key={method.id}
                            className={`flex items-center p-5 rounded-2xl cursor-pointer border-2 transition-all ${
                                paymentMethod === method.id 
                                ? "border-primary bg-primary/5 shadow-md" 
                                : "border-transparent bg-surface-container-lowest hover:bg-surface-container-high"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === method.id}
                                onChange={() => setPaymentMethod(method.id)} // Use method.id for state
                                className="size-5 accent-primary mr-6"
                            />
                            <div className="flex items-center gap-4 flex-1">
                                <span className="text-primary">{method.icon}</span>
                                <span className="font-bold text-on-surface">{method.label}</span>
                            </div>
                        </label>
                    ))}
                </div>

                <button 
                    onClick={handleConfirmOrder}
                    disabled={isSubmitting}
                    className="w-full py-6 rounded-full bg-primary text-on-primary font-black text-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={24} />}
                    {isSubmitting ? "Traitement..." : "Confirmer et Payer"}
                </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
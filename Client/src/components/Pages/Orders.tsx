import { supabase } from "@/lib/supabase";
import { Check, Home, CreditCard, Loader2, PackageX } from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { label: "Prise en compte", status: "complete", icon: <Check size={16}/> },
  { label: "En cours de préparation", status: "current", icon: null },
  { label: "Arrivée au point relais", status: "upcoming", icon: null },
  { label: "En cours de livraison", status: "upcoming", icon: null },
  { label: "Livré", status: "upcoming", icon: null },
];

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  unit_bought: string;
  products: {
    name: string;
    product_gallery: { image_url: string }[];
  };
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_address: string;
  contact_phone: string;
  payment_method: string;
  first_name: string;
  last_name: string;
  order_items: OrderItem[];
}

const getImageUrl = (url: string | undefined) => {
  if (!url) return "/placeholder-product.png";
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function OrderTrackingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const response = await fetch("http://localhost:5000/api/orders", {
          headers: { "Authorization": `Bearer ${session.access_token}` }
        });
        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStepStatus = (orderStatus: string, stepIndex: number) => {
    const statusMap: Record<string, number> = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 4,
      'cancelled': -1
    };
    const currentStep = statusMap[orderStatus] ?? 0;
    if (stepIndex < currentStep) return 'complete';
    if (stepIndex === currentStep) return 'current';
    return 'upcoming';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-on-surface-variant font-bold">Chargement de vos commandes...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto p-6 pt-32 max-w-5xl text-center space-y-6">
        <PackageX size={64} className="mx-auto text-outline/30" />
        <h1 className="text-3xl font-black">Aucune commande trouvée</h1>
        <p className="text-on-surface-variant">Vous n'avez pas encore passé de commande chez nous.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-32 max-w-5xl space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="space-y-8 border-b border-outline/10 pb-16 last:border-0">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black font-headline text-on-surface">Suivi de commande</h1>
          <p className="text-on-surface-variant italic">Commande n°{order.id.split('-')[0].toUpperCase()} du {new Date(order.created_at).toLocaleDateString()}</p>
        </div>
        <div className={`px-4 py-2 rounded-lg font-bold uppercase text-sm ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-primary/10 text-primary'}`}>
            Statut : {order.status}
        </div>
      </header>

      {/* Barre de Progression (Stepper) */}
      <section className="bg-surface-container-low p-10 rounded-[32px] shadow-sm overflow-x-auto">
        <div className="flex items-center min-w-[800px]">
          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 relative">
              {/* Ligne de connection */}
              {idx !== 0 && (
                <div className={`absolute top-5 -left-1/2 w-full h-1 ${getStepStatus(order.status, idx) === 'upcoming' ? 'bg-outline/20' : 'bg-primary'}`} />
              )}
              {/* Cercle */}
              <div className={`size-10 rounded-full flex items-center justify-center z-10 mb-4 transition-all duration-500 ${
                getStepStatus(order.status, idx) === 'complete' ? 'bg-primary text-on-primary' : 
                getStepStatus(order.status, idx) === 'current' ? 'bg-primary/20 border-2 border-primary text-primary scale-110 shadow-lg' : 
                'bg-surface-container-high text-outline'
              }`}>
                {getStepStatus(order.status, idx) === 'complete' ? <Check size={18} /> : (step.icon || <div className="size-2 bg-current rounded-full" />)}
              </div>
              <span className={`text-[10px] uppercase font-bold text-center px-2 ${getStepStatus(order.status, idx) === 'upcoming' ? 'text-outline' : 'text-on-surface'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Grille d'infos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adresse */}
        <div className="bg-surface-container-low p-8 rounded-3xl space-y-4 border border-outline/5">
          <h3 className="flex items-center gap-2 font-bold text-lg"><Home size={20} className="text-primary"/> Adresse de livraison</h3>
          <div className="text-on-surface-variant text-sm leading-relaxed">
            <p className="font-bold text-on-surface">{order.first_name} {order.last_name}</p>
            <p className="whitespace-pre-line">{order.delivery_address}</p>
            <p className="mt-2 font-medium">{order.contact_phone}</p>
          </div>
        </div>

        {/* Paiement & Statut */}
        <div className="bg-surface-container-low p-8 rounded-3xl space-y-4 border border-outline/5">
          <h3 className="flex items-center gap-2 font-bold text-lg"><CreditCard size={20} className="text-primary"/> Informations de paiement</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="text-outline">Moyen de paiement:</span>
                <span className="font-bold">{order.payment_method}</span>
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}`}>
                {order.status === 'pending' ? 'En attente du paiement' : 'Paiement Validé'}
            </div>
          </div>
        </div>
      </div>

      {/* Recapitulatif Produit */}
      <section className="bg-surface-container-low rounded-3xl overflow-hidden border border-outline/5">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high">
            <tr className="text-xs uppercase font-bold text-outline">
              <th className="p-6">Produit</th>
              <th className="p-6 text-center">Quantité</th>
              <th className="p-6 text-right">Prix Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item) => (
              <tr key={item.id} className="border-t border-outline/10">
              <td className="p-6">
                <div className="flex items-center gap-4">
                  <div className="size-16 bg-surface-container rounded-xl flex-shrink-0 overflow-hidden">
                    <img 
                      src={getImageUrl(item.products.product_gallery?.[0]?.image_url)} 
                      alt={item.products.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">{item.products.name}</p>
                    <p className="text-xs text-outline leading-none">Unité : {item.unit_bought}</p>
                  </div>
                </div>
              </td>
              <td className="p-6 text-center font-bold">{item.quantity}</td>
              <td className="p-6 text-right font-black text-primary text-lg">
                {(item.price_at_purchase * item.quantity).toLocaleString()} Ar
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </section>
      </div>
      ))}
    </div>
  );
}
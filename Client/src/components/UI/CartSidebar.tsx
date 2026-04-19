import { useEffect, useState, useMemo } from "react";
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight, Loader2 } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/UI/alert-dialog";

interface CartItem {
    id: string;
    quantity: number;
    products: {
        id: string;
        name: string;
        price: number;
        unit: string;
        stock_quantity: number;
        product_gallery: { image_url: string }[];
    };
}

const getImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder-product.png";
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function CartSidebar() {
    const { isCartOpen, toggleCart } = useSidebar();
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch("http://localhost:5000/api/cart", {
                headers: { "Authorization": `Bearer ${session.access_token}` }
            });
            const data = await response.json();
            setItems(Array.isArray(data) ? data : []); // Ensure items is always an array
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isCartOpen) fetchCart();
    }, [isCartOpen]);

    const updateQuantity = async (itemId: string, productId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        setUpdatingItemId(itemId);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                toast.error("Veuillez vous connecter pour modifier votre panier.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}` 
                },
                body: JSON.stringify({ productId, quantity: newQuantity, setQuantity: true })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update quantity");
            }
            fetchCart();
            
            // Dispatch custom event to refresh product data
            window.dispatchEvent(new CustomEvent('cartItemUpdated'));
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Impossible de mettre à jour la quantité.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const response = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${session.access_token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to remove item");
            }

            setItems(items.filter(item => item.id !== itemId));
            toast.success("Article retiré du panier.");
            
            // Dispatch custom event to refresh product data
            window.dispatchEvent(new CustomEvent('cartItemRemoved'));
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Erreur lors de la suppression.");
        } finally {
            setItemToDelete(null);
        }
    };

    const subtotal = useMemo(() => 
        items.reduce((acc, item) => acc + (item.products.price * item.quantity), 0)
    , [items]);

    return (
        <>
            {/* Modal de confirmation Shadcn */}
            <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cet article sera retiré de votre panier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={() => itemToDelete && removeItem(itemToDelete)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Supprimer</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Backdrop */}
            <div 
                className={`fixed inset-0 z-[120] bg-on-surface/40 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                onClick={() => toggleCart(false)} 
            />

            {/* Sidebar */}
            <aside className={`fixed right-0 top-0 z-[130] h-full w-full max-w-md bg-surface-container-lowest shadow-2xl transition-transform duration-500 ease-in-out transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <div className="p-6 border-b border-outline/10 flex justify-between items-center">
                    <div className="flex items-center gap-3 text-primary">
                        <ShoppingCart size={24} />
                        <h2 className="text-xl font-headline font-bold">Mon Panier</h2>
                    </div>
                    <button onClick={() => toggleCart(false)} className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-outline">
                            <Loader2 className="animate-spin" size={32} />
                            <p>Chargement de vos produits...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-on-surface-variant mb-6">Votre panier est vide.</p>
                            <button onClick={() => { toggleCart(false); navigate('/products'); }} className="text-primary font-bold hover:underline">Commencer les achats</button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                <div className="size-20 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                                    <img 
                                        src={getImageUrl(item.products?.product_gallery?.[0]?.image_url)} 
                                        alt={item.products?.name || "Product"} 
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder-product.png";
                                        }}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-on-surface">{item.products.name}</h4>
                                        <button onClick={() => setItemToDelete(item.id)} className="text-outline-variant hover:text-destructive transition-colors"><Trash2 size={18} /></button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className={`flex items-center border border-outline/20 rounded-full px-2 py-0.5 ${updatingItemId === item.id ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <button onClick={() => updateQuantity(item.id, item.products.id, item.quantity - 1)} className="p-1 hover:text-primary"><Minus size={14} /></button>
                                            <span className="w-8 text-center text-sm font-bold">
                                                {updatingItemId === item.id ? <Loader2 size={12} className="animate-spin mx-auto" /> : item.quantity}
                                            </span>
                                            <button onClick={() => updateQuantity(item.id, item.products.id, item.quantity + 1)} className="p-1 hover:text-primary"><Plus size={14} /></button>
                                        </div>
                                        <span className="font-bold text-primary">{(item.products.price * item.quantity).toLocaleString()} Ar</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-surface-container-low border-t border-outline/10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-on-surface-variant font-medium">Sous-total</span>
                            <span className="text-2xl font-headline font-black text-on-surface">{subtotal.toLocaleString()} Ar</span>
                        </div>
                        <p className="text-xs text-outline leading-tight">Les taxes et frais de livraison seront calculés au moment du paiement.</p>
                        <button 
                            onClick={() => {
                                toggleCart(false);
                                navigate("/checkout");
                            }}
                            className="w-full creamy-gradient text-on-primary font-bold py-4 rounded-full flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95 shadow-lg"
                        >
                            Passer la commande <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
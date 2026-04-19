import { useState } from "react";
import { X, Plus, Minus, ShoppingBag, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    unit: string;
    category: string;
    milk_type: string;
    dietary_tags: string[];
    stock_quantity: number;
    product_gallery: {
        image_url: string;
        alt_text: string;
    }[];
}

interface ProductModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onRefresh?: () => Promise<void>;
}

export default function ProductModal({ product, isOpen, onClose, onRefresh }: ProductModalProps) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    if (!isOpen || !product) return null;

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                toast.error("Veuillez vous connecter pour ajouter des articles au panier.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: quantity
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add item to cart");
            }

            toast.success(`${product.name} a été ajouté au panier !`);
            onClose();
            if (onRefresh) {
                await onRefresh();
            }
        } catch (err: any) {
            toast.error(err.message || "Une erreur est survenue.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative bg-surface-container-lowest w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-surface-container-high/80 hover:bg-primary hover:text-on-primary transition-all">
                    <X size={20} />
                </button>

                {/* Left: Image Gallery */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-4">
                    <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low">
                        <img 
                            src={product.product_gallery[selectedImage]?.image_url || "/placeholder-product.png"} 
                            alt={product.product_gallery[selectedImage]?.alt_text || product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {product.product_gallery.map((img, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setSelectedImage(idx)}
                                className={`size-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-primary' : 'border-transparent opacity-60'}`}
                            >
                                <img src={img.image_url} alt={img.alt_text} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col">
                    <div className="mb-6">
                        <span className="text-xs font-label font-bold uppercase tracking-widest text-primary mb-2 block">
                            {product.category} • {product.milk_type}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-headline font-extrabold text-on-surface mb-2">{product.name}</h2>
                        <p className="text-2xl font-bold text-primary">{product.price} Ar / {product.unit}</p>
                    </div>

                    <div className="mb-8 space-y-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-outline">Description</h3>
                        <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.dietary_tags?.map(tag => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                                <Check size={12} /> {tag}
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto space-y-6">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center border border-outline-variant rounded-full px-2 py-1">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                                    disabled={isAdding}
                                    className="p-2 hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-10 text-center font-bold">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))} 
                                    disabled={isAdding}
                                    className="p-2 hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <p className="text-sm text-outline font-medium">En Stock: {product.stock_quantity}</p>
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock_quantity === 0}
                            className="w-full creamy-gradient text-on-primary font-bold py-4 rounded-full hover:scale-[1.02] hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isAdding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingBag size={20} />}
                            {isAdding ? "Ajout au panier..." : `Ajouter ${quantity} au Panier • ${(product.price * quantity).toLocaleString()} Ar`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
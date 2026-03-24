import { Plus } from 'lucide-react';

interface ProductCardProps {
    name: string;
    description: string;
    price: string;
    imageUrl: string;
}

export default function ProductCard({ name, description, price, imageUrl }: ProductCardProps) {
    return (
        <div className="group bg-surface-container-lowest rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="relative aspect-[4/5] bg-surface-container-low rounded-lg overflow-hidden mb-6">
                <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-headline font-bold text-lg text-on-surface">{name}</h4>
                    <span className="text-primary font-bold text-lg">{price}</span>
                </div>
                <p className="text-sm text-on-surface-variant mb-6">{description}</p>
                <button className="w-full py-3 rounded-full bg-surface-container-high font-bold text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                    <Plus size={20} /> Add to Cart
                </button>
            </div>
        </div>
    );
}
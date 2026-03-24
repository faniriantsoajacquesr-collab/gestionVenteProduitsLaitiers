import Sidebar from "../UI/Sidebar";
import ProductCard from "../UI/ProductCard";

const products = [
    {
        name: "Alpine Gruyère",
        description: "Aged 12 months, nutty & robust.",
        price: "$12.50",
        imageUrl: "https://images.unsplash.com/photo-1628636637371-ed334a54ad7c?q=80&w=1887&auto=format&fit=crop",
    },
    {
        name: "Fresh Goat Cheese",
        description: "Creamy, tangy, and spreadable.",
        price: "$8.00",
        imageUrl: "https://images.unsplash.com/photo-1559598467-f8b76c8155d0?q=80&w=1887&auto=format&fit=crop",
    },
    {
        name: "Organic Whole Milk",
        description: "Glass Bottle (1L), full cream.",
        price: "$4.50",
        imageUrl: "https://images.unsplash.com/photo-1563637135-2235113479b2?q=80&w=1887&auto=format&fit=crop",
    },
    {
        name: "Cultured Butter",
        description: "Slightly tangy, rich flavor.",
        price: "$6.00",
        imageUrl: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=2070&auto=format&fit=crop",
    },
    {
        name: "Greek Yogurt",
        description: "Thick, creamy, and high in protein.",
        price: "$5.25",
        imageUrl: "https://images.unsplash.com/photo-1562119479-204452b893a9?q=80&w=1887&auto=format&fit=crop",
    },
    {
        name: "Sheep's Milk Feta",
        description: "Salty and briny, perfect for salads.",
        price: "$9.75",
        imageUrl: "https://images.unsplash.com/photo-1626962193229-a8f04c6f3557?q=80&w=1887&auto=format&fit=crop",
    },
];


export default function Products() {
    return (
        <main className="pt-32 pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-12">
                <Sidebar />
                <section className="flex-1">
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Our Artisanal Collection</h2>
                            <p className="text-on-surface-variant font-body mt-2">Crafted with care, from fresh milk to aged cheeses.</p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <span className="text-xs font-label uppercase tracking-widest text-outline-variant">Showing {products.length} of 64 Products</span>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.name}
                                name={product.name}
                                description={product.description}
                                price={product.price}
                                imageUrl={product.imageUrl}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
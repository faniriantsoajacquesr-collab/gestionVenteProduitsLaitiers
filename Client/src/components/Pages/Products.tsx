import Sidebar from "../UI/Sidebar";
import ProductCard from "../UI/ProductCard";


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
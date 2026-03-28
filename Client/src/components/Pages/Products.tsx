import { useState, useEffect } from "react";
import Sidebar from "../UI/Sidebar";
import ProductCard from "../UI/ProductCard";
import LoadingSpinner from "../UI/LoadingSpinner";
import ProductModal from "../UI/productModal";

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
        is_primary?: boolean;
    }[];
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (!response.ok) {
                    throw new Error("Failed to fetch products from the server");
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="pt-32 text-center text-destructive">
                <p>Error loading products: {error}</p>
            </div>
        );
    }

    return (
        <main className="pt-32 pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto relative">
            <ProductModal 
                product={selectedProduct} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
            
            <div className="flex flex-col md:flex-row gap-12">
                <Sidebar />
                <section className="flex-1">
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Our Artisanal Collection</h2>
                            <p className="text-on-surface-variant font-body mt-2">Crafted with care, from fresh milk to aged cheeses.</p>
                        </div>
                        <div className="hidden lg:block text-right">
                            <span className="text-xs font-label uppercase tracking-widest text-outline-variant">Showing {products.length} Products</span>
                        </div>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                description={product.description}
                                price={`${product.price} Ar / ${product.unit}`}
                                imageUrl={
                                    product.product_gallery?.find(img => img.is_primary)?.image_url || 
                                    product.product_gallery?.[0]?.image_url || 
                                    "/placeholder-product.png"
                                }
                                onOpen={() => handleOpenModal(product)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
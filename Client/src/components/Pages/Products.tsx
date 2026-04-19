import { useState, useEffect, useMemo } from "react";
import ProductCard from "../UI/ProductCard";
import LoadingSpinner from "../UI/LoadingSpinner";
import ProductModal from "../UI/productModal";
import { useSidebar } from "../../contexts/SidebarContext";
import { supabase } from "@/lib/supabase";
import ProductNavbar from "../UI/productSidebar";

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

interface Filters {
    category: string[];
    milkType: string[];
    dietary: string[];
}

// Helper to resolve image URLs
const getImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder-product.png";
    if (url.startsWith('http')) return url;
    // If it's a relative path, prefix with backend URL
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filters, setFilters] = useState<Filters>({
        category: [],
        milkType: [],
        dietary: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isCollapsed, toggleSidebar } = useSidebar();

    // Handle Debounce for Search
    useEffect(() => {
        setIsSearching(true);
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            // If we are filtering client-side, we stop the searching state here
            // If server-side, it stops after fetch
            if (searchQuery === debouncedSearch) setIsSearching(false);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Get session in case the route is protected
                const { data: { session } } = await supabase.auth.getSession();
                
                // Construct URL with query parameters for server-side filtering
                const params = new URLSearchParams();
                if (debouncedSearch) params.append("search", debouncedSearch);
                if (filters.category.length) params.append("category", filters.category.join(","));
                if (filters.milkType.length) params.append("milkType", filters.milkType.join(","));
                if (filters.dietary.length) params.append("dietary", filters.dietary.join(","));

                const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`, {
                    headers: {
                        ...(session ? { "Authorization": `Bearer ${session.access_token}` } : {})
                    }
                });

                if (!response.ok) {
                    // Try to get specific error message from server body
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || `Server Error: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
                console.error("Detailed Fetch error:", err);
            } finally {
                setIsLoading(false);
                setIsSearching(false);
            }
        };

        fetchProducts();
    }, [debouncedSearch, filters]);

    // Listen for cart item removal and update events to refresh product data
    useEffect(() => {
        const handleCartChange = () => {
            refreshProducts();
        };

        window.addEventListener('cartItemRemoved', handleCartChange);
        window.addEventListener('cartItemUpdated', handleCartChange);
        return () => {
            window.removeEventListener('cartItemRemoved', handleCartChange);
            window.removeEventListener('cartItemUpdated', handleCartChange);
        };
    }, []);

    const refreshProducts = async () => {
        try {
            setIsLoading(true);
            // Get session in case the route is protected
            const { data: { session } } = await supabase.auth.getSession();
            
            // Construct URL with query parameters for server-side filtering
            const params = new URLSearchParams();
            if (debouncedSearch) params.append("search", debouncedSearch);
            if (filters.category.length) params.append("category", filters.category.join(","));
            if (filters.milkType.length) params.append("milkType", filters.milkType.join(","));
            if (filters.dietary.length) params.append("dietary", filters.dietary.join(","));

            const response = await fetch(`http://localhost:5000/api/products?${params.toString()}`, {
                headers: {
                    ...(session ? { "Authorization": `Bearer ${session.access_token}` } : {})
                }
            });

            if (!response.ok) {
                // Try to get specific error message from server body
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Server Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("Detailed Fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = searchQuery === "" || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = filters.category.length === 0 || 
                filters.category.includes(product.category);

            const matchesMilkType = filters.milkType.length === 0 || 
                filters.milkType.includes(product.milk_type);

            const matchesDietary = filters.dietary.length === 0 || 
                filters.dietary.every(tag => product.dietary_tags?.includes(tag));

            return matchesSearch && matchesCategory && matchesMilkType && matchesDietary;
        });
    }, [products, searchQuery, filters]);

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="pt-32 text-center text-destructive">
                <p>Error loading products: {error}</p>
            </div>
        );
    }

    return (
        <main className={`pt-32 pb-20 px-6 md:px-12 max-w-screen-2xl mx-auto relative transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}>
            <ProductNavbar 
                isCollapsed={isCollapsed} 
                onToggleCollapse={toggleSidebar}
                onSearch={setSearchQuery}
                onFilterChange={setFilters}
            />

            <ProductModal
                product={selectedProduct}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={refreshProducts}
            />

            <div className="flex flex-col md:flex-row gap-12 mt-4">
                <section className="flex-1">
                    <header className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="font-headline text-4xl font-extrabold tracking-tighter text-on-surface">Nos produits</h2>
                            <p className="text-on-surface-variant font-body mt-2">Élaborés avec soin, du lait frais aux fromages affinés.</p>
                        </div>
                        <div className="hidden lg:block text-right">
                            {isSearching && <span className="text-xs text-primary animate-pulse mr-4">Recherche en cours...</span>}
                            <span className="text-xs font-label uppercase tracking-widest text-outline-variant">Affichage de {filteredProducts.length} produits</span>
                        </div>
                    </header>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${isSearching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                name={product.name}
                                description={product.description}
                                price={`${product.price} Ar / ${product.unit}`}
                                imageUrl={getImageUrl(
                                    product.product_gallery?.find(img => img.is_primary)?.image_url || 
                                    product.product_gallery?.[0]?.image_url
                                )}
                                onOpen={() => handleOpenModal(product)}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
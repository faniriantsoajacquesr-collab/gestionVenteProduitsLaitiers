import { Leaf, Recycle, Truck, ChevronLeft, ChevronRight, Check, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import PrimaryBtn from "../UI/PrimaryBtn";
import ProductCard from "../UI/ProductCard";
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

// Helper pour résoudre les URLs des images
const getImageUrl = (url: string | undefined) => {
    if (!url) return "/placeholder-product.png";
    if (url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

export default function Home() {
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/products");
                if (response.ok) {
                    const data = await response.json();
                    // Filter products to show only those with is_featured = true
                    const featuredProducts = data.filter((product: Product & { is_featured?: boolean }) => product.is_featured === true);
                    setBestSellers(featuredProducts);
                }
            } catch (error) {
                console.error("Error fetching best sellers:", error);
            }
        };
        fetchBestSellers();
    }, []);

    // Listen for cart item removal and update events to refresh product data
    useEffect(() => {
        const handleCartChange = () => {
            refreshBestSellers();
        };

        window.addEventListener('cartItemRemoved', handleCartChange);
        window.addEventListener('cartItemUpdated', handleCartChange);
        return () => {
            window.removeEventListener('cartItemRemoved', handleCartChange);
            window.removeEventListener('cartItemUpdated', handleCartChange);
        };
    }, []);

    const refreshBestSellers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            if (response.ok) {
                const data = await response.json();
                // Filter products to show only those with is_featured = true
                const featuredProducts = data.filter((product: Product & { is_featured?: boolean }) => product.is_featured === true);
                setBestSellers(featuredProducts);
            }
        } catch (error) {
            console.error("Error refreshing best sellers:", error);
        }
    };

    const handleOpenModal = (product: Product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <main className="pt-24">
            <ProductModal 
                product={selectedProduct} 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onRefresh={refreshBestSellers}
            />
            {/* Hero Section */}
            <section className="px-6 md:px-12 py-12 md:py-24 max-w-screen-2xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 z-10">
                        <span className="font-label text-xs tracking-widest uppercase text-primary font-bold mb-4 block">Depuis 2010 • Groupe BASAN</span>
                        <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tighter mb-8">
                            Lait Frais du <br /> <span className="text-primary">Vakinankaratra</span>
                        </h1>
                        <p className="text-body-lg text-on-surface-variant mb-10 max-w-md leading-relaxed">
                            Découvrez les saveurs authentiques de nos produits laitiers issus des montagnes d'Antsirabe. Socolait vous offre une filière locale responsable et sûre, transformée en produits savoureux à forte valeur nutritionnelle.
                        </p>
                        <PrimaryBtn displayText="Acheter Maintenant" onClick={() => navigate('/products')} icon={<ShoppingBag size={20} />} />
                       
                    </div>
                    <div className="lg:col-span-7 relative">
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                        <div className="relative rounded-xl overflow-hidden aspect-[4/3] ambient-shadow">
                            <img className="w-full h-full object-cover" alt="Premium glass milk bottle on a rustic wooden table with soft morning light streaming through a window, farm aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOZmcfFfoiZyVRFFo3V83CH_tteCXgj1Ok9i17wrvkfI-vd4S7C3xhMs2Wtp0XnjWJ27wYkNWHs6rBmiOmXr9fq3pG2Nsnr__rzuWfjZmhEwZihk_BBQCnYG8H2ZDpNs3kXjnxL-ravUlUtHhAK02A8I4_ZjU36Pqt3Duw6b7EO73S--HMTw4vpD_zRxCG30ROQxloqUVAJWuAYj27NRrr16B9RlqfQwRus5wQbtZLTf-PbrVZV6evRNxsa8YIT8Y_BkWO2LBSdww" />
                        </div>
                    </div>
                </div>
            </section>
            {/* Value Cards - Bento Style Layout */}
            <section className="bg-surface-container-low py-24 px-6 md:px-12">
                <div className="max-w-screen-2xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface mb-4">Pourquoi Socolait ?</h2>
                        <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">Qualité Garantie</h3>
                            <p className="text-on-surface-variant leading-relaxed">Tous nos produits sont issus d'une filière locale responsable et sûre, transformés dans notre laiterie d'Antsirabe avec les meilleures pratiques.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Recycle size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">Diversité de Saveurs</h3>
                            <p className="text-on-surface-variant leading-relaxed">Yaourts, crème fraîche, beurre, fromages, lait concentré et farine lactée infantile. Des textures gourmandes pour toute la famille.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">Accessibilité & Plaisir</h3>
                            <p className="text-on-surface-variant leading-relaxed">Nous rendons accessibles au plus grand nombre les bienfaits et le plaisir du lait frais sous toutes ses formes.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Best Sellers - Horizontal Scroll */}
            <section className="py-24 px-6 md:px-12 w-full">
                <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="font-label text-xs tracking-widest uppercase text-primary font-bold mb-2 block">Nos favoris</span>
                        <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">Best-sellers</h2>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth"
                >
                    {bestSellers.map((product) => (
                        <div key={product.id} className="min-w-[250px] md:min-w-[280px] ambient-shadow">
                            <ProductCard
                                name={product.name}
                                description={product.description}
                                price={`${product.price.toLocaleString()} Ar / ${product.unit}`}
                                imageUrl={getImageUrl(
                                    product.product_gallery?.find(img => img.is_primary)?.image_url || 
                                    product.product_gallery?.[0]?.image_url
                                )}
                                onOpen={() => handleOpenModal(product)}
                            />
                        </div>
                    ))}
                </div>
                </div>
            </section>
            {/* Signature Section - The Milk Glass Visual */}
            <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
                <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-16">
                    <div className="order-2 md:order-1">
                        <div className="rounded-xl overflow-hidden aspect-square ambient-shadow rotate-[-3deg]">
                            <img className="w-full h-full object-cover" alt="Aerial shot of pristine green alpine meadows with cows grazing under a blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLhps6dYUhbNRIjn-VyJC9DU4EY68RRsTX1ZpN2PithcaC9IUtnHQuzKMU9ZryQUJZ-Y_mHH-qq84nhJt_OcPS-5wstt7ZgQEnqma78MDCVYhWWeq5PkxD7foUwQUyzOdkWCFEddtndbYCb8CJZzLtwQX7QgX1H6qWKGjD_ONbL43L0x83jI5oaqtXBM0-R-YmStNIilMp1gd0oIErI3jSFu0UI9Y6rBNKNkMHci7Okmj3CVe79p4umSYs0eZdmDM0JzRUFILS2Po" />
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-8 tracking-tighter">Excellence Laitière <br />du Vakinankaratra.</h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                            Depuis 2010, Socolait (marque du Groupe BASAN) sélectionne les meilleurs laits des montagnes d'Antsirabe. Nos goûts variés, textures gourmandes et conditionnements innovants font le bonheur de toute la famille - des enfants aux grands-parents. Chaque produit porte l'engagement de nos producteurs locaux et la richesse des terres malgaches.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Filière locale responsable et sûre</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Transformé avec passion à Antsirabe</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Valeur nutritionnelle supérieure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
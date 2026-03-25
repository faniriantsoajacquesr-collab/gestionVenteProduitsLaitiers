import { Leaf, Recycle, Truck, ChevronLeft, ChevronRight, Plus, Check, Link, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PrimaryBtn from "../UI/PrimaryBtn";

export default function Home() {
    const navigate = useNavigate();
    return (
        <main className="pt-24">
            {/* Hero Section */}
            <section className="px-6 md:px-12 py-12 md:py-24 max-w-screen-2xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 z-10">
                        <span className="font-label text-xs tracking-widest uppercase text-primary font-bold mb-4 block">Est. 1924 • Alpine Valleys</span>
                        <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tighter mb-8">
                            Farm-Fresh Milk <br /> <span className="text-primary">Delivered Daily</span>
                        </h1>
                        <p className="text-body-lg text-on-surface-variant mb-10 max-w-md leading-relaxed">
                            Experience the purity of high-altitude pastures. We bring the creamery to your doorstep with zero-waste packaging and organic integrity.
                        </p>
                        <PrimaryBtn displayText="Shop Now" onClick={() => navigate('/products')} icon={<ShoppingBag size={20} />} />
                       
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
                        <h2 className="text-3xl md:text-4xl font-headline font-bold text-on-surface mb-4">Why Alpine?</h2>
                        <div className="h-1 w-16 bg-primary mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Leaf size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">100% Organic</h3>
                            <p className="text-on-surface-variant leading-relaxed">No pesticides, no hormones. Just pure nutrition from cows grazing on wild Alpine clover.</p>
                        </div>
                        {/* Card 2 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Recycle size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">Eco-friendly Packaging</h3>
                            <p className="text-on-surface-variant leading-relaxed">Traditional glass bottles that we collect, sterilize, and reuse—minimizing our footprint daily.</p>
                        </div>
                        {/* Card 3 */}
                        <div className="bg-surface-container-lowest p-10 rounded-xl hover:translate-y-[-8px] transition-transform duration-500">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-headline font-bold mb-4">Fresh Daily Delivery</h3>
                            <p className="text-on-surface-variant leading-relaxed">Milked at dawn, delivered by breakfast. We ensure the shortest journey from farm to fridge.</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Best Sellers - Horizontal Scroll */}
            <section className="py-24 px-6 md:px-12 max-w-screen-2xl mx-auto overflow-hidden">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="font-label text-xs tracking-widest uppercase text-primary font-bold mb-2 block">Our Favorites</span>
                        <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tight">Best Sellers</h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="w-12 h-12 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-8 no-scrollbar scroll-smooth">
                    {/* Product Card 1 */}
                    <div className="min-w-[300px] md:min-w-[380px] bg-surface-container-lowest rounded-xl p-4 ambient-shadow group">
                        <div className="rounded-lg overflow-hidden h-72 mb-6 bg-slate-100">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Close up of a premium glass milk bottle with condensation on a light blue background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA74KA2WYQkJEuKF2ZHjKCU-LAt0duRYYpzMkEKfZrSN9gCgxQBJ0YTfy_zjnUVXV6ykqHSbYV5ARCzKWedaNREBYsHXfgsKejFTg_46yntX5qMkHqQ3pLt_aSiKM2O4gcvE_ZjlHfujg7OfqPrrKQzo61sav1CVCZbg7U0oBKyIWHj87iizSP7waiP-gaOXRSv5Pbu4XE_UWFDHGcl9KnYWsNBzgJBy06SOBY5H_7ImtUk2Pvh7Lg22A94bXAd4qqwha0p2Pvgsh4" />
                        </div>
                        <div className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-headline font-bold">Whole Milk</h4>
                                <span className="text-primary font-bold">$4.50</span>
                            </div>
                            <p className="text-sm text-on-surface-variant mb-6">Glass Bottle (1L) • Full Cream</p>
                            <button className="w-full py-3 rounded-full bg-surface-container-high font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                                <Plus size={20} /> Add to Cart
                            </button>
                        </div>
                    </div>
                    {/* Product Card 2 */}
                    <div className="min-w-[300px] md:min-w-[380px] bg-surface-container-lowest rounded-xl p-4 ambient-shadow group">
                        <div className="rounded-lg overflow-hidden h-72 mb-6 bg-slate-100">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Artisanal glass jar of thick creamy white organic yogurt on a white marble surface" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAb9t9tMsDp4ypwylmDSGsFNyqi7VZjTHhCxrxUckRkOLUpk0GcqaTAufqRJVzepGC_GpMlNIH39iEzugx_KipjOV_aMP-UqaDd7cvhXMqFSfNgpqqRSC4hluPgdmbVCc7xBbmBpgeCZOXVe8CxYBYLzrmW77Q-RQW7P7utSJf798E3_IahFj1xPDfHa4eXu2K_OLn9ZXJjSv4VJbldLcNg7RVjJXBwTm8HigBXtYE2KuvWlKf2vxCsiVKk6jIwjrInoZtWzdkUo5g" />
                        </div>
                        <div className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-headline font-bold">Organic Yogurt</h4>
                                <span className="text-primary font-bold">$6.20</span>
                            </div>
                            <p className="text-sm text-on-surface-variant mb-6">Ceramic Jar (500g) • Probiotic</p>
                            <button className="w-full py-3 rounded-full bg-surface-container-high font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                                <Plus size={20} /> Add to Cart
                            </button>
                        </div>
                    </div>
                    {/* Product Card 3 */}
                    <div className="min-w-[300px] md:min-w-[380px] bg-surface-container-lowest rounded-xl p-4 ambient-shadow group">
                        <div className="rounded-lg overflow-hidden h-72 mb-6 bg-slate-100">
                            <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Fresh goat milk in a bottle with small wildflowers on the side, soft ethereal lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWgRO0L5xL2YzIi1TsZijJDfjii_ZcFjlIqTlIFzyv9xZepxklVjBE-Qd6qAEJLboK1meNMNjfKOvNSXkDe7zpmZRiZzbiDzdqTBzzKNOQqZtSFZsrbhtfZCT_PjW6ETh__elLp8f3cUhsgpQZaF-oOaj491FMhT3xQ024-k0SouMJNs_kkNmm-O7ewBouNAAbFwAVjN6oGo_riSyvEouRVJ82NaiHAkgrLpLcG9W_EYCUkVGTJ2kKKPm4CQWUBX8e2LMwkLLXvxM" />
                        </div>
                        <div className="px-4 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-xl font-headline font-bold">Goat Milk</h4>
                                <span className="text-primary font-bold">$5.75</span>
                            </div>
                            <p className="text-sm text-on-surface-variant mb-6">Glass Bottle (1L) • Easy Digest</p>
                            <button className="w-full py-3 rounded-full bg-surface-container-high font-bold hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2">
                                <Plus size={20} /> Add to Cart
                            </button>
                        </div>
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
                        <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-8 tracking-tighter">Purely Crafted. <br />Naturally Sourced.</h2>
                        <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                            Our journey begins in the high-altitude pastures where the air is thin and the grass is sweet. Every drop of Alpine Creamery milk is a testament to our commitment to ethical farming and heritage processes.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Grass-fed year round</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Zero-waste loop delivery</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Check size={20} />
                                </div>
                                <span className="font-bold">Small batch bottling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
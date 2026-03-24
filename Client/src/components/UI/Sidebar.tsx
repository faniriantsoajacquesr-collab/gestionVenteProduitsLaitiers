const SidebarFilterSection = ({ title, options }: { title: string, options: string[] }) => (
    <section>
        <h3 className="font-headline font-bold text-lg mb-6 text-primary">{title}</h3>
        <div className="space-y-4">
            {options.map((option) => (
                <label key={option} className="flex items-center group cursor-pointer">
                    <input className="rounded-md border-outline-variant text-primary focus:ring-primary-container w-5 h-5 transition-all" type="checkbox" />
                    <span className="ml-3 font-body text-on-surface-variant group-hover:text-primary transition-colors">{option}</span>
                </label>
            ))}
        </div>
    </section>
);

export default function Sidebar() {
    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-10">
            <SidebarFilterSection title="Product Category" options={["Milk", "Yogurt", "Cheese", "Butter", "Creams"]} />
            <SidebarFilterSection title="Milk Type" options={["Cow", "Goat", "Sheep", "Plant-based"]} />
            <SidebarFilterSection title="Dietary" options={["Organic", "Lactose-free", "Probiotic"]} />

            <div className="p-6 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary relative overflow-hidden group shadow-xl">
                <div className="relative z-10">
                    <p className="font-label text-[10px] tracking-[0.2em] uppercase opacity-80 mb-2">Quick Subscription</p>
                    <h4 className="font-headline font-bold text-xl mb-2">Daily Essentials Box</h4>
                    <p className="text-xs mb-4 opacity-90 leading-relaxed">The freshest milk, butter, and yogurt delivered to your door.</p>
                    <button className="bg-surface-container-lowest text-primary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-on-primary transition-colors">Subscribe &amp; Save</button>
                </div>
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500">inventory_2</span>
            </div>
        </aside>
    );
}
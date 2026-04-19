import socolaitImg from "../../assets/socolait.jpg"

export default function Contact() {
    return (
        <div className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto bg-[#f8fafa]">
            <div className="mb-16 text-center">
                <span className="font-label text-xs font-bold tracking-[0.1em] uppercase text-primary mb-4 block">Nous Joindre</span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">Une question sur nos <span className="text-primary italic">produits laitiers</span>?</h1>
                <p className="max-w-2xl mx-auto text-lg text-on-surface-variant leading-relaxed">L'équipe Socolait est disponible pour répondre à vos questions sur nos produits, nos partenariats ou vos commandes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Contact Info & Buttons */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="bg-white p-10 rounded-xl shadow-ambient">
                        <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Socolait Madagascar</h2>
                        <div className="space-y-4 mb-8">
                            <div>
                                <h3 className="font-bold text-on-surface">Adresse Siège</h3>
                                <p className="text-on-surface-variant">Antsirabe, Vakinankaratra<br/>Madagascar</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-on-surface">Téléphone</h3>
                                <p className="text-on-surface-variant">+261 32 98 80 072</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-on-surface">Email</h3>
                                <p className="text-on-surface-variant">contact@socolait.mg</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-on-surface">Heures d'ouverture</h3>
                                <p className="text-on-surface-variant">Lundi - Vendredi: 08:00 - 18:00<br/>Samedi: 09:00 - 13:00</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => window.location.href = 'mailto:contact@socolait.mg'}
                                className="group surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-container-lowest transition-all border border-transparent hover:border-primary/10"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined" data-icon="mail" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
                                </div>
                                <span className="font-headline font-bold text-on-surface">Email</span>
                                <span className="text-sm text-on-surface-variant">Réponse en 24h</span>
                            </button>
                            <button 
                                onClick={() => window.open('https://wa.me/261329880072', '_blank')}
                                className="group surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-container-lowest transition-all border border-transparent hover:border-primary/10"
                            >
                                <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined" data-icon="chat" style={{fontVariationSettings: "'FILL' 1"}}>chat</span>
                                </div>
                                <span className="font-headline font-bold text-on-surface">WhatsApp</span>
                                <span className="text-sm text-on-surface-variant">Support instantané</span>
                            </button>
                        </div>
                    </div>
                </div>
            {/* Right Column: Minimalist Map & Details */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="relative h-[500px] lg:h-full w-full rounded-xl overflow-hidden shadow-ambient">
                    <img src={socolaitImg} alt="Socolait" className="absolute inset-0 w-full h-full object-cover" />
            {/* Location Card */}
                    <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 glass-nav p-6 rounded-lg shadow-lg">
                        <h3 className="font-headline font-bold text-primary mb-1">Socolait - Antsirabe</h3>
                        <p className="text-sm text-on-surface-variant mb-4">Vakinankaratra, Madagascar</p>
                        <div className="flex items-center text-xs font-label font-bold tracking-wider uppercase text-on-surface">
                            <span className="material-symbols-outlined text-sm mr-2" data-icon="schedule">schedule</span>
                                        Ouvert 08:00 - 18:00
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}
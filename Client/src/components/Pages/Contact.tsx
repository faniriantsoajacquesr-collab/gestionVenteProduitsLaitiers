import PrimaryBtn from "../UI/PrimaryBtn";
export default function Contact() {
    return (
        
        <div className="pt-32 pb-20 px-6 max-w-screen-2xl mx-auto bg-[#f8fafa]">
            <div className="mb-16 text-center">
                <span className="font-label text-xs font-bold tracking-[0.1em] uppercase text-primary mb-4 block">Get In Touch</span>
                <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-on-surface mb-6">Let's start a <span className="text-primary italic">fresh</span> conversation.</h1>
                <p className="max-w-2xl mx-auto text-lg text-on-surface-variant leading-relaxed">Whether you have questions about our alpine farms or want to stock our premium dairy, our family is here to help.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Contact Form */}
                <div className="lg:col-span-5 flex flex-col gap-8 ">
                    <div className=" p-10 rounded-xl ">
                        <form action="#" className="space-y-6 bg-white p-10 rounded-xl shadow-ambient">
                            <div className="space-y-2 ">
                                <label className="font-label text-[0.75rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant px-4">Full Name</label>
                                <input className="w-full px-6 py-4 surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant outline-none" placeholder="Julian Alpine" type="text"/>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-[0.75rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant px-4">Email Address</label>
                                <input className="w-full px-6 py-4 surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant outline-none" placeholder="hello@alpinecreamery.com" type="email"/>
                            </div>
                            <div className="space-y-2">
                                <label className="font-label text-[0.75rem] font-bold tracking-[0.1em] uppercase text-on-surface-variant px-4">Your Message</label>
                                <textarea className="w-full px-6 py-4 surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant outline-none resize-none" placeholder="Tell us how we can help..." rows={5}></textarea>
                            </div>
                            <PrimaryBtn displayText="Send Message" />
                        </form>
                    </div>
                    
            {/* Contact Shortcut Cards */}
            <div className="grid grid-cols-2 gap-4">
                <a className="group surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-container-lowest transition-all border border-transparent hover:border-primary/10" href="#">
                    <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" data-icon="chat" style={{fontVariationSettings: "'FILL' 1"}}>chat</span>
                    </div>
                    <span className="font-headline font-bold text-on-surface">WhatsApp</span>
                    <span className="text-sm text-on-surface-variant">Instant Support</span>
                </a>
                <a className="group surface-container-low p-6 rounded-xl flex flex-col items-center justify-center text-center hover:bg-surface-container-lowest transition-all border border-transparent hover:border-primary/10" href="#">
                    <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined" data-icon="mail" style={{fontVariationSettings: "'FILL' 1"}}>mail</span>
                    </div>
                    <span className="font-headline font-bold text-on-surface">Email Us</span>
                    <span className="text-sm text-on-surface-variant">24h Response</span>
                </a>
            </div>
            
            </div>
            {/* Right Column: Minimalist Map & Details */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="relative h-[500px] lg:h-full w-full rounded-xl overflow-hidden shadow-ambient">
                    <div className="absolute inset-0 bg-slate-200">
                        <img className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" data-alt="Minimalist aerial map view of a clean mountain valley with soft morning fog and scattered alpine cottages" data-location="Swiss Alps" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC00mmkSDh-mSoWjz37LdyTZAs-rKovbOf7Roq9dudwyaJhAFlcMrqeKVlCkgnkuYoPqlS9hfq68-piPKZazlZ_SAvC3pyrzNLtbxabQtBxrJpe9zACroWwgRwXN9IVr1yUWHPq4jLsnDVO9MO25Zj-V4PSE13_Z6_NBL09IcPpFHMvfymxAmLbal4baUZ-KGY2UCXzQGyc8EeUhRaHH_JMPvXMdj-Rl9e1udsZjOaKWvoLoUga6orkni7kwTNcemI7ah1SQfB1po0"/>
                    </div>
            {/* Map Pin Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 scale-150"></div>
                                <div className="relative bg-white p-4 rounded-full shadow-xl flex items-center justify-center border-4 border-primary-container">
                                    <span className="material-symbols-outlined text-primary text-3xl" data-icon="location_on" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
                                </div>
                            </div>
                        </div>
            {/* Location Card */}
                    <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 glass-nav p-6 rounded-lg shadow-lg">
                        <h3 className="font-headline font-bold text-primary mb-1">Alpine Flagship Dairy</h3>
                        <p className="text-sm text-on-surface-variant mb-4">122 Creamery Lane, Vals, Switzerland</p>
                        <div className="flex items-center text-xs font-label font-bold tracking-wider uppercase text-on-surface">
                            <span className="material-symbols-outlined text-sm mr-2" data-icon="schedule">schedule</span>
                                        Open 08:00 - 18:00
                        </div>
                    </div>
                </div>
            </div>
        </div>   
        </div>
    )
}
import { Link } from "react-router-dom";
import { ShoppingBag, User } from 'lucide-react';

function Navbar (){
   return(
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm shadow-sky-900/5 bg-amber-200">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] tracking-tight">
            <div className="text-2xl font-bold tracking-tighter text-sky-900 dark:text-sky-100">
                Alpine Creamery
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <Link className="text-slate-600 dark:text-slate-400 hover:text-sky-600 transition-colors hover:scale-105 transition-transform duration-300" to="#">Home</Link>
                <Link className="text-slate-600 dark:text-slate-400 hover:text-sky-600 transition-colors hover:scale-105 transition-transform duration-300" to="#">Explore</Link>
                <Link className="text-slate-600 dark:text-slate-400 hover:text-sky-600 transition-colors hover:scale-105 transition-transform duration-300" to="#">About Us</Link>
                <Link className="text-sky-700 dark:text-sky-400 font-bold border-b-2 border-sky-600 pb-1 hover:scale-105 transition-transform duration-300" to="#">Contact</Link>
            </div>
            <div className="flex items-center space-x-5">
                <button className="text-sky-700 dark:text-sky-400 transition-all active:opacity-80 active:scale-95">
                    <ShoppingBag size={24} />
                </button>
                <button className="text-sky-700 dark:text-sky-400 transition-all active:opacity-80 active:scale-95">
                    <User size={24} />
                </button>
            </div>
        </div>
    </nav>
   ) 
}

export default Navbar;
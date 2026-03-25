import { Link } from "react-router-dom";

export default function Footer ()
{
    return(
        <footer className="w-full border-t border-slate-200 bg-slate-50">
            <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-10 gap-6">
                <div className="text-lg font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                                Alpine Creamery
                </div>
                <div className="flex flex-wrap justify-center gap-8 font-['Manrope'] text-sm tracking-wide uppercase">
                    <Link className="text-slate-500  hover:text-sky-600  transition-colors hover:underline decoration-sky-200" to="#">Privacy Policy</Link>
                    <Link className="text-slate-500  hover:text-sky-600  transition-colors hover:underline decoration-sky-200" to="#">Terms of Service</Link>
                    <Link className="text-slate-500  hover:text-sky-600  transition-colors hover:underline decoration-sky-200" to="#">Shipping</Link>
                    <Link className="text-slate-500  hover:text-sky-600  transition-colors hover:underline decoration-sky-200" to="#">Sustainability</Link>
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-['Manrope']">
                                © 2024 Alpine Creamery. Purely Crafted.
                </div>
            </div>
        </footer>
    )

}
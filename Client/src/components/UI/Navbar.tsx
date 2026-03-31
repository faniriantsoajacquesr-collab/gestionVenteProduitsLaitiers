import { NavLink, useLocation } from "react-router-dom";
import { DropdownMenuAvatar } from "./ProfileBtn";
import ProductNavbar from "./productSidebar";
import { useSidebar } from "../../contexts/SidebarContext";import { ShoppingBagIcon, ShoppingCartIcon } from "lucide-react";

function Navbar () {
   const location = useLocation();
   const isProductsPage = location.pathname === "/products";
   const { isCollapsed, toggleSidebar, toggleCart } = useSidebar();

   return (
    <>
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm shadow-sky-900/5">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-screen-2xl mx-auto font-['Plus_Jakarta_Sans'] tracking-tight">
            <div className="text-2xl font-bold tracking-tighter text-sky-900 dark:text-sky-100">
                Alpine Creamery
            </div>
            <div className="hidden md:flex items-center space-x-8">
                <NavLink
                    className={({ isActive }) =>
                        `transition-colors hover:scale-105 transition-transform duration-300 ${
                            isActive ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-slate-600 dark:text-slate-400'
                        }`
                    }
                    to="/"
                >
                    Home
                </NavLink>
                <NavLink className={({isActive})=> `transition-colors hover:scale-105 transition-transform duration-300 ${isActive ? "text-sky-700 dark:text-sky-400 font-bold" : "text-slate-600 dark:text-slate-400"}`} to="/products">
                    Products
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `transition-colors hover:scale-105 transition-transform duration-300 ${
                            isActive ? 'text-sky-700 dark:text-sky-400 font-bold border-b-2 border-sky-600 pb-1' : 'text-slate-600 dark:text-slate-400'
                        }`
                    }
                    to="/contact"
                >
                    Contact
                </NavLink>
            </div>
            <div className="flex items-center space-x-5">
                <button onClick={() => toggleCart(true)} className="text-sky-700 dark:text-sky-400 transition-all active:opacity-80 active:scale-95">
                    <ShoppingBagIcon></ShoppingBagIcon>
                </button>
                <button onClick={() => toggleCart(true)} className="text-sky-700 dark:text-sky-400 transition-all active:opacity-80 active:scale-95">
                    <ShoppingCartIcon></ShoppingCartIcon>
                </button>
                <DropdownMenuAvatar />
            </div>
        </div>
    </nav>
    {isProductsPage && <ProductNavbar isCollapsed={isCollapsed} onToggleCollapse={toggleSidebar} />}
    </>
   )
}

export default Navbar;
import { Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Products from './components/Pages/Products';
import Contact from './components/Pages/Contact';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/products" element={<Products/>} />
            <Route path="/contact" element={<Contact/>} />
        </Routes>
    );
}

export default AppRoutes;
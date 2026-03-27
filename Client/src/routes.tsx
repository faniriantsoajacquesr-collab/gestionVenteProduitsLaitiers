import type { RouteObject } from 'react-router-dom';
import App from './App';
import Home from './components/Pages/Home';
import Products from './components/Pages/Products';
import Contact from './components/Pages/Contact';
import SignUpPage from './components/Pages/SignUp';
import LoginPage from './components/Pages/Login';


export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'products',
                element: <Products />,
            },
            {
                path: 'contact',
                element: <Contact />,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/signUp',
        element: <SignUpPage/>
    }
];
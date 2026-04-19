import { useState, useEffect } from 'react'
import Sidebar from './components/UI/Sidebar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Clients from './pages/Clients'
import Orders from './pages/Orders'
import AdminLoginPage from './pages/AdminLoginPage'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'

type PageId = 'dashboard' | 'products' | 'clients' | 'orders'

const pages: Record<PageId, React.ComponentType> = {
  dashboard: Dashboard,
  products: Products,
  clients: Clients,
  orders: Orders,
}

function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [adminUsername, setAdminUsername] = useState<string>('')
  const PageComponent = pages[activePage]

  useEffect(() => {
    // Check if user is authenticated on mount
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        setIsAuthenticated(true)
        // Fetch admin username
        fetchAdminUsername(session.access_token)
      }
    } catch (err) {
      console.error('Auth check error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAdminUsername = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const profile = await response.json()
      setAdminUsername(profile?.email || profile?.username || 'Admin')
    } catch (err) {
      console.error('Error fetching admin profile:', err)
    }
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    checkAuth()
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      setIsAuthenticated(false)
      setAdminUsername('')
      window.location.href = '/admin-login'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLoginPage onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <Toaster position="top-right" />
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} adminUsername={adminUsername} />
      <main className="transition-all duration-300 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">
          <PageComponent />
        </div>
      </main>
    </div>
  )
}

export default App

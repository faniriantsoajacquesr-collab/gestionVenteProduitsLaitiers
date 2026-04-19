import { useState, useEffect } from 'react'
import { TrendingUp, Package, Users, ShoppingCart, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { api } from '../lib/api'

interface Stats {
  products: number
  clients: number
  orders: number
  loading: boolean
  error: string | null
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ products: 0, clients: 0, orders: 0, loading: true, error: null })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setStats(prev => ({ ...prev, loading: true, error: null }))
    try {
      console.log('Fetching data from API...')
      
      const productsPromise = api.produits.getAll()
      const clientsPromise = api.clients.getAll()
      const ordersPromise = api.orders.getAll()
      
      const [products, clients, orders] = await Promise.all([
        productsPromise,
        clientsPromise,
        ordersPromise
      ])
      
      console.log('Products:', products)
      console.log('Clients:', clients)
      console.log('Orders:', orders)
      
      setStats({
        products: Array.isArray(products) ? products.length : 0,
        clients: Array.isArray(clients) ? clients.length : 0,
        orders: Array.isArray(orders) ? orders.length : 0,
        loading: false,
        error: null
      })
    } catch (err) {
      console.error('Error loading stats:', err)
      setStats(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Erreur de chargement' 
      }))
    }
  }

  const statCards = [
    { title: 'Commandes', value: stats.loading ? '...' : stats.orders, change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Produits', value: stats.loading ? '...' : stats.products, change: '+4.1%', icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Clients', value: stats.loading ? '...' : stats.clients, change: '+23.1%', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  ]

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-on-surface-variant">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (stats.error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          <p className="font-medium">Erreur: {stats.error}</p>
          <button 
            onClick={loadStats} 
            className="mt-2 flex items-center gap-2 text-sm hover:underline"
          >
            <RefreshCw className="w-4 h-4" /> Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Tableau de bord</h1>
          <p className="text-on-surface-variant text-sm mt-1">Bienvenue dans votre espace d'administration</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Activity className="w-4 h-4" />
          <span className="hidden sm:inline">{new Date().toLocaleTimeString()}</span>
          <button onClick={loadStats} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-on-surface">{stat.value}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-1">{stat.title}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-4">Statistiques rapides</h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-surface-container hover:bg-surface-container/80 transition-colors">
              <span className="text-on-surface-variant text-sm sm:text-base">Total des produits</span>
              <span className="font-bold text-on-surface text-lg">{stats.products}</span>
            </div>
            <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-surface-container hover:bg-surface-container/80 transition-colors">
              <span className="text-on-surface-variant text-sm sm:text-base">Total des clients</span>
              <span className="font-bold text-on-surface text-lg">{stats.clients}</span>
            </div>
            <div className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-surface-container hover:bg-surface-container/80 transition-colors">
              <span className="text-on-surface-variant text-sm sm:text-base">Total des commandes</span>
              <span className="font-bold text-on-surface text-lg">{stats.orders}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant shadow-sm">
          <h3 className="font-bold text-lg text-on-surface mb-4">Bienvenue</h3>
          <div className="flex items-center justify-center h-32 sm:h-40 text-on-surface-variant text-sm sm:text-base">
            <p className="text-center">Panel d'administration<br />Dairy Products</p>
          </div>
        </div>
      </div>
    </div>
  )
}

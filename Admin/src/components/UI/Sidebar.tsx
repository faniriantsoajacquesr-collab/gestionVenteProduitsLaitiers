import { Home, Package, Users, ShoppingCart, LogOut, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

type PageId = 'dashboard' | 'products' | 'clients' | 'orders'

const menuItems = [
  { id: 'dashboard' as PageId, label: 'Tableau de bord', icon: Home },
  { id: 'products' as PageId, label: 'Produits', icon: Package },
  { id: 'clients' as PageId, label: 'Clients', icon: Users },
  { id: 'orders' as PageId, label: 'Commandes', icon: ShoppingCart },
]

interface SidebarProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
  onLogout: () => void
  adminUsername?: string
}

export default function Sidebar({ activePage, setActivePage, onLogout, adminUsername }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-surface-container rounded-lg transition-colors"
      >
        {mobileOpen ? (
          <X className="w-6 h-6 text-on-surface" />
        ) : (
          <Menu className="w-6 h-6 text-on-surface" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen bg-surface-container-lowest border-r border-outline-variant transition-all duration-300 z-40 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileOpen ? 'w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className={`h-16 flex items-center border-b border-outline-variant ${collapsed && 'hidden lg:flex'} ${collapsed ? 'justify-center px-2' : 'px-6'}`}>
            {!collapsed && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <span className="text-on-primary font-bold text-lg">SL</span>
                </div>
                <div>
                  <h1 className="font-bold text-on-surface text-sm">Socolait Madagascar</h1>
                  <p className="text-xs text-on-surface-variant">Panneau d'administration</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-on-primary font-bold text-lg">SL</span>
              </div>
            )}
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activePage === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id)
                    setMobileOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/25' 
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  } ${collapsed && 'hidden lg:flex'} ${collapsed ? 'lg:justify-center' : ''}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          <div className="p-3 border-t border-outline-variant space-y-3">
            {adminUsername && !collapsed && (
              <div className="px-3 py-2 bg-surface-container rounded-lg">
                <p className="text-xs text-on-surface-variant">Connecté en tant que</p>
                <p className="text-sm font-medium text-on-surface truncate">{adminUsername}</p>
              </div>
            )}
            <button 
              onClick={onLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error transition-all duration-200 hover:bg-error/10 ${collapsed && 'hidden lg:flex'} ${collapsed ? 'lg:justify-center' : ''}`}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">Déconnexion</span>}
            </button>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-surface-container-lowest border border-outline-variant rounded-full hidden lg:flex items-center justify-center shadow-md hover:bg-surface-container transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-on-surface-variant" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-on-surface-variant" />
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

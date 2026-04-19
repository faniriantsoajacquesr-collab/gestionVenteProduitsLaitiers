import { useState, useEffect } from 'react'
import { Eye, X, Package, Trash2, Edit2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { api } from '../lib/api'

interface OrderItem {
  id: string
  quantity: number
  products: {
    name: string
  }
}

interface Order {
  id: string
  user_id: string
  email: string
  delivery_address: string
  contact_phone: string
  total_amount: number
  status: string
  delivery_date?: string
  created_at: string
  order_items: OrderItem[]
  profiles: {
    first_name: string
    last_name: string
  } | null
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tous')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingDeliveryDate, setEditingDeliveryDate] = useState<string>('')
  const [editingStatus, setEditingStatus] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await api.orders.getAll()
      setOrders(data)
      setError(null)
    } catch (err) { setError((err as Error).message) }
    finally { setLoading(false) }
  }

  const openEditModal = (order: Order) => {
    setSelectedOrder(order)
    setIsEditMode(true)
    setEditingDeliveryDate(order.delivery_date?.split('T')[0] || '')
    setEditingStatus(order.status)
    setHasChanges(false)
  }

  const openViewModal = (order: Order) => {
    setSelectedOrder(order)
    setIsEditMode(false)
    setEditingDeliveryDate(order.delivery_date?.split('T')[0] || '')
    setEditingStatus(order.status)
    setHasChanges(false)
  }

  const handleDateChange = (newDate: string) => {
    setEditingDeliveryDate(newDate)
    if (selectedOrder && (newDate !== (selectedOrder.delivery_date?.split('T')[0] || '') || editingStatus !== selectedOrder.status)) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }
  }

  const handleStatusChange = (newStatus: string) => {
    setEditingStatus(newStatus)
    if (selectedOrder && (newStatus !== selectedOrder.status || editingDeliveryDate !== (selectedOrder.delivery_date?.split('T')[0] || ''))) {
      setHasChanges(true)
    } else {
      setHasChanges(false)
    }
  }

  const closeModal = () => {
    setSelectedOrder(null)
    setIsEditMode(false)
    setHasChanges(false)
    setEditingDeliveryDate('')
    setEditingStatus('')
  }

  const handleCancelChanges = () => {
    closeModal()
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user_id?.toLowerCase().includes(search.toLowerCase()) || 
      order.delivery_address?.toLowerCase().includes(search.toLowerCase()) ||
      order.email?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'Tous' || order.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.orders.updateStatus(id, status)
      loadOrders()
      const statusLabel = getStatusLabel(status)
      toast.success(`Statut mis à jour en ${statusLabel}`)
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) return
    try {
      await api.orders.delete(id)
      loadOrders()
      setSelectedOrder(null)
      toast.success('Commande supprimée avec succès')
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleUpdateDeliveryDate = async (id: string, date: string) => {
    if (!date && isEditMode) {
      setError('Veuillez sélectionner une date')
      toast.error('Veuillez sélectionner une date')
      return
    }
    try {
      // Mettre à jour la date et le statut
      if (editingStatus !== selectedOrder?.status) {
        await api.orders.updateStatus(id, editingStatus)
        const statusLabel = getStatusLabel(editingStatus)
        toast.success(`Statut mis à jour en ${statusLabel}`)
      }
      if (date && date !== (selectedOrder?.delivery_date?.split('T')[0] || '')) {
        await api.orders.updateDeliveryDate(id, date)
        const formattedDate = new Date(date).toLocaleDateString('fr-FR')
        toast.success(`Date de livraison fixée au ${formattedDate}`)
      }
      loadOrders()
      closeModal()
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'processing': 'bg-blue-100 text-blue-700',
      'shipped': 'bg-purple-100 text-purple-700',
      'delivered': 'bg-green-100 text-green-700',
      'cancelled': 'bg-red-100 text-red-700'
    }
    return badges[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'En attente',
      'processing': 'En cours',
      'shipped': 'Expédié',
      'delivered': 'Livré',
      'cancelled': 'Annulé'
    }
    return labels[status] || status
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-on-surface">Gestion des commandes</h1><p className="text-on-surface-variant text-sm mt-1">{orders.length} commande(s)</p></div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm">
          <option value="Tous">Tous</option>
          <option value="pending">En attente</option>
          <option value="processing">En cours</option>
          <option value="delivered">Livré</option>
          <option value="cancelled">Annulé</option>
        </select>
      </div>
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-outline-variant bg-surface-container">
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">ID</th>
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase hidden sm:table-cell">Client</th>
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Total</th>
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase hidden md:table-cell">Date</th>
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase hidden lg:table-cell">Livraison</th>
              <th className="text-left px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Statut</th>
              <th className="text-right px-3 md:px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-outline-variant">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-surface-container transition-colors">
                  <td className="px-3 md:px-6 py-4"><span className="font-medium text-primary text-xs">{order.id?.slice(0, 6)}...</span></td>
                  <td className="px-3 md:px-6 py-4 text-on-surface text-xs hidden sm:table-cell">{order.profiles?.first_name}</td>
                  <td className="px-3 md:px-6 py-4 font-bold text-on-surface text-sm">{order.total_amount?.toLocaleString()} Ar</td>
                  <td className="px-3 md:px-6 py-4 text-on-surface-variant text-xs hidden md:table-cell">{formatDate(order.created_at)}</td>
                  <td className="px-3 md:px-6 py-4 text-on-surface-variant text-xs hidden lg:table-cell font-medium text-blue-600">{order.delivery_date ? formatDate(order.delivery_date) : 'Non définie'}</td>
                  <td className="px-3 md:px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>{getStatusLabel(order.status)}</span></td>
                  <td className="px-3 md:px-6 py-4"><div className="flex items-center justify-end gap-2">
                    <button onClick={() => openViewModal(order)} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-primary" title="Voir les détails"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openEditModal(order)} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-blue-600" title="Modifier"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteOrder(order.id)} className="p-2 hover:bg-surface-container rounded-lg transition-colors text-red-600" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {filteredOrders.length === 0 && <div className="text-center py-12"><Package className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" /><p className="text-on-surface-variant">Aucune commande trouvée</p></div>}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-outline-variant sticky top-0 bg-surface-container-lowest"><h2 className="text-xl font-bold text-on-surface">{isEditMode ? 'Modifier la commande' : 'Détails de la commande'}</h2><button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-surface-container rounded-lg transition-colors"><X className="w-5 h-5 text-on-surface-variant" /></button></div>
            <div className="p-6 space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><p className="text-xs text-on-surface-variant uppercase mb-1">Client</p><p className="text-on-surface font-medium">{selectedOrder.profiles?.first_name} {selectedOrder.profiles?.last_name}</p></div>
                <div><p className="text-xs text-on-surface-variant uppercase mb-1">Email</p><p className="text-on-surface font-medium text-sm">{selectedOrder.email || '-'}</p></div>
                <div><p className="text-xs text-on-surface-variant uppercase mb-1">Téléphone</p><p className="text-on-surface font-medium">{selectedOrder.contact_phone || '-'}</p></div>
                <div><p className="text-xs text-on-surface-variant uppercase mb-1">Total</p><p className="text-2xl font-bold text-primary">{selectedOrder.total_amount?.toLocaleString()} Ar</p></div>
              </div>

              {/* Address and Dates */}
              <div className="space-y-4 p-4 bg-surface-container rounded-xl">
                <div><p className="text-xs text-on-surface-variant uppercase mb-1">Adresse de livraison</p><p className="text-on-surface">{selectedOrder.delivery_address}</p></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><p className="text-xs text-on-surface-variant uppercase mb-1">Date de commande</p><p className="text-on-surface">{formatDate(selectedOrder.created_at)}</p></div>
                  <div><p className="text-xs text-on-surface-variant uppercase mb-1">Date de livraison prévue</p><p className="text-on-surface">{selectedOrder.delivery_date ? formatDate(selectedOrder.delivery_date) : '-'}</p></div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                <h3 className="font-semibold text-on-surface">Produits commandés</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                    selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-surface-container rounded-lg">
                        <div className="flex-1">
                          <p className="text-on-surface font-medium text-sm">{item.products?.name}</p>
                          <p className="text-xs text-on-surface-variant">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-on-surface-variant text-sm">Aucun produit</p>
                  )}
                </div>
              </div>

              {/* Status Section - Show label in view mode, select in edit mode */}
              <div className="p-4 bg-surface-container rounded-xl space-y-3">
                <p className="text-xs text-on-surface-variant uppercase font-semibold">Statut</p>
                {isEditMode ? (
                  <select 
                    value={editingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface font-medium text-sm"
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En cours</option>
                    <option value="shipped">Expédié</option>
                    <option value="delivered">Livré</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                ) : (
                  <span className={`inline-block px-3 py-2 rounded-lg font-medium text-sm ${getStatusBadge(editingStatus)}`}>
                    {getStatusLabel(editingStatus)}
                  </span>
                )}
              </div>

              {/* Date Editing Section - Only visible in edit mode */}
              {isEditMode && (
                <div className="p-4 bg-surface-container rounded-xl space-y-3">
                  <p className="text-xs text-on-surface-variant uppercase font-semibold">Date de livraison</p>
                  <input 
                    type="date" 
                    value={editingDeliveryDate} 
                    onChange={(e) => handleDateChange(e.target.value)} 
                    className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface text-sm" 
                  />
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-outline-variant bg-surface-container-lowest flex gap-3 justify-end sticky bottom-0">
              {isEditMode ? (
                <>
                  <button 
                    onClick={handleCancelChanges}
                    className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-medium hover:bg-surface-container text-sm"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => handleUpdateDeliveryDate(selectedOrder.id, editingDeliveryDate)}
                    className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 text-sm"
                  >
                    Mettre à jour
                  </button>
                </>
              ) : (
                <>
                  {hasChanges && (
                    <>
                      <button 
                        onClick={handleCancelChanges}
                        className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-medium hover:bg-surface-container text-sm"
                      >
                        Annuler
                      </button>
                      <button 
                        onClick={() => handleUpdateDeliveryDate(selectedOrder.id, editingDeliveryDate)}
                        className="px-4 py-2 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 text-sm"
                      >
                        Mettre à jour
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-lg font-medium hover:bg-surface-container text-sm"
                  >
                    Fermer
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

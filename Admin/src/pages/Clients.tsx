import { useState, useEffect } from 'react'
import { Search, User, Edit2, Check, X } from 'lucide-react'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'

interface Client {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  delivery_address: string
  role: string
  updated_at: string
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [editingClientId, setEditingClientId] = useState<string | null>(null)
  const [editingRole, setEditingRole] = useState<string>('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => { loadClients() }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await api.clients.getAll()
      setClients(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) { setError(err instanceof Error ? err.message : 'Erreur de chargement') }
    finally { setLoading(false) }
  }

  const handleUpdateRole = async (clientId: string, newRole: string) => {
    if (newRole === clients.find(c => c.id === clientId)?.role) {
      setEditingClientId(null)
      return
    }
    
    setUpdatingId(clientId)
    try {
      await api.clients.update(clientId, { role: newRole })
      setClients(clients.map(c => c.id === clientId ? { ...c, role: newRole } : c))
      setEditingClientId(null)
      toast.success('Rôle mis à jour avec succès')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredClients = clients.filter(client => {
    const name = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = { 'admin': 'bg-purple-100 text-purple-700', 'client': 'bg-blue-100 text-blue-700' }
    return badges[role] || 'bg-gray-100 text-gray-700'
  }

  const getFullName = (client: Client) => `${client.first_name || ''} ${client.last_name || ''}`.trim() || 'Client'

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Liste des clients</h1>
          <p className="text-on-surface-variant text-sm mt-1">{clients.length} client(s)</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-lg">{getFullName(client).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-on-surface text-sm line-clamp-1">{getFullName(client)}</h3>
                {editingClientId === client.id ? (
                  <div className="flex gap-2 mt-1">
                    <select
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="px-2 py-0.5 rounded text-xs bg-surface-container border border-outline-variant text-on-surface"
                    >
                      <option value="client">Client</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleUpdateRole(client.id, editingRole)}
                      disabled={updatingId === client.id}
                      className="p-1 rounded hover:bg-primary/20 text-primary"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => setEditingClientId(null)}
                      className="p-1 rounded hover:bg-error/20 text-error"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(client.role)}`}>
                      {client.role}
                    </span>
                    <button
                      onClick={() => {
                        setEditingClientId(client.id)
                        setEditingRole(client.role)
                      }}
                      className="p-1 rounded hover:bg-surface-container transition-colors"
                    >
                      <Edit2 size={14} className="text-on-surface-variant" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-on-surface-variant text-xs sm:text-sm truncate">{client.phone_number || '-'}</p>
              <p className="text-on-surface-variant text-xs sm:text-sm truncate">{client.delivery_address || '-'}</p>
              <p className="text-xs text-on-surface-variant">Inscrit: {formatDate(client.updated_at)}</p>
            </div>
          </div>
        ))}
      </div>
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" />
          <p className="text-on-surface-variant">Aucun client trouvé</p>
        </div>
      )}
    </div>
  )
}

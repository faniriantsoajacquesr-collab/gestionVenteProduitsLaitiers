import { useState, useEffect } from 'react'
import { Search, User } from 'lucide-react'
import { api } from '../lib/api'
import { toast } from 'react-hot-toast'
import UserCard from "../components/UI/UserCard"
import UserModal from '../components/UI/UserModal' 
interface Client {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number: string
  address: string
  role: string
  avatar_url?: string
  created_at: string
  last_sign_in_at?: string
  updated_at: string
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState<Client | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  useEffect(() => { loadClients() }, [])

  const loadClients = async () => {
    try {
      setLoading(true)
      const data = await api.clients.getAll()
      setClients(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Erreur de chargement') 
    } finally { 
      setLoading(false) 
    }
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await api.clients.delete(userToDelete); // Ensure your API has this method
      setClients(clients.filter(c => c.id !== userToDelete));
      toast.success('Utilisateur supprimé avec succès');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setUserToDelete(null);
    }
  }

  const filteredClients = clients.filter(client => {
    const name = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase()
    return name.includes(search.toLowerCase())
  })

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div></div>

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Liste des utilisateurs</h1>
          <p className="text-on-surface-variant text-sm mt-1">{clients.length} client(s)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-xl text-on-surface text-sm" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClients.map((client) => (
          <UserCard 
            key={client.id} 
            user={client} 
            onOpen={(user) => {
              setSelectedUser(user);
              setIsEditModalOpen(true);
            }} 
            onDelete={(id) => setUserToDelete(id)} 
          />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-50" />
          <p className="text-on-surface-variant">Aucun client trouvé</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold mb-2">Confirmer la suppression</h3>
            <p className="text-sm text-slate-500 mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal Wrapper */}
      <UserModal 
        user={selectedUser} 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onUpdate={(updatedUser) => {
           // Handle the state update here after successful API call
           setClients(clients.map(c => c.id === updatedUser.id ? updatedUser : c));
           setIsEditModalOpen(false);
        }}
      />
    </div>
  )
}
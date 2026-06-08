import { X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { toast } from 'react-hot-toast';

type UserType = {
  id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  role?: string;
  avatar_url?: string;
  created_at?: string;
  last_sign_in_at?: string;
}

interface UserModalProps {
  user: UserType | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (updated: any) => void;
}

export default function UserModal({ user, isOpen, onClose, onUpdate }: UserModalProps) {
  const [form, setForm] = useState<Partial<UserType & { email?: string }>>({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    role: 'client'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        role: user.role || 'client'
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const formatDate = (d: string | undefined) => d ? new Date(d).toLocaleDateString('fr-FR') : 'N/A';

  const handleChange = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = {
        first_name: form.first_name,
        last_name: form.last_name,
        phone_number: form.phone_number,
        address: form.address,
        role: form.role
      };

      const updated = await api.clients.update(user.id, updates);

      toast.success('Utilisateur mis à jour');
      onUpdate && onUpdate(updated);
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Fiche Utilisateur</h2>
            <p className="text-slate-500 text-sm">ID: {user.id.slice(0, 8)}...</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Photo + role */}
            <div className="col-span-1 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-xl overflow-hidden mb-4 bg-slate-50 border border-slate-200">
                {user.avatar_url ? (
                  <img src={user.avatar_url.startsWith('http') ? user.avatar_url : `http://localhost:5000${user.avatar_url}`} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100">
                    <User size={48} className="text-slate-400" />
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 border border-slate-200">Membre {form.role}</span>
              <div className="mt-4 space-y-1">
                <p className="text-slate-500 text-xs">Inscrit le {formatDate(user.created_at)}</p>
                <p className="text-slate-500 text-xs">Dernier login {formatDate(user.last_sign_in_at)}</p>
              </div>
            </div>

            {/* Form fields */}
            <div className="col-span-2 space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="first_name" className="block text-sm font-medium text-slate-700">Prénom</label>
                  <input id="first_name" value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="Ex: Jean" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="last_name" className="block text-sm font-medium text-slate-700">Nom</label>
                  <input id="last_name" value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="Ex: Dupont" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Adresse Email</label>
                <input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="jean.dupont@email.com" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="phone_number" className="block text-sm font-medium text-slate-700">Téléphone</label>
                  <input id="phone_number" value={form.phone_number} onChange={(e) => handleChange('phone_number', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="+261 34 00 000 00" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="address" className="block text-sm font-medium text-slate-700">Adresse</label>
                  <input id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" placeholder="Quartier, Ville" />
                </div>
              </div>

              {/* Role toggle */}
              <div className="space-y-2 pt-2">
                <label className="block text-sm font-medium text-slate-700">Rôle de l'utilisateur</label>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleChange('role','client')} 
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${form.role === 'client' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                  >
                    Client
                  </button>
                  <button 
                    onClick={() => handleChange('role','admin')} 
                    className={`px-5 py-2 rounded-lg border text-sm font-medium transition-colors ${form.role === 'admin' ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'}`}
                  >
                    Administrateur
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
          <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
}
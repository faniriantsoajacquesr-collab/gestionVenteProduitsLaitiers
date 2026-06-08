import { Trash2, User, Mail, Calendar, LogIn, Phone, MapPin } from 'lucide-react';

interface UserCardProps {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    avatar_url?: string;
    created_at: string;
    last_sign_in_at?: string;
    phone_number?: string;
    address?: string;
  };
  onOpen: (user: any) => void;
  onDelete: (id: string) => void;
}

export default function UserCard({ user, onOpen, onDelete }: UserCardProps) {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="group max-w-sm mx-auto bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-xl hover:translate-y-[-8px] cursor-pointer border border-outline-variant">
      {/* Photo/Avatar Section - like ProductCard image */}
      <div className="relative aspect-square bg-surface-container-low overflow-hidden">
        {user.avatar_url ? (
          <img 
            src={user.avatar_url.startsWith('http') ? user.avatar_url : `http://localhost:5000${user.avatar_url}`} 
            alt={`${user.first_name} ${user.last_name}`}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <User size={64} className="text-slate-400" />
          </div>
        )}
        
        {/* Role Badge - top left */}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full ${
            user.role === 'admin' 
              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {user.role}
          </span>
        </div>

        {/* Delete Button - top right, hidden until hover */}
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(user.id); }}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-300 shadow-lg border border-red-200"
          title="Supprimer cet utilisateur"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Username */}
        <h3 className="text-lg font-bold text-on-surface truncate">
          {user.first_name} {user.last_name}
        </h3>
        
        {/* Email */}
        <p className="text-sm text-on-surface-variant flex items-center gap-2 mb-4 truncate">
          <Mail size={14} className="flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </p>

        {/* Dates Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
          {/* Created At */}
          <div className="bg-surface-container-high rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
              <Calendar size={12} />
              <span className="font-medium">Créé</span>
            </div>
            <p className="font-semibold text-on-surface">
              {formatDate(user.created_at)}
            </p>
          </div>

          {/* Last Login */}
          <div className="bg-surface-container-high rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 text-on-surface-variant mb-1">
              <LogIn size={12} />
              <span className="font-medium">Dernier</span>
            </div>
            <p className="font-semibold text-on-surface">
              {formatDate(user.last_sign_in_at)}
            </p>
          </div>
        </div>

        {/* Additional Info from Profiles */}
        <div className="space-y-2 mb-4 text-xs">
          {user.phone_number && (
            <div className="flex items-start gap-2 text-on-surface-variant">
              <Phone size={14} className="flex-shrink-0 mt-0.5" />
              <span className="truncate">{user.phone_number}</span>
            </div>
          )}
          {user.address && (
            <div className="flex items-start gap-2 text-on-surface-variant">
              <MapPin size={14} className="flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{user.address}</span>
            </div>
          )}
        </div>

        {/* Manage Button - like ProductCard action button */}
        <button 
          onClick={() => onOpen(user)}
          className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
        >
          Gérer le compte
        </button>
      </div>
    </div>
  );
}
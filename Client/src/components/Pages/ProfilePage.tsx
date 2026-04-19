import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User, MapPin, Phone, Save, Loader2, CheckCircle, Camera, X } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [avatarChanged, setAvatarChanged] = useState(false);
  const [originalProfile, setOriginalProfile] = useState<any>({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    email: "",
    avatar_url: "",
    exists: false,
  });
  const [hasChanges, setHasChanges] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
    email: "",
    avatar_url: "",
    exists: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { "Authorization": `Bearer ${session.access_token}` }
      });
      
      if (!response.ok) throw new Error("Erreur lors de la récupération du profil");

      const data = await response.json();
      
      const profileData = {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        email: session.user.email || "",
        avatar_url: data.avatar_url || "",
        exists: !!data.first_name || !!data.last_name || !!data.phone_number || !!data.address,
      };
      
      setProfile(profileData);
      setOriginalProfile(JSON.parse(JSON.stringify(profileData)));
      setHasChanges(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    try {
      const { data: { session }} = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`http://localhost:5000/api/users/${session.user.id}`, { // This endpoint handles both create and update
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone_number: profile.phone_number,
          address: profile.address,
          avatar_url: profile.avatar_url // Include avatar_url in the update payload
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde du profil");
      }
      
      toast.success("Profil mis à jour avec succès !");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleAvatarUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      setAvatarMessage({ type: 'error', text: 'Veuillez sélectionner une image à télécharger.' });
      return;
    }

    const file = event.target.files[0];
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      setAvatarMessage({ type: 'error', text: 'Vous devez être connecté pour télécharger un avatar.' });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarMessage(null);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('avatar', file);

      // Upload using backend endpoint (bypasses RLS)
      const response = await fetch('http://localhost:5000/api/users/avatar/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du téléchargement');
      }

      const data = await response.json();
      setProfile(prev => ({ ...prev, avatar_url: data.avatar_url }));
      setAvatarMessage({ type: 'success', text: 'Avatar téléchargé avec succès ! N\'oubliez pas d\'enregistrer les modifications.' });
    } catch (error: any) {
      setAvatarMessage({ type: 'error', text: error.message || 'Erreur lors du téléchargement de l\'avatar.' });
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  const handleCancel = () => {
    toast.info("Modification annulée.");
    navigate("/");
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    const updated = { ...profile, [field]: value };
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(originalProfile));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!profile.exists && !loading) {
    return (
      <div className="container mx-auto p-6 pt-32 max-w-2xl text-center">
        <div className="bg-surface-container-low p-8 rounded-[32px] shadow-sm border border-outline/5">
          <h1 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
            <User className="text-primary" size={32} /> Bienvenue !
          </h1>
          <p className="text-on-surface-variant text-lg mb-6">
            Il semble que vous n'ayez pas encore configuré votre profil. Commençons !
          </p>
          <button onClick={() => setProfile(prev => ({...prev, exists: true}))} className="creamy-gradient text-on-primary font-black py-4 px-8 rounded-full hover:scale-[1.02] transition-all">
            Configurer mon profil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 pt-32 max-w-2xl">
      <div className="bg-surface-container-low p-8 rounded-[32px] shadow-sm border border-outline/5">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <User className="text-primary" size={32} /> Mon Profil
        </h1>

        {/* Avatar Upload Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative size-32 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-4 border-primary/20 shadow-sm">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="text-primary/50" size={64} />
            )}
            <label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/30 text-on-primary opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              {isUploadingAvatar ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              disabled={isUploadingAvatar}
              className="hidden"
            />
          </div>
          {avatarMessage && (
            <div className={`mt-4 p-2 rounded-lg text-sm ${avatarMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {avatarMessage.text}
            </div>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-1">Prénom</label>
              <input 
                type="text" 
                className="w-full p-4 border border-outline/20 rounded-2xl bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                value={profile.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface-variant ml-1">Nom</label>
              <input 
                type="text" 
                className="w-full p-4 border border-outline/20 rounded-2xl bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
                value={profile.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant ml-1 flex items-center gap-2"><Phone size={14}/> Téléphone</label>
            <input 
              type="text" 
              className="w-full p-4 border border-outline/20 rounded-2xl bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all"
              value={profile.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant ml-1 flex items-center gap-2"><MapPin size={14}/> Adresse</label>
            <textarea 
              className="w-full p-4 border border-outline/20 rounded-2xl bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none transition-all min-h-25"
              value={profile.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button 
              disabled={updating}
              className="flex-1 creamy-gradient text-on-primary font-black py-4 rounded-full hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
            >
              {updating ? <Loader2 className="animate-spin" /> : <Save size={20} />} Enregistrer
            </button>
            <button 
              type="button"
              onClick={handleCancel}
              disabled={!hasChanges}
              className="flex-1 bg-outline/10 text-on-surface font-black py-4 rounded-full hover:bg-outline/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <X size={20} /> Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
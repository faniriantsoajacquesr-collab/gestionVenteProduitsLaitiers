import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar"
import { Button } from "@/components/UI/button"
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import {
  LogOutIcon,
} from "lucide-react"
import { Link } from "react-router-dom";

export function ProfileSection() {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>('LR');

    const getImageUrl = (url: string | null | undefined) => {
      if (!url) return undefined; // Return undefined so AvatarImage uses fallback
      if (url.startsWith('http')) return url;
      return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const fetchUserProfile = useCallback(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const response = await fetch("http://localhost:5000/api/auth/me", {
            headers: { "Authorization": `Bearer ${session.access_token}` }
          });
          if (response.ok) {
            const profileData = await response.json();
            setAvatarUrl(profileData.avatar_url || null);
            
            const firstInitial = profileData.first_name ? profileData.first_name.charAt(0).toUpperCase() : '';
            const lastInitial = profileData.last_name ? profileData.last_name.charAt(0).toUpperCase() : '';
            setInitials(`${firstInitial}${lastInitial}` || 'LR');
          }
        }
      } catch (error) {
        console.error("Error fetching user profile for Navbar:", error);
      }
    }, []);

    useEffect(() => {
      fetchUserProfile();
    }, [fetchUserProfile]);

  return (
    <div className="flex items-center gap-3">
      {/* Lien direct vers le profil avec avatar et label */}
      <Link 
        to="/profile" 
        className="flex items-center gap-2.5 px-2 py-1 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all group"
      >
        <Avatar className="size-9 border-2 border-transparent group-hover:border-sky-500/30 transition-all">
          <AvatarImage src={getImageUrl(avatarUrl)} alt="User Avatar" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-sky-700 dark:group-hover:text-sky-400">
          Profil
        </span>
      </Link>

      {/* Bouton de déconnexion direct placé juste à côté */}
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 px-3 py-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Déconnexion"
        onClick={async () => {
          const { error } = await supabase.auth.signOut();
          if (error) {
            alert("Erreur lors de la déconnexion: " + error.message);
          }
        }}
      >
        <LogOutIcon size={20} />
        <span className="text-sm font-bold hidden sm:inline">Déconnexion</span>
      </Button>
    </div>
  )
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar"
import { Button } from "@/components/UI/button"
import { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu"
import { supabase } from "@/lib/supabase";
import {
  User,
  LogOutIcon,
  Settings,
} from "lucide-react"
import { useNavigate } from "react-router-dom";

export function DropdownMenuAvatar() {
    const navigate = useNavigate()
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>('LR');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Declare isDropdownOpen state

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
    }, [fetchUserProfile, isDropdownOpen]);

  return (
    <DropdownMenu onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="size-9">
            <AvatarImage src={getImageUrl(avatarUrl)} alt="User Avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User></User>
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings />
            Paramètres
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
              <DropdownMenuItem onClick={async () => {
                console.log("Attempting to sign out...");
                const { error } = await supabase.auth.signOut();
                if (error) {
                  console.error("Error signing out:", error.message);
                  alert("Error signing out: " + error.message);
                } else {
                  console.log("Signed out successfully.");
                }
              }}>
          <LogOutIcon />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

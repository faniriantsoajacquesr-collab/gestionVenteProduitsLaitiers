import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar"
import { Button } from "@/components/UI/button"
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
  LogOutIcon,
  Settings,
  User,
} from "lucide-react"
import { useNavigate } from "react-router-dom";

export function DropdownMenuAvatar() {
    const navigate = useNavigate()
  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
            <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <User></User>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings />
            Setting
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
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

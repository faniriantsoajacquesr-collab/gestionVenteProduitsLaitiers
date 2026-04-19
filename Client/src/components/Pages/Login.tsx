import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "../UI/field"
import { Input } from "../UI/input"
import PrimaryBtn from "../UI/PrimaryBtn"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import socolaitImg from "../../assets/socolait.jpg"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault() // Stop the page from refreshing

    const { error, data } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      toast.error(error.message)
    } else if (data.user && data.session) {
      try {
        // Fetch user profile to check role
        const profileRes = await fetch("http://localhost:5000/api/auth/me", {
          headers: { "Authorization": `Bearer ${data.session.access_token}` }
        })
        const profile = await profileRes.json()
        
        // Redirect based on role
        if (profile?.role === 'admin') {
          // Store token for admin panel
          localStorage.setItem('supabase.auth.token', JSON.stringify({
            access_token: data.session.access_token
          }))
          window.location.href = 'http://localhost:5174'
        } else {
          navigate("/")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        navigate("/")
      }
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form className="flex flex-col gap-6">
            <FieldGroup>
              <div className="flex flex-col items-center gap-1 text-center">
                <h1 className="text-2xl font-bold">Se connecter à votre compte</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Entrez votre email ci-dessous pour vous connecter
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié?
                  </a>
                </div>
                <Input id="password" type="password" required onChange={(e)=> setPassword(e.target.value)} />
              </Field>
              <Field>
                <PrimaryBtn displayText="Se connecter" onClick={handleSignIn} />
              </Field>
              <Field>
                <FieldDescription className="text-center">
                  Vous n&apos;avez pas de compte?{" "}
                  <Link to="/signUp" className="underline underline-offset-4">
                    S&apos;inscrire
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
    </form>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src={socolaitImg}
          alt="Socolait"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

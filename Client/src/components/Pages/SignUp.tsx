import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "../UI/field"
import { Input } from "../UI/input"
import PrimaryBtn from "../UI/PrimaryBtn"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import socolaitImg from "../../assets/socolait.jpg"

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault() // Stop the page from refreshing

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Compte créé avec succès ! Veuillez vérifier vos e-mails pour la confirmation.")
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
                <h1 className="text-2xl font-bold">Sign up</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Enter your email below to Sign up 
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="m@example.com" required onChange={(e) => setEmail(e.target.value)} />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" type="password" required onChange={(e)=> setPassword(e.target.value)} />
              </Field>
              <Field>
                <PrimaryBtn displayText="Sign Up" onClick={handleSignUp} />
              </Field>
              <Field>
                <FieldDescription className="text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Login
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

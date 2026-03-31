import type { User } from "@supabase/supabase-js"
import { Outlet, useNavigation } from "react-router-dom"
import Footer from "./components/UI/Footer"
import LoadingSpinner from "./components/UI/LoadingSpinner"
import Navbar from "./components/UI/Navbar"
import { supabase } from "./lib/supabase"
import { useEffect, useState } from "react"
import CartSidebar from "./components/UI/CartSidebar"
import Login from "./components/Pages/Login"


function App() {
  const navigation = useNavigation()
  const [user, setUser] = useState<User | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsMounted(true)
    })

    const {data : { subscription }} = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, "Session:", session);
      setUser(session?.user ?? null)
    })
    
    return () => subscription.unsubscribe()

  }, [])

  if (!isMounted) return <LoadingSpinner />

  return (
     <>
       {user ? (
         <>
           <Navbar />
           <CartSidebar />
           {navigation.state === "loading" && <LoadingSpinner />}
           <Outlet />
           <Footer />
         </>
       ) : (
         <Login />
       )
       }
       
     </>
  )
}

export default App

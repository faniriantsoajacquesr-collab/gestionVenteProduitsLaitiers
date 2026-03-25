import { Outlet, useNavigation } from "react-router-dom"
import Footer from "./components/UI/Footer"
import LoadingSpinner from "./components/UI/LoadingSpinner"
import Navbar from "./components/UI/Navbar"

function App() {
  const navigation = useNavigation()

  return (
     <>
        <Navbar />
         {navigation.state === "loading" && <LoadingSpinner />}
        <Outlet />
        <Footer />
     </>
  )
}

export default App

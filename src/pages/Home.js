import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"

//components
import SmoothieCard from "../components/SmoothieCard"

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [smoothies, setSmoothies] = useState([])

  useEffect(() => {
    const fetchSmoothies = async () => {
      // Fetch data from the 'Smoothies' table (case-sensitive)
      const { data, error } = await supabase
        .from("Smoothies")
        .select()

      if (error) {
        console.error("Error fetching smoothies:", error)
        setFetchError("Could not fetch smoothies")
        setSmoothies([])
        return
      }

      // Successfully fetched data
      setSmoothies(data)
      setFetchError(null)
    }

    fetchSmoothies()
  }, [])

  return (
    <div className="page home">
      {fetchError && (<p className="error">{fetchError}</p>)}
      {smoothies &&(     
      
        <div className="smoothies">
          {/* order-by-button*/}
          <div className="smoothie-grid">
          {smoothies.map((smoothie) => (
            <SmoothieCard key={smoothie.id} smoothie={smoothie} />
          ))}
        </div>
         </div>
      )}
    </div>
  )
}
export default Home 

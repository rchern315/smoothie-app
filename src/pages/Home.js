import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"
import SmoothieCard from "../components/SmoothieCard"

const Home = () => {
  const [fetchError, setFetchError] = useState(null)
  const [smoothies, setSmoothies] = useState([])

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from("Smoothies")
        .select()

      if (error) {
        console.error("Error fetching smoothies:", error)
        setFetchError("Could not fetch smoothies")
        setSmoothies([])
        return
      }

      // Parse ingredients safely
      const parsedData = data.map(smoothie => {
        try {
          return {
            ...smoothie,
            ingredients: typeof smoothie.ingredients === 'string' 
              ? JSON.parse(smoothie.ingredients) 
              : smoothie.ingredients || []
          }
        } catch (e) {
          console.error('Error parsing ingredients for smoothie:', smoothie.title, e)
          return {
            ...smoothie,
            ingredients: []
          }
        }
      })

      setSmoothies(parsedData)
      setFetchError(null)
    }

    fetchSmoothies()
  }, [])

  return (
    <div className="page home">
      {fetchError && (<p className="error">{fetchError}</p>)}
      {smoothies && (     
        <div className="smoothies">
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
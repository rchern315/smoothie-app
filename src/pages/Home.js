import { useEffect, useState } from "react"
import supabase from "../config/supabaseClient"

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
      {fetchError && <p className="error">{fetchError}</p>}

      {smoothies.length > 0 ? (
        <div className="smoothies">
          {smoothies.map((smoothie) => (
            <p>{smoothie.title}</p>
          ))}
        </div>
      ) : (
        !fetchError && <p>Loading smoothies...</p>
      )}
    </div>
  )
}

export default Home

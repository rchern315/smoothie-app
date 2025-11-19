import { useState, useEffect } from 'react'
import supabase from '../config/supabaseClient'
import SmoothieCard from '../components/SmoothieCard'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [myRecipes, setMyRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isCancelled = false

    const fetchDashboardData = async () => {
      try {
        // 1) Get current user
        const { data, error: userError } = await supabase.auth.getUser()
        if (userError) throw userError

        const currentUser = data?.user || null

        if (!isCancelled) {
          setUser(currentUser)
        }

        // If no user is logged in, stop here
        if (!currentUser) {
          if (!isCancelled) {
            setMyRecipes([])
          }
          return
        }

        // 2) Get this user's recipes
        const { data: recipes, error: recipesError } = await supabase
          .from('Smoothies')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (recipesError) throw recipesError

        if (!isCancelled) {
          setMyRecipes(recipes || [])
        }
      } catch (err) {
        console.error('Error loading dashboard:', err)
        if (!isCancelled) {
          setError('Something went wrong loading your dashboard. Please try again.')
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchDashboardData()

    // Cleanup so we don't set state on an unmounted component
    return () => {
      isCancelled = true
    }
  }, [])

  // --- Render states ---

  if (loading) {
    return <div className="page">Loading...</div>
  }

  if (error) {
    return (
      <div className="page">
        <h2>My Dashboard</h2>
        <p className="error-message">{error}</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page">
        <h2>My Dashboard</h2>
        <p>You need to be logged in to view your dashboard.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2>My Dashboard</h2>
      <p>Welcome back, {user.email}!</p>

      <h3>My Recipes ({myRecipes.length})</h3>
      {myRecipes.length === 0 ? (
        <p>You haven't created any recipes yet.</p>
      ) : (
        <div className="smoothie-grid">
          {myRecipes.map((smoothie) => (
            <SmoothieCard key={smoothie.id} smoothie={smoothie} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard

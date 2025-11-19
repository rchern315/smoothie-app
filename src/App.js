import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import supabase from './config/supabaseClient'

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import Dashboard from "./pages/Dashboard"
import Auth from "./components/Auth"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <BrowserRouter>
      <nav>
        <h1>Supa Smoothies Recipes</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          
          {session ? (
            <>
              <Link to="/create">Create New Smoothie</Link>
              <Link to="/dashboard">My Dashboard</Link>
              <span className="user-email">{session.user.email}</span>
              <button onClick={handleSignOut} className="sign-out-btn">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth">
              <button className="sign-in-btn">Sign In</button>
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/auth" 
          element={!session ? <Auth /> : <Navigate to="/" />} 
        />
        <Route 
          path="/create" 
          element={session ? <Create /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/dashboard" 
          element={session ? <Dashboard /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/:id" 
          element={session ? <Update /> : <Navigate to="/auth" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
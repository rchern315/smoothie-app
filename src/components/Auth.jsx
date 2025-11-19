import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import supabase from '../config/supabaseClient'

const AuthComponent = () => {
  return (
    <div className="auth-container">
      <h2>Sign in to create and manage smoothies</h2>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="light"
        providers={[]}
        redirectTo={window.location.origin}
      />
    </div>
  )
}

export default AuthComponent
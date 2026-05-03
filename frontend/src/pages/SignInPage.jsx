// SignInPage.jsx
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
      <SignIn 
        routing="path" 
        path="/sign-in" 
        forceRedirectUrl="/dashboard"
        signUpUrl="/sign-up" // Buena práctica definirlo aquí también
      />
    </div>
  )
}
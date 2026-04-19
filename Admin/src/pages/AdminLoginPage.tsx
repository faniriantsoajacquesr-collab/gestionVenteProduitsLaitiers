import { useState } from 'react'
import { AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { toast } from 'react-hot-toast'

interface LoginPageProps {
  onLoginSuccess: () => void
}

interface LoginError {
  type: 'email' | 'password' | 'network' | 'permission' | 'other'
  message: string
}

export default function AdminLoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [loginStep, setLoginStep] = useState<'idle' | 'authenticating' | 'verifying' | 'success'>('idle')
  const [error, setError] = useState<LoginError | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      errors.email = 'L\'email est requis'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Veuillez entrer un email valide'
    }

    if (!password) {
      errors.password = 'Le mot de passe est requis'
    } else if (password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const getErrorMessage = (errorType: LoginError['type'], originalMessage: string): string => {
    const errorMap: Record<string, string> = {
      'email': 'Email ou mot de passe incorrect',
      'password': 'Email ou mot de passe incorrect',
      'network': 'Erreur de connexion réseau. Vérifiez votre connexion internet.',
      'permission': 'Accès refusé. Vous n\'avez pas les permissions d\'administrateur.',
      'other': originalMessage || 'Une erreur est survenue. Veuillez réessayer.'
    }
    return errorMap[errorType] || errorMap['other']
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setLoginStep('authenticating')

    try {
      // Step 1: Authenticate with Supabase
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        const errorType = authError.message.includes('Invalid login credentials') ? 'email' : 'other'
        const errorMsg: LoginError = {
          type: errorType,
          message: getErrorMessage(errorType, authError.message)
        }
        setError(errorMsg)
        toast.error(errorMsg.message)
        setLoginStep('idle')
        setLoading(false)
        return
      }

      if (!data.user || !data.session) {
        const errorMsg: LoginError = {
          type: 'other',
          message: 'Erreur d\'authentification: Données utilisateur manquantes'
        }
        setError(errorMsg)
        toast.error(errorMsg.message)
        setLoginStep('idle')
        setLoading(false)
        return
      }

      // Step 2: Verify admin role
      setLoginStep('verifying')
      toast.loading('Vérification des permissions...', { id: 'role-check' })

      try {
        const profileRes = await fetch('http://localhost:5000/api/auth/me', {
          headers: { 'Authorization': `Bearer ${data.session.access_token}` }
        })

        if (!profileRes.ok) {
          throw new Error(`Erreur serveur: ${profileRes.status}`)
        }

        const profile = await profileRes.json()

        if (!profile?.role || profile.role !== 'admin') {
          const errorMsg: LoginError = {
            type: 'permission',
            message: 'Accès refusé. Vous n\'avez pas les permissions d\'administrateur. Seuls les administrateurs peuvent accéder à ce panel.'
          }
          setError(errorMsg)
          toast.error(errorMsg.message, { id: 'role-check' })
          await supabase.auth.signOut()
          setLoginStep('idle')
          setLoading(false)
          return
        }

        // Step 3: Success
        toast.dismiss('role-check')
        setLoginStep('success')
        
        // Store token
        localStorage.setItem('admin_auth_token', data.session.access_token)
        console.log('[Login] Connexion réussie - Token stocké')

        toast.success('Connexion réussie! Redirection...', {
          duration: 2000
        })

        // Give visual feedback before redirecting
        setTimeout(() => {
          onLoginSuccess()
        }, 500)
      } catch (fetchErr) {
        const errorMsg: LoginError = {
          type: 'network',
          message: 'Erreur de connexion au serveur. Vérifiez que le serveur est en cours d\'exécution.'
        }
        setError(errorMsg)
        toast.error(errorMsg.message, { id: 'role-check' })
        await supabase.auth.signOut()
        setLoginStep('idle')
        setLoading(false)
      }
    } catch (err) {
      const errorMsg: LoginError = {
        type: 'other',
        message: (err as Error).message || 'Une erreur inexpectée s\'est produite'
      }
      setError(errorMsg)
      toast.error(errorMsg.message)
      setLoginStep('idle')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-lg border border-outline-variant">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-on-primary font-bold text-xl">SL</span>
            </div>
            <h1 className="text-2xl font-bold text-on-surface">Socolait Madagascar</h1>
            <p className="text-on-surface-variant text-sm mt-2">Connexion administrateur</p>
          </div>

          {/* Global Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/30 flex gap-3">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-error text-sm">{error.message}</p>
                <p className="text-error/70 text-xs mt-1">
                  {error.type === 'network' && 'Assurez-vous que le serveur est démarré sur le port 5000'}
                  {error.type === 'permission' && 'Contactez un administrateur système'}
                  {error.type === 'other' && 'Veuillez réessayer ou contacter le support'}
                </p>
              </div>
            </div>
          )}

          {/* Loading Steps */}
          {loading && (
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="space-y-3">
                {/* Step 1: Authentication */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {loginStep === 'authenticating' && (
                      <Loader className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {(loginStep === 'verifying' || loginStep === 'success') && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    {loginStep === 'idle' && (
                      <div className="w-4 h-4 rounded-full border-2 border-outline-variant" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    loginStep === 'idle' ? 'text-on-surface-variant' : 'text-on-surface'
                  }`}>
                    Authentification en cours...
                  </span>
                </div>

                {/* Step 2: Verification */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {loginStep === 'verifying' && (
                      <Loader className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {loginStep === 'success' && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    {(loginStep === 'idle' || loginStep === 'authenticating') && (
                      <div className="w-4 h-4 rounded-full border-2 border-outline-variant" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    (loginStep === 'idle' || loginStep === 'authenticating') ? 'text-on-surface-variant' : 'text-on-surface'
                  }`}>
                    Vérification des permissions...
                  </span>
                </div>

                {/* Step 3: Success */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {loginStep === 'success' && (
                      <CheckCircle className="w-4 h-4 text-primary animate-pulse" />
                    )}
                    {loginStep !== 'success' && (
                      <div className="w-4 h-4 rounded-full border-2 border-outline-variant" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    loginStep === 'success' ? 'text-on-surface' : 'text-on-surface-variant'
                  }`}>
                    Redirection...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (validationErrors.email) {
                    setValidationErrors({ ...validationErrors, email: undefined })
                  }
                }}
                disabled={loading}
                placeholder="admin@example.com"
                className={`w-full px-4 py-2.5 border rounded-lg bg-surface-container-lowest focus:ring-2 outline-none transition-all text-on-surface disabled:opacity-50 disabled:cursor-not-allowed ${
                  validationErrors.email
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-outline-variant focus:border-primary focus:ring-primary/20'
                }`}
              />
              {validationErrors.email && (
                <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (validationErrors.password) {
                    setValidationErrors({ ...validationErrors, password: undefined })
                  }
                }}
                disabled={loading}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 border rounded-lg bg-surface-container-lowest focus:ring-2 outline-none transition-all text-on-surface disabled:opacity-50 disabled:cursor-not-allowed ${
                  validationErrors.password
                    ? 'border-error focus:border-error focus:ring-error/20'
                    : 'border-outline-variant focus:border-primary focus:ring-primary/20'
                }`}
              />
              {validationErrors.password && (
                <p className="mt-1.5 text-xs text-error flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary text-on-primary font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6 flex items-center justify-center gap-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 p-4 rounded-lg bg-on-surface/5">
            <p className="text-xs text-on-surface-variant text-center mb-2">
              <strong>🔒 Accès sécurisé</strong>
            </p>
            <p className="text-xs text-on-surface-variant text-center">
              Seuls les administrateurs vérifiés peuvent accéder à ce panel. Vos identifiants sont sécurisés.
            </p>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center text-xs text-on-surface-variant">
          <p>Besoin d'aide? Contactez l'équipe technique</p>
        </div>
      </div>
    </div>
  )
}

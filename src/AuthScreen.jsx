import { useState, useEffect } from 'react'

const APPSYNC_URL = 'https://nnmz2nlixrbdnb76qd2x3bitxy.appsync-api.us-east-1.amazonaws.com/graphql'
const APPSYNC_KEY = 'da2-4w5jxv4o35b23o44wxy7iulvdm'

async function gql(query, variables = {}) {
  const res = await fetch(APPSYNC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': APPSYNC_KEY },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data
}

const GET_USER = `
  query GetUser($email: ID!) {
    getUser(email: $email) {
      email passwordHash userId displayName resetToken resetExpiry
    }
  }
`
const CREATE_USER = `
  mutation CreateUser($email: ID!, $passwordHash: String!, $userId: String!, $displayName: String) {
    createUser(email: $email, passwordHash: $passwordHash, userId: $userId, displayName: $displayName) {
      email userId displayName
    }
  }
`
const SET_RESET_TOKEN = `
  mutation SetResetToken($email: ID!, $resetToken: String!, $resetExpiry: String!) {
    setResetToken(email: $email, resetToken: $resetToken, resetExpiry: $resetExpiry) {
      email
    }
  }
`
const UPDATE_PASSWORD = `
  mutation UpdatePassword($email: ID!, $passwordHash: String!) {
    updatePassword(email: $email, passwordHash: $passwordHash) {
      email
    }
  }
`

// PBKDF2 with per-user salt stored as "salt:hash".
// 100k iterations makes brute-force ~100,000x slower than plain SHA-256.
async function hashPassword(password, storedValue) {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  let saltBytes
  if (storedValue) {
    const saltHex = storedValue.split(':')[0]
    saltBytes = Uint8Array.from(saltHex.match(/.{2}/g).map(b => parseInt(b, 16)))
  } else {
    saltBytes = crypto.getRandomValues(new Uint8Array(16))
  }
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: 100000 },
    keyMaterial, 256
  )
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('')
  const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('')
  return `${saltHex}:${hashHex}`
}

// Eye icon for show/hide password
const EyeIcon = ({ open }) => open ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const pwWrapStyle = { position: 'relative', marginBottom: '14px' }
const pwInputStyle = {
  width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px',
  fontSize: '14px', boxSizing: 'border-box', outline: 'none', paddingRight: '42px',
}
const eyeBtnStyle = {
  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
  background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '2px',
  display: 'flex', alignItems: 'center',
}

function PasswordField({ value, onChange, placeholder, show, onToggle }) {
  return (
    <div style={pwWrapStyle}>
      <input style={pwInputStyle} type={show ? 'text' : 'password'}
        placeholder={placeholder} value={value} onChange={onChange} required />
      <button type="button" style={eyeBtnStyle} onClick={onToggle} tabIndex={-1}>
        <EyeIcon open={show} />
      </button>
    </div>
  )
}

export default function AuthScreen({ onAuthSuccess }) {
  // Check URL params for password reset link
  const urlParams = new URLSearchParams(window.location.search)
  const resetTokenFromUrl = urlParams.get('reset')
  const resetEmailFromUrl = urlParams.get('email') ? decodeURIComponent(urlParams.get('email')) : ''

  const [mode, setMode] = useState(resetTokenFromUrl ? 'resetPassword' : 'signIn')
  const [email, setEmail] = useState(resetEmailFromUrl)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLink, setResetLink] = useState('')

  const GREEN = '#3CB371'

  // Styles

  const containerStyle = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif',
  }
  const cardStyle = {
    background: '#fff', borderRadius: '12px', padding: '40px', width: '390px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  }
  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px',
    fontSize: '14px', marginBottom: '14px', boxSizing: 'border-box', outline: 'none',
  }
  const btnStyle = {
    width: '100%', padding: '12px', background: GREEN, color: '#fff', border: 'none',
    borderRadius: '6px', fontSize: '15px', fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: '4px',
  }
  const linkStyle = {
    color: GREEN, cursor: 'pointer', background: 'none', border: 'none',
    padding: 0, fontSize: '14px', textDecoration: 'underline',
  }
  // Helpers

  const normalizeEmail = (e) => e.trim().toLowerCase()

  const switchMode = (m) => { setMode(m); setError(''); setInfo(''); setPassword(''); setConfirmPassword(''); setResetLink('') }

  // Handlers

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const norm = normalizeEmail(email)
      const result = await gql(GET_USER, { email: norm })
      const user = result.getUser
      if (!user) { setError('Invalid email or password.'); return }
      const computed = await hashPassword(password, user.passwordHash)
      if (computed !== user.passwordHash) { setError('Invalid email or password.'); return }
      localStorage.setItem('authUser', JSON.stringify({ userId: user.userId, email: user.email, displayName: user.displayName }))
      onAuthSuccess({ userId: user.userId, email: user.email, displayName: user.displayName })
    } catch (err) {
      setError(`Sign in failed: ${err.message}`)
      console.error(err)
    } finally { setLoading(false) }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const norm = normalizeEmail(email)
      const check = await gql(GET_USER, { email: norm })
      if (check.getUser) { setError('An account with this email already exists.'); return }
      const passwordHash = await hashPassword(password)
      const userId = crypto.randomUUID()
      const name = displayName.trim() || norm.split('@')[0]
      await gql(CREATE_USER, { email: norm, passwordHash, userId, displayName: name })
      localStorage.setItem('authUser', JSON.stringify({ userId, email: norm, displayName: name }))
      onAuthSuccess({ userId, email: norm, displayName: name })
    } catch (err) {
      setError(`Sign up failed: ${err.message}`)
      console.error(err)
    } finally { setLoading(false) }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setResetLink('')
    setLoading(true)
    try {
      const norm = normalizeEmail(email)
      const result = await gql(GET_USER, { email: norm })
      if (!result.getUser) {
        // Don't reveal whether account exists — security best practice
        setInfo('If an account exists with that email, a reset link has been generated below.')
        return
      }
      const token = crypto.randomUUID()
      const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      await gql(SET_RESET_TOKEN, { email: norm, resetToken: token, resetExpiry: expiry })
      const link = `${window.location.origin}${window.location.pathname}?reset=${token}&email=${encodeURIComponent(norm)}`
      setResetLink(link)
      setInfo('Reset link generated. Copy the link below and open it to set a new password. In production this would be emailed automatically.')
    } catch (err) {
      setError(`Error: ${err.message}`)
      console.error(err)
    } finally { setLoading(false) }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true)
    try {
      const norm = normalizeEmail(email)
      const result = await gql(GET_USER, { email: norm })
      const user = result.getUser
      if (!user) { setError('Invalid reset link.'); return }
      if (user.resetToken !== resetTokenFromUrl) { setError('Invalid or already used reset link.'); return }
      if (new Date(user.resetExpiry) < new Date()) { setError('Reset link has expired. Please request a new one.'); return }
      const passwordHash = await hashPassword(password)
      await gql(UPDATE_PASSWORD, { email: norm, passwordHash })
      // Clear URL params and go to sign in
      window.history.replaceState({}, '', window.location.pathname)
      setInfo('Password updated successfully. You can now sign in.')
      switchMode('signIn')
    } catch (err) {
      setError(`Reset failed: ${err.message}`)
      console.error(err)
    } finally { setLoading(false) }
  }

  // Render

  const titles = {
    signIn: 'Sign in to your account',
    signUp: 'Create a new account',
    forgotPassword: 'Reset your password',
    resetPassword: 'Set a new password',
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '28px', fontWeight: '700', color: GREEN }}>🛒 SASH</div>
          <div style={{ color: '#666', fontSize: '14px', marginTop: '6px' }}>{titles[mode]}</div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        {info && (
          <div style={{ background: '#f0faf4', border: '1px solid #86efac', color: '#166534', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
            {info}
          </div>
        )}

        {/* Sign In */}
        {mode === 'signIn' && (
          <form onSubmit={handleSignIn}>
            <input style={inputStyle} type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <PasswordField value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" show={showPassword} onToggle={() => setShowPassword(v => !v)} />
            <div style={{ textAlign: 'right', marginBottom: '14px', marginTop: '-6px' }}>
              <button type="button" style={linkStyle} onClick={() => switchMode('forgotPassword')}>
                Forgot password?
              </button>
            </div>
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Sign Up */}
        {mode === 'signUp' && (
          <form onSubmit={handleSignUp}>
            <input style={inputStyle} type="text" placeholder="Display name (optional)"
              value={displayName} onChange={e => setDisplayName(e.target.value)} />
            <input style={inputStyle} type="email" placeholder="Email address"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <PasswordField value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password (min 8 characters)" show={showPassword} onToggle={() => setShowPassword(v => !v)} />
            <PasswordField value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm password" show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Forgot Password */}
        {mode === 'forgotPassword' && (
          <form onSubmit={handleForgotPassword}>
            <input style={inputStyle} type="email" placeholder="Enter your email address"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Checking…' : 'Generate Reset Link'}
            </button>
            {resetLink && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>Your reset link (expires in 1 hour):</div>
                <div style={{ background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '6px', padding: '10px', fontSize: '11px', wordBreak: 'break-all', color: '#333', marginBottom: '8px' }}>
                  {resetLink}
                </div>
                <button type="button" style={{ ...btnStyle, background: '#6b7280', marginTop: 0 }}
                  onClick={() => navigator.clipboard.writeText(resetLink).then(() => alert('Copied!'))}>
                  Copy Link
                </button>
              </div>
            )}
          </form>
        )}

        {/* Reset Password */}
        {mode === 'resetPassword' && (
          <form onSubmit={handleResetPassword}>
            <input style={{ ...inputStyle, background: '#f9f9f9', color: '#666' }}
              type="email" value={email} readOnly />
            <PasswordField value={password} onChange={e => setPassword(e.target.value)}
              placeholder="New password (min 8 characters)" show={showPassword} onToggle={() => setShowPassword(v => !v)} />
            <PasswordField value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password" show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />
            <button type="submit" style={btnStyle} disabled={loading}>
              {loading ? 'Updating…' : 'Set New Password'}
            </button>
          </form>
        )}

        {/* Footer links */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {mode === 'signIn' && (
            <>Don&apos;t have an account?{' '}
              <button style={linkStyle} onClick={() => switchMode('signUp')}>Sign up</button>
            </>
          )}
          {(mode === 'signUp' || mode === 'forgotPassword') && (
            <>
              <button style={linkStyle} onClick={() => switchMode('signIn')}>Back to sign in</button>
            </>
          )}
          {mode === 'resetPassword' && (
            <button style={linkStyle} onClick={() => { window.history.replaceState({}, '', window.location.pathname); switchMode('signIn') }}>
              Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

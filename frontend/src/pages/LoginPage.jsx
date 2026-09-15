import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { login as loginApi, googleAuth } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleGuide, setShowGoogleGuide] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const isGoogleConfigured = !!googleClientId && !googleClientId.includes('demo') && googleClientId.trim().length > 10;

  // If already authenticated, redirect immediately
  React.useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { user, token } = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      login(token, user);
      addToast(`Welcome back, ${user.full_name}!`, 'success');

      // Check if user was trying to access a specific page
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');
      const { user, token, isNewUser } = await googleAuth(credentialResponse.credential);

      login(token, user);
      addToast(
        isNewUser
          ? `Welcome to DocConnect, ${user.full_name}!`
          : `Signed in with Google! Welcome back, ${user.full_name}.`,
        'success'
      );

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Google authentication failed. Please verify configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or could not be initiated.');
  };

  const handleUnconfiguredGoogleClick = () => {
    setShowGoogleGuide((prev) => !prev);
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--slate-200)',
          }}
        >
          {/* Left Visual Panel */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
              padding: '3rem 2.5rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShieldCheck size={26} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>DocConnect</h3>
                  <span style={{ fontSize: '0.75rem', opacity: 0.85, letterSpacing: '0.04em' }}>PATIENT ACCESS</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '1rem' }}>
                Compassionate Care, Simplified.
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
                Sign in to manage your appointments, review consultation histories, and connect with top specialists.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Verified Board-Certified Doctors',
                  'Instant Real-Time Slot Reservation',
                  'Secure Encrypted Patient Records',
                  'Google Account Integration',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={18} color="#a7f3d0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.8rem', opacity: 0.8 }}>
              Demo Admin: <strong>admin@docconnect.com</strong> | Patient: <strong>aarav.sharma@example.com</strong>
            </div>
          </div>

          {/* Right Form Card */}
          <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
                Sign In to DocConnect
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                Enter your credentials or authenticate via Google.
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Section */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {isGoogleConfigured ? (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="signin_with"
                    width="100%"
                  />
                </div>
              ) : (
                <div style={{ width: '100%' }}>
                  <button
                    type="button"
                    onClick={handleUnconfiguredGoogleClick}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--slate-300)',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--slate-700)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                    </svg>
                    Sign in with Google
                  </button>

                  {showGoogleGuide && (
                    <div
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#f0f9ff',
                        border: '1px solid #bae6fd',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        color: '#0369a1',
                        lineHeight: 1.5,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        <Info size={15} /> Google Cloud Setup Required
                      </div>
                      Google OAuth requires a real Client ID from Google Cloud Console. To activate real Google logins:
                      <ol style={{ paddingLeft: '1.25rem', margin: '0.4rem 0 0 0' }}>
                        <li>Create a free Web OAuth Client in <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline', fontWeight: 700 }}>Google Cloud Console</a>.</li>
                        <li>Add Authorized origin: <code>http://localhost:5173</code>.</li>
                        <li>Paste your client ID in <code>frontend/.env</code> as <code>VITE_GOOGLE_CLIENT_ID=...</code> and restart Vite.</li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '1.25rem 0 0.25rem', gap: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Or with email
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={15} color="#0d9488" /> Email Address
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label" htmlFor="password" style={{ margin: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Lock size={15} color="#0d9488" /> Password
                      <span className="required">*</span>
                    </span>
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="form-input"
                    style={{ paddingRight: '2.5rem' }}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--slate-400)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '0.75rem' }}
                disabled={loading}
              >
                {loading ? 'Signing in...' : (
                  <>
                    Sign In to Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
              Don't have an account yet?{' '}
              <Link to="/signup" style={{ color: '#0d9488', fontWeight: 700 }}>
                Create Patient Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

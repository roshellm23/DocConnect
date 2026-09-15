import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { signup as signupApi, googleAuth } from '../services/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      errs.full_name = 'Full name must be at least 2 characters';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirm_password) {
      errs.confirm_password = 'Passwords do not match';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError('');

    try {
      const { user, token } = await signupApi({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirm_password: formData.confirm_password,
      });

      login(token, user);
      addToast('Account created successfully! Welcome to DocConnect.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const errMap = {};
        err.data.errors.forEach((e) => {
          errMap[e.field] = e.message;
        });
        setFieldErrors(errMap);
      }
      setError(err.message || 'Signup failed. Please try again.');
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
          ? `Welcome to DocConnect, ${user.full_name}! Account created with Google.`
          : `Welcome back, ${user.full_name}!`,
        'success'
      );
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Google signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google sign-in was cancelled or could not be initiated.');
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', minHeight: 'calc(100vh - 160px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
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
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
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
                  <span style={{ fontSize: '0.75rem', opacity: 0.85, letterSpacing: '0.04em' }}>PATIENT ONBOARDING</span>
                </div>
              </div>

              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '1rem' }}>
                Your Health Journey Starts Here.
              </h2>
              <p style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem' }}>
                Join patients who trust DocConnect to organize healthcare consultations with certified medical specialists.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  'Quick 1-minute registration',
                  'Instant sign-in with your Google Account',
                  'Full access to all verified specialists',
                  'Personal dashboard to track appointment status',
                ].map((text, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.88rem' }}>
                    <CheckCircle2 size={18} color="#bae6fd" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', fontSize: '0.8rem', opacity: 0.85 }}>
              Patient accounts are protected under medical privacy standards.
            </div>
          </div>

          {/* Right Form Card */}
          <div style={{ padding: '3rem 2.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
                Create Patient Account
              </h1>
              <p style={{ fontSize: '0.88rem', color: 'var(--slate-500)' }}>
                Register with your details or sign up instantly with Google.
              </p>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            {/* Google Signup Button */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '100%' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  shape="rectangular"
                  text="signup_with"
                  width="100%"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '1.25rem 0 0.25rem', gap: '0.75rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Or register with email
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--slate-200)' }} />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label" htmlFor="full_name">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <User size={15} color="#0284c7" /> Full Name
                    <span className="required">*</span>
                  </span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  className={`form-input ${fieldErrors.full_name ? 'error' : ''}`}
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {fieldErrors.full_name && (
                  <div className="form-error">
                    <AlertCircle size={13} /> {fieldErrors.full_name}
                  </div>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="form-grid-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="email">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={15} color="#0284c7" /> Email
                      <span className="required">*</span>
                    </span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="aarav@example.com"
                    className={`form-input ${fieldErrors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {fieldErrors.email && (
                    <div className="form-error">
                      <AlertCircle size={13} /> {fieldErrors.email}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="phone">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={15} color="#0284c7" /> Phone Number
                    </span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91-9876543210"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password & Confirm Grid */}
              <div className="form-grid-2" style={{ marginBottom: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="password">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Lock size={15} color="#0284c7" /> Password
                      <span className="required">*</span>
                    </span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      className={`form-input ${fieldErrors.password ? 'error' : ''}`}
                      style={{ paddingRight: '2.5rem' }}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      aria-label="Toggle password view"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <div className="form-error">
                      <AlertCircle size={13} /> {fieldErrors.password}
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" htmlFor="confirm_password">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Lock size={15} color="#0284c7" /> Confirm
                      <span className="required">*</span>
                    </span>
                  </label>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repeat password"
                    className={`form-input ${fieldErrors.confirm_password ? 'error' : ''}`}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  {fieldErrors.confirm_password && (
                    <div className="form-error">
                      <AlertCircle size={13} /> {fieldErrors.confirm_password}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? 'Creating Patient Account...' : (
                  <>
                    Complete Registration <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
              Already registered on DocConnect?{' '}
              <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

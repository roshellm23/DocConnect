import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { updateProfile } from '../services/api';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });

      updateUser(updated);
      addToast('Profile details updated successfully!', 'success');
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '780px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Patient Profile & Account</h1>
        <p className="page-subtitle">
          Manage your personal contact details and review your verified DocConnect patient credentials.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div
          style={{
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            borderBottom: '1px solid var(--slate-100)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0d9488, #0284c7)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
              }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || 'P'}
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', margin: '0 0 0.25rem 0' }}>
                {user?.full_name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: '#ccfbf1',
                    color: '#0f766e',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    border: '1px solid #5eead4',
                  }}
                >
                  {user?.role} account
                </span>
                <span style={{ fontSize: '0.825rem', color: 'var(--slate-500)' }}>
                  Verified Patient #{user?.id}
                </span>
              </div>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={15} /> Edit Contact Info
            </button>
          )}
        </div>

        {/* Profile Details Content */}
        <div style={{ padding: '2rem' }}>
          {!isEditing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-500)',
                  }}
                >
                  <User size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Full Legal Name
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {user?.full_name}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-500)',
                  }}
                >
                  <Mail size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Email Address
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {user?.email} <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 400 }}>(Primary Login ID)</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-500)',
                  }}
                >
                  <Phone size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Contact Phone
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {user?.phone || 'No phone number provided'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--slate-500)',
                  }}
                >
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Security Role
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--slate-800)' }}>
                    {user?.role?.toUpperCase()} — Authorized Patient User
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label" htmlFor="full_name">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91-9876543210"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email}
                  disabled
                  style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.25rem' }}>
                  Email serves as your unique authentication identifier and cannot be modified.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  <Save size={15} /> {saving ? 'Saving changes...' : 'Save Profile Changes'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X size={15} /> Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      
        
      </div>
    
  );
};

export default ProfilePage;

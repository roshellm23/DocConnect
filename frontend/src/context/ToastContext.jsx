import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.6rem',
    }}>
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const TOAST_STYLES = {
  success: {
    bg: '#f0fdf4',
    border: '#86efac',
    icon: '✓',
    iconColor: '#16a34a',
    textColor: '#15803d',
  },
  error: {
    bg: '#fef2f2',
    border: '#fca5a5',
    icon: '✕',
    iconColor: '#dc2626',
    textColor: '#b91c1c',
  },
  info: {
    bg: '#f0f9ff',
    border: '#7dd3fc',
    icon: 'i',
    iconColor: '#0284c7',
    textColor: '#0369a1',
  },
  warning: {
    bg: '#fffbeb',
    border: '#fcd34d',
    icon: '!',
    iconColor: '#d97706',
    textColor: '#b45309',
  },
};

const Toast = ({ toast, onRemove }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '10px',
        padding: '0.85rem 1.1rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        minWidth: '280px',
        maxWidth: '380px',
        animation: 'toastSlideIn 0.2s ease',
      }}
    >
      <span style={{
        width: '22px',
        height: '22px',
        borderRadius: '50%',
        background: style.iconColor,
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: 700,
        flexShrink: 0,
      }}>
        {style.icon}
      </span>
      <span style={{ fontSize: '0.875rem', color: style.textColor, fontWeight: 500, flex: 1 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: style.textColor,
          fontSize: '1rem',
          lineHeight: 1,
          padding: '0 2px',
          opacity: 0.6,
        }}
      >
        ×
      </button>
    </div>
  );
};

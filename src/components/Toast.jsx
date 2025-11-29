import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

// Create context
const ToastContext = createContext(null);

// Toast Provider Component
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

 const genId = () => {
   try {
     if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
       return crypto.randomUUID();
     }
   } catch {}
   return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
 };

 const showToast = (message, type = 'success', options = {}) => {
   const id = genId();
   const toast = { id, message, type, sticky: !!options.sticky, targetPath: options.targetPath || null };
   setToasts(prev => [...prev, toast]);
   if (!options.sticky) {
     // start exit animation before removal
     const timeout = setTimeout(() => {
       setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
       setTimeout(() => {
         setToasts(prev => prev.filter(t => t.id !== id));
       }, 250);
     }, 4000);
     return () => clearTimeout(timeout);
   }
 };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    success: (message, options) => showToast(message, 'success', options),
    error: (message, options) => showToast(message, 'error', options),
    info: (message, options) => showToast(message, 'info', options),
    removeByTarget: (targetPath) => setToasts(prev => prev.filter(t => t.targetPath !== targetPath))
  };

  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    info: <AlertCircle className="w-6 h-6" />
  };

  // Use theme color variables for toast backgrounds and text
  const colors = {
    success: 'bg-accent1 text-text', // accent1 (greenish) background, theme text
    error: 'bg-secondary text-white', // secondary (red or error color) background, white text
    info: 'bg-background text-text border border-accent1' // background, theme text, accent border
  };

  const navigate = useNavigate();
  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-8 z-[9999] space-y-2 pointer-events-none">
          {toasts.map(toast => (
            <div
              key={toast.id}
              onClick={() => { if (toast.targetPath) navigate(toast.targetPath); }}
              className={`toast-card ${colors[toast.type]} px-4 py-3 rounded-lg flex items-center justify-center gap-2 min-w-[300px] max-w-md relative ${toast.exiting ? 'toast-exit' : 'toast-enter'} ${toast.sticky ? 'toast-sticky' : ''} pointer-events-auto cursor-pointer` }
            >
              <div className="flex items-center gap-2 mx-auto">
                {icons[toast.type]}
                <span className="toast-text">{toast.message}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
                className="absolute top-1 right-1 hover:bg-white/20 rounded p-1 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>, document.body)
      }
    </ToastContext.Provider>
  );
}

// useToast hook
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
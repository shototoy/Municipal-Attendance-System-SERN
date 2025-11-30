import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import { ThemeContext } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import KioskTerminal from './pages/KioskTerminal';
import AdminDashboard from './pages/AdminDashboard';
import AttendanceLogs from './pages/AttendanceLogs';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/kiosk" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/kiosk" element={<KioskTerminal />} />
      <Route path="/admin" element={<Layout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="logs" element={<AttendanceLogs />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ThemeContext.Provider value={{}}>
            <AppRoutes />
          </ThemeContext.Provider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
import { Link } from 'react-router-dom';
import { BarChart3, Fingerprint } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"Admin"}');
  const { get } = useTheme();
  return (
    <section
      className={get('admin.card', 'bg-accent2 rounded-lg shadow-md p-8 border border-accent1') + ' flex flex-col flex-1 h-full min-h-0'}
      style={{ minHeight: 0 }}
      id="admin-dashboard-card"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-accent1 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text mb-2">
          Admin Dashboard
        </h1>
        <p className="text-secondary">
          Hello, <span className="font-semibold">{user?.username || 'Admin'}</span>
        </p>
      </div>
      <div className="border-t border-accent1 pt-6">
        <div className="grid grid-cols-1 gap-4">
          <Link to="/admin/logs" className="bg-gradient-to-br from-accent1 to-accent2 p-6 rounded-lg border border-accent1 flex items-center gap-4 hover:shadow-lg transition">
            <Fingerprint className="w-8 h-8 text-primary" />
            <div>
              <h3 className="font-semibold text-text">Attendance Logs</h3>
              <p className="text-sm text-secondary">View and filter employee attendance logs</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
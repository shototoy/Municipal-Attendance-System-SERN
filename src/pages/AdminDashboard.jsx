import { Link } from 'react-router-dom';
import { BarChart3, Fingerprint } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"Admin"}');
  const { get } = useTheme();
  return (
    <section
      className={get('admin.card', 'bg-white rounded-lg shadow-md p-8 border border-gray-100') + ' flex flex-col flex-1 h-full min-h-0'}
      style={{ minHeight: 0 }}
      id="admin-dashboard-card"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Hello, <span className="font-semibold">{user?.username || 'Admin'}</span>
        </p>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 gap-4">
          <Link to="/admin/logs" className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 flex items-center gap-4 hover:shadow-lg transition">
            <Fingerprint className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-800">Attendance Logs</h3>
              <p className="text-sm text-gray-600">View and filter employee attendance logs</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
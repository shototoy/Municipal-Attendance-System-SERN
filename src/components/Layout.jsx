import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { NotificationsProvider } from '../contexts/NotificationsContext';
import { useTheme } from '../contexts/ThemeContext';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { get } = useTheme();
  const [collapsed, setCollapsed] = useState(true);

  // Only top and bottom margin for main content
  const mainMargin = collapsed ? 'mt-6 mb-6' : 'mt-12 mb-12';
  // Margin in px for calculation
  const marginPx = collapsed ? 24 : 48;

  // Set body background color to match sidebar from theme
  if (typeof document !== 'undefined') {
    document.body.className = '';
    document.body.classList.add('min-h-screen', 'bg-primary');
  }

  return (
    <NotificationsProvider>
      <div className={get('layout.shell', 'flex h-screen bg-primary')}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main
          className={`flex-1 w-full h-full flex flex-col ${mainMargin}`}
          style={{
            height: `calc(100vh - ${marginPx * 2}px)`,
            maxHeight: `calc(100vh - ${marginPx * 2}px)`,
            overflow: 'auto',
          }}
        >
          <Outlet />
        </main>
      </div>
    </NotificationsProvider>
  );
}
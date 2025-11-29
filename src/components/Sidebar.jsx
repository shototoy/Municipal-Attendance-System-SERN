import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Fingerprint, ChevronRight, ChevronDown, LogOut, Home } from 'lucide-react';
const iconMap = {
  Home,
  Fingerprint
};

import { useNotifications } from '../contexts/NotificationsContext';
import { useTheme } from '../contexts/ThemeContext';

function CategoryBadge({ menuId }) {
  const ctx = useNotifications();
  const totals = ctx?.totals || {};
  const map = { logs: 'logs', announcements: 'announcements', requests: 'requests', reports: 'reports' };
  const count = totals[menuId] || 0;
  if (!count) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function NavBadge({ path }) {
  const ctx = useNotifications();
  const count = ctx?.unread?.[path] || 0;
  if (!count) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}

const menuConfig = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/admin'
  },
  {
    id: 'logs',
    label: 'Employee Logs',
    icon: 'Fingerprint',
    path: '/admin/logs'
  }
];

import { Menu } from 'lucide-react';

export default function Sidebar({ onLogout, collapsed, setCollapsed }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSubmenu = (menuId) => {
    setOpenMenuId(prev => (prev === menuId ? null : menuId));
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  const { get } = useTheme();

  // Match vertical margin of main container for padding
  // Use constant vertical padding
  return (
    <aside
      className={
        get('sidebar.root', 'text-white flex flex-col h-screen') +
        ' ' + get('colors.adminSidebarBg', '')
      }
      style={{
        overflow: 'hidden',
        width: collapsed ? '4rem' : '16rem',
        minWidth: collapsed ? '4rem' : '16rem',
        maxWidth: collapsed ? '4rem' : '16rem',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1), max-width 0.3s cubic-bezier(0.4,0,0.2,1)',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
      }}
    >
      <div className={collapsed ? 'p-2 flex flex-col items-center' : 'pt-6 px-6 flex flex-col items-center'}>
            <div className={collapsed ? '' : 'flex items-center gap-3 mb-4'} style={{ position: 'relative', minHeight: '2.25rem' }}>
              <button
                aria-label="Toggle sidebar"
                className={collapsed ? 'mb-2 text-white hover:text-blue-200 focus:outline-none' : 'text-white hover:text-blue-200 focus:outline-none'}
                onClick={() => setCollapsed((c) => !c)}
              >
                <Menu className={collapsed ? 'w-6 h-6' : 'w-5 h-5'} />
              </button>
              <span
                className="text-white font-semibold text-base whitespace-nowrap"
                style={{
                  display: 'inline-block',
                  maxWidth: collapsed ? 0 : 200,
                  opacity: collapsed ? 0 : 1,
                  transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  marginLeft: collapsed ? 0 : '0.75rem',
                  pointerEvents: collapsed ? 'none' : 'auto',
                }}
              >
                Municipality of Esperanza
              </span>
            </div>
        <div
          className={
            'rounded-full border-2 border-gray-600 bg-gray-700 flex items-center justify-center text-gray-300 font-bold mx-auto'
          }
          style={{
            width: collapsed ? '2.5rem' : '5rem',
            height: collapsed ? '2.5rem' : '5rem',
            fontSize: collapsed ? '1.125rem' : '1.25rem',
            transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), height 0.3s cubic-bezier(0.4,0,0.2,1), font-size 0.3s cubic-bezier(0.4,0,0.2,1)',
            minHeight: '2.5rem',
            maxHeight: '5rem',
            marginBottom: 0
          }}
        >
          A
        </div>
      </div>

        <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {menuConfig.map(menu => {
            const Icon = iconMap[menu.icon];
            return (
              <li key={menu.id}>
                <button
                  onClick={() => handleNavigation(menu.path)}
                  className={get('sidebar.navButton', 'w-full px-6 py-3 flex items-center justify-between hover:bg-indigo-700 transition') + (collapsed ? ' justify-center px-0' : '')}
                  style={collapsed ? { paddingLeft: 0, paddingRight: 0 } : {}}
                >
                  <span className={collapsed ? 'flex items-center justify-center w-full' : 'flex items-center gap-3'}>
                    <Icon className={collapsed ? 'w-6 h-6' : 'w-5 h-5'} />
                    {!collapsed && <span className="text-sm">{menu.label}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

          <div className={collapsed ? 'p-2 flex flex-col items-center' : 'p-4'}>
        <button
          onClick={onLogout}
          className={
            'w-full flex items-center bg-red-600 hover:bg-red-700 text-white rounded transition font-medium text-sm' +
            (collapsed ? ' justify-center' : ' gap-2 py-2 px-4')
          }
          style={{
            height: 36,
            minWidth: 36,
            maxWidth: collapsed ? 36 : '100%',
            width: collapsed ? 36 : '100%',
            padding: collapsed ? 0 : undefined,
            transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1), padding 0.3s, background 0.3s',
            overflow: 'hidden',
          }}
        >
          <LogOut className={collapsed ? 'w-5 h-5' : 'w-4 h-4'} />
          <span
            style={{
              display: 'inline-block',
              maxWidth: collapsed ? 0 : 80,
              opacity: collapsed ? 0 : 1,
              marginLeft: collapsed ? 0 : 8,
              transition: 'max-width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1), margin-left 0.3s',
              whiteSpace: 'nowrap',
              pointerEvents: collapsed ? 'none' : 'auto',
            }}
          >
            LOGOUT
          </span>
        </button>
      </div>
    </aside>
  );
}
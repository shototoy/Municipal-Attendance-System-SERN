import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
// polling and attendance API disabled for now
import { useToast } from '../components/Toast';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [unread, setUnread] = useState({});
  const toast = useToast();
  const location = useLocation();
  // removed announcements and requests counters
  const lastAttendanceSeenTsRef = useRef(localStorage.getItem('notif_attendance_seen_ts') || null);
  const latestAttendanceTsRef = useRef(null);
  const latestAttendanceNameRef = useRef(null);
  const lastAttendanceToastTsRef = useRef(localStorage.getItem('notif_attendance_toast_ts') || null);

  // cooldown tracker to prevent multiple toasts for a single action
  const lastToastRef = useRef({});
  const shouldNotify = (key, id) => {
    const now = Date.now();
    const entry = lastToastRef.current[key];
    if (entry && (entry.id === id || now - entry.ts < 3000)) return false;
    lastToastRef.current[key] = { id, ts: now };
    return true;
  };

  const firedThisTick = useRef(false);

  const poll = async () => {
    try {
      firedThisTick.current = false;
      // notifications disabled for now
      setUnread({});

    } catch (e) {
    }
  };

  // polling disabled

  useEffect(() => {
    const path = location.pathname;
    if (toast.removeByTarget) toast.removeByTarget(path);
    if (path === '/admin/logs' && latestAttendanceTsRef.current) {
      lastAttendanceSeenTsRef.current = latestAttendanceTsRef.current;
      localStorage.setItem('notif_attendance_seen_ts', lastAttendanceSeenTsRef.current);
    }
  }, [location.pathname]);

  const totals = useMemo(() => {
    const t = { logs: 0, announcements: 0, reports: 0 };
    t.announcements = (unread['/admin/announcements/create'] || 0) + (unread['/admin/announcements/edit'] || 0);
    t.logs = (unread['/admin/logs'] || 0);
    t.reports = (unread['/admin/reports/attendance'] || 0) + (unread['/admin/reports/trends'] || 0);
    return t;
  }, [unread]);

  const value = useMemo(() => ({ unread, totals }), [unread, totals]);

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);

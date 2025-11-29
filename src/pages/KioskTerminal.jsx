import { useState, useRef } from 'react';
import { useToast } from '../components/Toast';
import { useTheme } from '../contexts/ThemeContext';

// Mock staff data keyed by RFID
const MOCK_STAFF = {
  '12345678': {
    id: 1,
    firstname: 'Juan',
    middlename: 'D.',
    lastname: 'Cruz',
    position: 'Barangay Staff',
    rfid: '12345678',
    photo: 'https://randomuser.me/api/portraits/men/75.jpg',
  },
  '87654321': {
    id: 2,
    firstname: 'Maria',
    middlename: 'L.',
    lastname: 'Reyes',
    position: 'Barangay Secretary',
    rfid: '87654321',
    photo: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
};

export default function KioskTerminal() {
  const toast = useToast();
  const { get } = useTheme();
  const [rfid, setRfid] = useState('');
  const [status, setStatus] = useState('idle'); // idle | success | error
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const inputRef = useRef();

  // Simulate RFID scan handler
  const handleRfidSubmit = async (e) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');
    setUser(null);
    if (!rfid.trim()) {
      setStatus('error');
      setMessage('Please scan your RFID card.');
      toast.error('No RFID detected');
      return;
    }
    // Simulate lookup
    const staff = MOCK_STAFF[rfid.trim()];
    if (staff) {
      setStatus('success');
      setMessage('Attendance logged!');
      setUser(staff);
      toast.success(`Welcome, ${staff.firstname}!`);
    } else {
      setStatus('error');
      setMessage('RFID not recognized.');
      setUser(null);
      toast.error('RFID not recognized');
    }
    setRfid('');
    inputRef.current?.focus();
  };

  return (
    <div className={get('kiosk.shell', 'h-screen flex flex-col bg-background')} style={{ maxWidth: 480, margin: '0 auto' }}>
      <header className={get('kiosk.header', 'flex-none bg-primary text-accent2 py-4 px-6 shadow-md')}>
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold leading-tight truncate text-accent2">Attendance Kiosk</h1>
        </div>
      </header>
      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <form onSubmit={handleRfidSubmit} className="w-full flex flex-col items-center gap-6">
          <div className="w-full text-center mb-2">
            <h2 className="text-xl font-semibold text-text mb-1">Scan RFID to Log Attendance</h2>
            <p className="text-secondary text-sm">Place your RFID card on the reader</p>
          </div>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoFocus
            value={rfid}
            onChange={e => setRfid(e.target.value)}
            placeholder="Scan RFID here"
            className={get('kiosk.input', 'text-center text-2xl tracking-widest px-4 py-4 rounded-lg border-2 border-accent1 focus:ring-2 focus:ring-primary outline-none w-full max-w-xs bg-accent2 text-text shadow')}
            style={{ letterSpacing: 8, fontFamily: 'monospace' }}
          />
          <button
            type="submit"
            className={get('kiosk.button', 'w-full max-w-xs py-3 bg-primary text-accent2 rounded-lg text-lg font-bold shadow hover:bg-secondary transition')}
          >
            Log Attendance
          </button>
          {status === 'success' && user && (
            <div className={get('kiosk.userCard', 'w-full max-w-xs mx-auto bg-accent2 rounded-xl shadow-lg border border-accent1 p-6 mt-4 flex flex-col items-center')}>
              <img src={user.photo} alt="User" className="w-20 h-20 rounded-full mb-3 border-4 border-accent1 shadow" />
              <div className="text-lg font-bold text-primary mb-1">{user.firstname} {user.middlename} {user.lastname}</div>
              <div className="text-sm text-secondary mb-1">{user.position}</div>
              <div className="text-xs text-text">RFID: {user.rfid}</div>
              <div className="mt-2 text-secondary font-semibold">{message}</div>
            </div>
          )}
          {status === 'error' && (
            <div className="w-full max-w-xs text-center text-secondary font-semibold text-lg mt-2">{message}</div>
          )}
        </form>
      </main>
    </div>
  );
}
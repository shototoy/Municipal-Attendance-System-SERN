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
      <main className="flex-1 flex flex-col justify-center items-center p-6 relative">
        {/* Centered image placeholder */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 180 }}>
          <div style={{ width: 140, height: 140, borderRadius: '50%', background: '#b7c9b7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: '#fff', margin: '0 auto' }}>
            Image
          </div>
        </div>
        {/* 3 placeholders above footer */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '32px 0 16px 0' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: '#e9ecef', margin: '0 auto', marginBottom: 8 }} />
            <div style={{ color: '#888' }}>Placeholder 1</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: '#e9ecef', margin: '0 auto', marginBottom: 8 }} />
            <div style={{ color: '#888' }}>Placeholder 2</div>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: '#e9ecef', margin: '0 auto', marginBottom: 8 }} />
            <div style={{ color: '#888' }}>Placeholder 3</div>
          </div>
        </div>
      </main>
      {/* Footer with input and button in one row */}
      <footer style={{ width: '100%', padding: '1rem', background: '#fff', borderTop: '1px solid #b7c9b7', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <form onSubmit={handleRfidSubmit} style={{ display: 'flex', width: '100%', maxWidth: 400, gap: 12 }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoFocus
            value={rfid}
            onChange={e => setRfid(e.target.value)}
            placeholder="Scan RFID here"
            style={{ flex: 1, fontSize: 20, padding: '0.75rem 1rem', borderRadius: 8, border: '2px solid #b7c9b7', outline: 'none', background: '#e9ecef', color: '#222', letterSpacing: 8, fontFamily: 'monospace' }}
          />
          <button
            type="submit"
            style={{ padding: '0.75rem 1.5rem', borderRadius: 8, background: '#1a3c34', color: '#fff', fontWeight: 700, fontSize: 18, border: 'none', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
          >
            Log Attendance
          </button>
        </form>
      </footer>
    </div>
  );
}
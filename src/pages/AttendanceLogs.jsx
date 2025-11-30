
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Search, Bell, User } from '../components/Icons';

// Mock staff and attendance data
const MOCK_STAFF = [
  { id: 1, firstname: 'Juan', middlename: 'D.', lastname: 'Cruz', position: 'Barangay Staff' },
  { id: 2, firstname: 'Maria', middlename: 'L.', lastname: 'Reyes', position: 'Barangay Secretary' },
];
const MOCK_LOGS = [
  { staff_id: 1, firstname: 'Juan', middlename: 'D.', lastname: 'Cruz', position: 'Barangay Staff', timestamp: new Date().setHours(8, 0, 0, 0) },
  { staff_id: 1, firstname: 'Juan', middlename: 'D.', lastname: 'Cruz', position: 'Barangay Staff', timestamp: new Date().setHours(17, 0, 0, 0) },
  { staff_id: 2, firstname: 'Maria', middlename: 'L.', lastname: 'Reyes', position: 'Barangay Secretary', timestamp: new Date().setHours(8, 30, 0, 0) },
  { staff_id: 2, firstname: 'Maria', middlename: 'L.', lastname: 'Reyes', position: 'Barangay Secretary', timestamp: new Date().setHours(17, 15, 0, 0) },
];

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString();
}


export default function AttendanceLogs() {
  const { get } = useTheme();
  const [rows, setRows] = useState(MOCK_LOGS);
  const [staff, setStaff] = useState(MOCK_STAFF);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [fromDate, setFromDate] = useState('');
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}`;
  const [toDate, setToDate] = useState(todayStr);
  const [applying, setApplying] = useState(false);

  // Filter logs directly, no loading
  useEffect(() => {
    let filtered = MOCK_LOGS;
    if (fromDate) filtered = filtered.filter(l => l.timestamp >= new Date(fromDate).setHours(0,0,0,0));
    if (toDate) filtered = filtered.filter(l => l.timestamp <= new Date(toDate).setHours(23,59,59,999));
    setRows(filtered);
  }, [fromDate, toDate]);

  const grouped = useMemo(() => {
    const byDate = new Map();
    const sorted = [...rows].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    for (const r of sorted) {
      if (selectedStaff && String(r.staff_id) !== String(selectedStaff)) continue;
      const dateKey = formatDate(r.timestamp);
      if (!byDate.has(dateKey)) byDate.set(dateKey, []);
      byDate.get(dateKey).push(r);
    }
    const result = [];
    for (const [date, list] of byDate.entries()) {
      const byStaff = new Map();
      for (const r of list) {
        if (!byStaff.has(r.staff_id)) byStaff.set(r.staff_id, []);
        byStaff.get(r.staff_id).push(r);
      }
      const pairs = [];
      for (const [sid, logs] of byStaff.entries()) {
        logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        for (let i = 0; i < logs.length; i += 2) {
          const a = logs[i];
          const b = logs[i + 1] || null;
          pairs.push({
            date,
            staff_id: sid,
            firstname: a.firstname, middlename: a.middlename, lastname: a.lastname,
            position: a.position,
            inTime: a.timestamp,
            outTime: b ? b.timestamp : null,
          });
        }
      }
      pairs.sort((a, b) => new Date(b.inTime) - new Date(a.inTime));
      result.push({ date, rows: pairs });
    }
    result.sort((a, b) => new Date(b.rows[0]?.inTime || 0) - new Date(a.rows[0]?.inTime || 0));
    return result;
  }, [rows, selectedStaff]);


  const handleApply = (e) => {
    e?.preventDefault();
    // Filtering is handled by useEffect
  };

  return (
    <div className="p-6 bg-accent2 min-h-screen">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 9999, background: '#fff', padding: '0.5rem 1rem', minWidth: 240, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <Search size={20} style={{ color: '#888', marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search logs..."
            style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: 16, width: 160 }}
          />
        </div>
        {/* Right icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} aria-label="Notifications">
            <Bell size={22} style={{ color: '#1a3c34' }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#b7c9b7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} style={{ color: '#fff' }} />
          </div>
        </div>
      </div>


      {/* Inline filter bar: left = current month, right = year/month dropdowns */}
      <form style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#e9ecef', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '0.75rem 1.5rem' }}>
        {/* Left: Current Month */}
        <div style={{ fontWeight: 600, fontSize: 18, color: '#1a3c34' }}>
          Month: {new Date().toLocaleString('default', { month: 'long' })}
        </div>
        {/* Right: Year and Month dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label htmlFor="year-select" style={{ marginRight: 4, fontWeight: 500, color: '#1a3c34' }}>Year:</label>
          <select id="year-select" style={{ borderRadius: 9999, border: '1px solid #b7c9b7', padding: '0.35rem 1.1rem', fontSize: 16 }}>
            {Array.from({ length: 6 }).map((_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
          <label htmlFor="month-select" style={{ marginLeft: 10, marginRight: 4, fontWeight: 500, color: '#1a3c34' }}>Month:</label>
          <select id="month-select" style={{ borderRadius: 9999, border: '1px solid #b7c9b7', padding: '0.35rem 1.1rem', fontSize: 16 }}>
            {Array.from({ length: 12 }).map((_, i) => {
              const month = new Date(0, i).toLocaleString('default', { month: 'long' });
              return <option key={month} value={i+1}>{month}</option>;
            })}
          </select>
        </div>
      </form>

      <div className="overflow-auto bg-accent2 rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-background text-text">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Staff</th>
              <th className="px-3 py-2 text-left">Position</th>
              <th className="px-3 py-2 text-left">In</th>
              <th className="px-3 py-2 text-left">Out</th>
            </tr>
          </thead>
          <tbody>
            {grouped.map(section => {
              const rowSpan = section.rows.length || 1;
              return section.rows.map((r, idx) => (
                <tr key={`${section.date}-${r.staff_id}-${r.inTime || idx}`} className="border-t border-accent1">
                  {idx === 0 && (
                    <td className="px-3 py-2 align-top font-medium" rowSpan={rowSpan}>{section.date}</td>
                  )}
                  <td className="px-3 py-2 whitespace-nowrap">{r.firstname} {r.middlename ? r.middlename + ' ' : ''}{r.lastname}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.position}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.inTime ? new Date(r.inTime).toLocaleTimeString() : '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{r.outTime ? new Date(r.outTime).toLocaleTimeString() : '-'}</td>
                </tr>
              ))
            })}
            {grouped.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-secondary" colSpan={5}>No attendance yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

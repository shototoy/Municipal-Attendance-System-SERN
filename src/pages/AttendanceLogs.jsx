
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

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
    <div className="p-6 bg-white min-h-screen">
      <h1 className={get('admin.title', 'text-2xl font-bold mb-4')}>Attendance Logs</h1>

      <form onSubmit={handleApply} className="mb-4 bg-white rounded shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Employee</label>
          <select
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All</option>
            {staff.map(s => (
              <option key={s.id} value={s.id}>
                {s.firstname} {s.middlename ? s.middlename + ' ' : ''}{s.lastname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={applying} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{applying ? 'Applying...' : 'Apply'}</button>
          <button type="button" className="px-3 py-2 bg-gray-200 text-gray-800 rounded" onClick={() => { setSelectedStaff(''); setFromDate(''); setToDate(''); }}>Clear</button>
        </div>
      </form>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
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
                <tr key={`${section.date}-${r.staff_id}-${r.inTime || idx}`} className="border-t">
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
                <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>No attendance yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

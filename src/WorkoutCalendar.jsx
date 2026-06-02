import { useState, useMemo } from 'react';

const KG_TO_LBS = 2.20462;

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function WorkoutCalendar({ exercises, unit }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const byDay = useMemo(() => {
    const map = {};
    for (const ex of exercises) {
      if (!ex.date) continue;
      (map[ex.date] ||= []).push(ex);
    }
    return map;
  }, [exercises]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = viewDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function toDisplay(kg) {
    const v = unit === 'lbs' ? kg * KG_TO_LBS : kg;
    return Math.round(v * 10) / 10;
  }

  const selected = selectedDay ? (byDay[selectedDay] || []) : [];

  return (
    <div style={{ maxWidth: 400, margin: '0 auto 40px', fontFamily: 'sans-serif' }}>
      <h3>Calendar</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={() => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); }}>‹</button>
        <strong>{monthName}</strong>
        <button onClick={() => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); }}>›</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} style={{ fontSize: 12, color: '#888' }}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`blank-${i}`} />;
          const key = dateKey(new Date(year, month, d));
          const has = !!byDay[key];
          const isSelected = selectedDay === key;
          return (
            <button
              key={key}
              onClick={() => setSelectedDay(isSelected ? null : key)}
              style={{
                padding: '8px 0',
                borderRadius: 8,
                border: isSelected ? '2px solid #2563eb' : '1px solid #eee',
                background: has ? '#d1fae5' : '#fff',
                fontWeight: has ? 'bold' : 'normal',
                cursor: 'pointer',
              }}
            >
              {d}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div style={{ marginTop: 12 }}>
          <strong>{selectedDay}</strong>
          {selected.length === 0 ? (
            <p style={{ color: '#888' }}>No workout logged this day.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {selected.map(ex => (
                <li key={ex.id} style={{ padding: '8px 12px', background: '#f0f9f0', borderRadius: 8 }}>
                  <strong>{ex.name}</strong> — {ex.reps} reps @ {toDisplay(Number(ex.weight))} {unit}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
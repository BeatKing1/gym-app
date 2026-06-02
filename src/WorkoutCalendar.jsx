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
    <div>
      <h3>Calendar</h3>
      <div className="cal-nav">
        <button onClick={() => { setViewDate(new Date(year, month - 1, 1)); setSelectedDay(null); }}>‹</button>
        <strong>{monthName}</strong>
        <button onClick={() => { setViewDate(new Date(year, month + 1, 1)); setSelectedDay(null); }}>›</button>
      </div>

      <div className="cal-grid">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="cal-dow">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`blank-${i}`} />;
          const key = dateKey(new Date(year, month, d));
          const has = !!byDay[key];
          const isSelected = selectedDay === key;
          const cls = 'cal-day' + (has ? ' has-workout' : '') + (isSelected ? ' selected' : '');
          return (
            <button key={key} className={cls} onClick={() => setSelectedDay(isSelected ? null : key)}>{d}</button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="cal-detail">
          <strong>{selectedDay}</strong>
          {selected.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No workout logged this day.</p>
          ) : (
            selected.map(ex => (
              <div key={ex.id} className="cal-detail-item">
                <strong>{ex.name}</strong> — {ex.reps} reps @ {toDisplay(Number(ex.weight))} {unit}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
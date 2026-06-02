import { useState } from 'react';

const EMPTY = { name: '', reps: '', weight: '' };

export default function ExerciseForm({ onAdd }) {
  const [form, setForm] = useState(EMPTY);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(form);
    setForm(EMPTY);
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Log Exercise</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>
          Exercise name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Bench Press"
            required
            style={inputStyle}
          />
        </label>
        <label>
          Reps
          <input
            name="reps"
            type="number"
            min="1"
            value={form.reps}
            onChange={handleChange}
            placeholder="e.g. 10"
            required
            style={inputStyle}
          />
        </label>
        <label>
          Weight (kg)
          <input
            name="weight"
            type="number"
            min="0"
            step="0.5"
            value={form.weight}
            onChange={handleChange}
            placeholder="e.g. 80"
            required
            style={inputStyle}
          />
        </label>
        <button type="submit" style={btnStyle}>Save Exercise</button>
      </form>

    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  marginTop: 4,
  padding: '8px 10px',
  fontSize: 16,
  boxSizing: 'border-box',
  border: '1px solid #ccc',
  borderRadius: 6,
};

const btnStyle = {
  padding: '10px 0',
  fontSize: 16,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

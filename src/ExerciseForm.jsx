import { useState } from 'react';

const EMPTY = { name: '', reps: '', weight: '' };
const KG_TO_LBS = 2.20462;

const COMMON_EXERCISES = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-up', 'Lat Pulldown', 'Bicep Curl', 'Tricep Extension', 'Leg Press',
  'Lunge', 'Romanian Deadlift', 'Incline Bench Press', 'Dumbbell Press', 'Plank',
];

export default function ExerciseForm({ onAdd, unit }) {
  const [form, setForm] = useState(EMPTY);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const entered = Number(form.weight);
    const weightKg = unit === 'lbs' ? entered / KG_TO_LBS : entered;
    onAdd({ name: form.name, reps: form.reps, weight: Math.round(weightKg * 100) / 100 });
    setForm(EMPTY);
  }

  return (
    <div>
      <h2>Log Exercise</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label>Exercise name
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Bench Press" list="exercise-options" required />
          <datalist id="exercise-options">
            {COMMON_EXERCISES.map(name => <option key={name} value={name} />)}
          </datalist>
        </label>
        <label>Reps
          <input name="reps" type="number" min="1" value={form.reps} onChange={handleChange} placeholder="e.g. 10" required />
        </label>
        <label>Weight ({unit})
          <input name="weight" type="number" min="0" step="0.5" value={form.weight} onChange={handleChange} placeholder={unit === 'lbs' ? 'e.g. 135' : 'e.g. 60'} required />
        </label>
        <button type="submit" className="btn-primary">Save Exercise</button>
      </form>
    </div>
  );
}
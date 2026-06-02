import { useMemo } from 'react';
import ExerciseForm from './ExerciseForm';
import WorkoutCalendar from './WorkoutCalendar';
import { useLocalStorage } from './useLocalStorage';

const KG_TO_LBS = 2.20462;

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function App() {
  const [exercises, setExercises] = useLocalStorage('gym-exercises', []);
  const [unit, setUnit] = useLocalStorage('gym-unit', 'kg');

  const totalVolumeKg = useMemo(
    () => exercises.reduce((sum, ex) => sum + Number(ex.reps) * Number(ex.weight), 0),
    [exercises]
  );

  function toDisplay(kg) {
    const val = unit === 'lbs' ? kg * KG_TO_LBS : kg;
    return Math.round(val * 10) / 10;
  }

  function addExercise(exercise) {
    setExercises(prev => [...prev, { ...exercise, id: crypto.randomUUID(), date: dateKey(new Date()) }]);
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  }

  return (
    <div className="app">
      <h1 className="app-title">Gym Tracker</h1>

      <div className="unit-toggle">
        <button onClick={() => setUnit('kg')} disabled={unit === 'kg'}>kg</button>
        <button onClick={() => setUnit('lbs')} disabled={unit === 'lbs'}>lbs</button>
      </div>

      <div className="card">
        <ExerciseForm onAdd={addExercise} unit={unit} />
      </div>

      {exercises.length > 0 && (
        <div className="card">
          <h3>Logged Exercises</h3>
          <div className="summary">
            <strong>{exercises.length}</strong> exercise{exercises.length !== 1 ? 's' : ''} · total volume <strong>{toDisplay(totalVolumeKg)} {unit}</strong>
          </div>
          <ul className="exercise-list">
            {exercises.map((ex) => (
              <li key={ex.id} className="exercise-item">
                <span><strong>{ex.name}</strong> — {ex.reps} reps @ {toDisplay(Number(ex.weight))} {unit}</span>
                <button className="remove" onClick={() => removeExercise(ex.id)}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <WorkoutCalendar exercises={exercises} unit={unit} />
      </div>
    </div>
  );
}

export default App;
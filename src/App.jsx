import { useMemo } from 'react';
import ExerciseForm from './ExerciseForm';
import { useLocalStorage } from './useLocalStorage';

const KG_TO_LBS = 2.20462;

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
    setExercises(prev => [...prev, { ...exercise, id: crypto.randomUUID() }]);
  }

  function removeExercise(id) {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'right', margin: '12px 0' }}>
        Units:{' '}
        <button onClick={() => setUnit('kg')} disabled={unit === 'kg'}>kg</button>{' '}
        <button onClick={() => setUnit('lbs')} disabled={unit === 'lbs'}>lbs</button>
      </div>

      <ExerciseForm onAdd={addExercise} unit={unit} />

      {exercises.length > 0 && (
        <div style={{ margin: '0 auto 40px' }}>
          <h3>Logged Exercises</h3>
          <p style={{ background: '#eef4ff', padding: '10px 14px', borderRadius: 8 }}>
            <strong>{exercises.length}</strong> exercise{exercises.length !== 1 ? 's' : ''} · total volume <strong>{toDisplay(totalVolumeKg)} {unit}</strong>
          </p>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exercises.map((ex) => (
              <li key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#f0f9f0', borderRadius: 8 }}>
                <span><strong>{ex.name}</strong> — {ex.reps} reps @ {toDisplay(Number(ex.weight))} {unit}</span>
                <button onClick={() => removeExercise(ex.id)}>✕</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useEffect, useState } from 'react';
import { fetchWorkouts, createWorkout } from '../services/api';

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState({ title: '', reps: '', load: '' });

  useEffect(() => {
    fetchWorkouts().then(res => setWorkouts(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createWorkout(form);
    setWorkouts([res.data, ...workouts]);
    setForm({ title: '', reps: '', load: '' });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Log a Workout</h1>

      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input name="title" placeholder="Workout title" value={form.title} onChange={handleChange} className="border p-2 w-full" required />
        <input name="reps" type="number" placeholder="Reps" value={form.reps} onChange={handleChange} className="border p-2 w-full" />
        <input name="load" type="number" placeholder="Load (kg)" value={form.load} onChange={handleChange} className="border p-2 w-full" />
        <button className="bg-blue-500 text-white p-2 rounded">Add Workout</button>
      </form>

      <ul className="space-y-2">
        {workouts.map((w) => (
          <li key={w.id} className="border p-2 rounded">
            <strong>{w.title}</strong> - {w.reps} reps @ {w.load}kg
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkoutsPage;

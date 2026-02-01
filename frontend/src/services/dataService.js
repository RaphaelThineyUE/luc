const API_BASE = 'http://localhost:5000/api';

export const dataService = {
  // People
  fetchPeople: async () => {
    const res = await fetch(`${API_BASE}/people`);
    return res.json();
  },

  addPerson: async (name, color) => {
    const res = await fetch(`${API_BASE}/people`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color }),
    });
    return res.json();
  },

  removePerson: async (id) => {
    const res = await fetch(`${API_BASE}/people/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  updatePerson: async (id, { name, color, allowance }) => {
    const res = await fetch(`${API_BASE}/people/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color, allowance }),
    });
    return res.json();
  },

  // Chores
  fetchChores: async () => {
    const res = await fetch(`${API_BASE}/chores`);
    return res.json();
  },

  addChore: async ({ name, personId, rate }) => {
    const res = await fetch(`${API_BASE}/chores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, personId, rate }),
    });
    return res.json();
  },

  removeChore: async (id) => {
    const res = await fetch(`${API_BASE}/chores/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Completions
  fetchCompletions: async () => {
    const res = await fetch(`${API_BASE}/completions`);
    return res.json();
  },

  addCompletion: async ({ choreId, personId, date, count }) => {
    const res = await fetch(`${API_BASE}/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choreId, personId, date, count }),
    });
    return res.json();
  },
};

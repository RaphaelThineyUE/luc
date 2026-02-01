import express from 'express';
import cors from 'cors';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');
const dataDir = join(__dirname, '..', 'data');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure data directory exists
await mkdir(dataDir, { recursive: true });

// Helper functions
const getFilePath = (filename) => join(dataDir, filename);

const readJSON = async (filename, defaultValue = null) => {
  try {
    const data = await readFile(getFilePath(filename), 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (defaultValue !== null) return defaultValue;
    throw error;
  }
};

const writeJSON = async (filename, data) => {
  await writeFile(getFilePath(filename), JSON.stringify(data, null, 2), 'utf-8');
};

// Routes - Users/People
app.get('/api/people', async (req, res) => {
  try {
    const people = await readJSON('people.json', []);
    res.json(people);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/people', async (req, res) => {
  try {
    const { name, color } = req.body;
    const people = await readJSON('people.json', []);
    const newPerson = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      color,
      allowance: 0,
    };
    people.push(newPerson);
    await writeJSON('people.json', people);
    res.json(newPerson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let people = await readJSON('people.json', []);
    people = people.filter((p) => p.id !== id);
    await writeJSON('people.json', people);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/people/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, allowance } = req.body;
    let people = await readJSON('people.json', []);
    const person = people.find((p) => p.id === id);
    if (!person) return res.status(404).json({ error: 'Person not found' });
    if (name) person.name = name;
    if (color) person.color = color;
    if (allowance !== undefined) person.allowance = Number(allowance);
    await writeJSON('people.json', people);
    res.json(person);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Chores
app.get('/api/chores', async (req, res) => {
  try {
    const chores = await readJSON('chores.json', []);
    res.json(chores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/chores', async (req, res) => {
  try {
    const { name, personId, rate } = req.body;
    const chores = await readJSON('chores.json', []);
    const newChore = {
      id: `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name,
      personId,
      rate: Number(rate),
    };
    chores.push(newChore);
    await writeJSON('chores.json', chores);
    res.json(newChore);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/chores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let chores = await readJSON('chores.json', []);
    chores = chores.filter((c) => c.id !== id);
    await writeJSON('chores.json', chores);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes - Completions
app.get('/api/completions', async (req, res) => {
  try {
    const completions = await readJSON('completions.json', []);
    res.json(completions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/completions', async (req, res) => {
  try {
    const { choreId, personId, date, count } = req.body;
    const completions = await readJSON('completions.json', []);
    const newCompletion = {
      id: `c-${Date.now()}`,
      choreId,
      personId,
      date,
      count: Number(count),
      timestamp: new Date().toISOString(),
    };
    completions.push(newCompletion);
    await writeJSON('completions.json', completions);
    res.json(newCompletion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

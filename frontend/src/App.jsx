import React, { useState, useEffect } from 'react';
import AllowanceSummary from './components/AllowanceSummary.jsx';
import ChoresList from './components/ChoresList.jsx';
import DailyProgressChart from './components/DailyProgressChart.jsx';
import WeeklyProgressChart from './components/WeeklyProgressChart.jsx';
import Hotbar from './components/Hotbar.jsx';
import AssignChorePanel from './components/AssignChorePanel.jsx';
import PeoplePanel from './components/PeoplePanel.jsx';
import { dataService } from './services/dataService.js';

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const buildWeekDays = () => {
  const today = new Date();
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    return toIsoDate(date);
  });
};

export default function App() {
  const weekDays = buildWeekDays();
  const weekDaySet = new Set(weekDays);
  const [chores, setChores] = useState([]);
  const [people, setPeople] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [view, setView] = useState('overview');
  const [assignPanel, setAssignPanel] = useState(false);
  const [peoplePanel, setPeoplePanel] = useState(false);
  const [loading, setLoading] = useState(true);
  const today = weekDays[weekDays.length - 1];

  // Load data from backend on mount
  const loadData = async () => {
    try {
      const [peopleData, choresData, completionsData] = await Promise.all([
        dataService.fetchPeople(),
        dataService.fetchChores(),
        dataService.fetchCompletions(),
      ]);
      setPeople(peopleData);
      setChores(choresData);
      setCompletions(completionsData);
      console.log('Loaded people:', peopleData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addPerson = async (name, color) => {
    // optimistic add
    const tempId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const optimistic = { id: tempId, name, color, allowance: 0 };
    setPeople((p) => [...p, optimistic]);
    try {
      const saved = await dataService.addPerson(name, color);
      // replace optimistic entry with saved (server) entry
      setPeople((p) => p.map((x) => (x.id === tempId ? saved : x)));
      return saved;
    } catch (err) {
      console.error('Failed to persist person, reverting optimistic add', err);
      setPeople((p) => p.filter((x) => x.id !== tempId));
      throw err;
    }
  };

  const choreMap = new Map(chores.map((chore) => [chore.id, chore]));

  const weekCompletions = completions.filter((completion) => weekDaySet.has(completion.date));

  const completionsByPerson = weekCompletions.reduce((acc, completion) => {
    acc[completion.personId] = (acc[completion.personId] || 0) + completion.count;
    return acc;
  }, {});

  const totalsByDay = weekCompletions.reduce((acc, completion) => {
    if (!acc[completion.date]) {
      acc[completion.date] = {};
    }
    acc[completion.date][completion.personId] =
      (acc[completion.date][completion.personId] || 0) + completion.count;
    return acc;
  }, {});

  const dailyTotalsByPerson = weekCompletions
    .filter((completion) => completion.date === today)
    .reduce((acc, completion) => {
      acc[completion.personId] = (acc[completion.personId] || 0) + completion.count;
      return acc;
    }, {});

  const allowanceTotalsByPerson = weekCompletions.reduce((acc, completion) => {
    const chore = choreMap.get(completion.choreId);
    const amount = chore ? chore.rate * completion.count : 0;
    acc[completion.personId] = (acc[completion.personId] || 0) + amount;
    return acc;
  }, {});

  const weeklyAllowanceTotal = Object.values(allowanceTotalsByPerson).reduce(
    (sum, amount) => sum + amount,
    0
  );

  const addChore = ({ name, personId, rate }) => {
    const id = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setChores((prev) => [...prev, { id, name, personId, rate: Number(rate) }]);
  };

  const removeChore = async (id) => {
    try {
      await dataService.removeChore(id);
      setChores((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error('Failed to remove chore:', error);
    }
  };

  return (
    <div className="app">
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      ) : (
      <div className="layout">
        <Hotbar active={view} setActive={setView} />

        {(assignPanel || peoplePanel) && (
          <div className="panel-backdrop" onClick={() => { setAssignPanel(false); setPeoplePanel(false); }} />
        )}

        <AssignChorePanel open={assignPanel} onClose={() => setAssignPanel(false)} chores={chores} people={people} />
        <PeoplePanel
          open={peoplePanel}
          onClose={() => setPeoplePanel(false)}
          people={people}
          chores={chores}
          allowanceTotalsByPerson={allowanceTotalsByPerson}
          onRefresh={loadData}
          onAddPerson={addPerson}
        />

        <div className="content">
          {view === 'overview' && (
            <>
              <header className="hero-with-button">
                <div className="hero-left">
                  <p className="eyebrow">Household Dashboard</p>
                  <h1>Chores & Allowance Overview</h1>
                  <p>Track weekly progress, daily completions, and allowance totals.</p>
                </div>
                <div className="header-buttons">
                  <button className="btn primary btn-assign" onClick={() => setPeoplePanel(true)}>
                    👥 People ({people.length})
                  </button>
                  <button className="btn primary btn-assign" onClick={() => setAssignPanel(true)}>
                    ✓ Assign Chore
                  </button>
                </div>
              </header>
              <div className="hero-card">
                <h3>Weekly Snapshot</h3>
                <div className="hero-stats">
                  {people.map((person) => (
                    <div key={person.id}>
                      <span className="stat-label">{person.name}</span>
                      <span className="stat-value">
                        {completionsByPerson[person.id] || 0} chores
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <main className="dashboard-grid">
                <ChoresList
                  chores={chores}
                  people={people}
                  completionsByPerson={completionsByPerson}
                  onRemoveChore={removeChore}
                />
                <WeeklyProgressChart days={weekDays} people={people} totalsByDay={totalsByDay} />
                <DailyProgressChart date={today} people={people} totalsByPerson={dailyTotalsByPerson} />
                <AllowanceSummary
                  total={weeklyAllowanceTotal}
                  totalsByPerson={allowanceTotalsByPerson}
                  people={people}
                />
              </main>
            </>
          )}

          {view === 'chores' && (
            <div className="card">
              <h2>Chores</h2>
              <ChoresList
                chores={chores}
                people={people}
                completionsByPerson={completionsByPerson}
                onRemoveChore={removeChore}
              />
            </div>
          )}

          {view === 'weekly' && (
            <div className="card">
              <h2>Weekly Progress</h2>
              <WeeklyProgressChart days={weekDays} people={people} totalsByDay={totalsByDay} />
            </div>
          )}

          {view === 'daily' && (
            <div className="card">
              <h2>Daily Progress</h2>
              <DailyProgressChart date={today} people={people} totalsByPerson={dailyTotalsByPerson} />
            </div>
          )}

          {view === 'allowance' && (
            <div className="card">
              <h2>Allowance</h2>
              <AllowanceSummary
                total={weeklyAllowanceTotal}
                totalsByPerson={allowanceTotalsByPerson}
                people={people}
              />
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

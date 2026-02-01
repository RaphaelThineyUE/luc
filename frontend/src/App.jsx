import AllowanceSummary from './components/AllowanceSummary.jsx';
import ChoresList from './components/ChoresList.jsx';
import DailyProgressChart from './components/DailyProgressChart.jsx';
import WeeklyProgressChart from './components/WeeklyProgressChart.jsx';
import { chores, completions, people } from './data/chores.js';

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
  const choreMap = new Map(chores.map((chore) => [chore.id, chore]));
  const today = weekDays[weekDays.length - 1];

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

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Household Dashboard</p>
          <h1>Chores & Allowance Overview</h1>
          <p>Track weekly progress, daily completions, and allowance totals.</p>
        </div>
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
      </header>

      <main className="dashboard-grid">
        <ChoresList
          chores={chores}
          people={people}
          completionsByPerson={completionsByPerson}
        />
        <WeeklyProgressChart days={weekDays} people={people} totalsByDay={totalsByDay} />
        <DailyProgressChart date={today} people={people} totalsByPerson={dailyTotalsByPerson} />
        <AllowanceSummary
          total={weeklyAllowanceTotal}
          totalsByPerson={allowanceTotalsByPerson}
          people={people}
        />
      </main>
    </div>
  );
}

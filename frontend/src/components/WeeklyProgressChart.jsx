const getDayLabel = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { weekday: 'short' });
};

export default function WeeklyProgressChart({ days, people, totalsByDay }) {
  const maxTotal = Math.max(
    1,
    ...days.map((day) =>
      people.reduce((sum, person) => sum + (totalsByDay[day]?.[person.id] || 0), 0)
    )
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2>Weekly Progress</h2>
        <p>Completions per day (stacked by person)</p>
      </div>
      <div className="weekly-chart">
        {days.map((day) => {
          const dayTotal = people.reduce(
            (sum, person) => sum + (totalsByDay[day]?.[person.id] || 0),
            0
          );
          return (
            <div key={day} className="weekly-chart-column">
              <div className="weekly-bar" aria-label={`${day} total ${dayTotal}`}>
                {people.map((person) => {
                  const count = totalsByDay[day]?.[person.id] || 0;
                  const height = (count / maxTotal) * 100;
                  return (
                    <div
                      key={person.id}
                      className="weekly-segment"
                      style={{ height: `${height}%`, backgroundColor: person.color }}
                      title={`${person.name}: ${count}`}
                    />
                  );
                })}
              </div>
              <span>{getDayLabel(day)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

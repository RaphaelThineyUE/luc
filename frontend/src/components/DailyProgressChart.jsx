const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
};

export default function DailyProgressChart({ date, people, totalsByPerson }) {
  const maxTotal = Math.max(1, ...people.map((person) => totalsByPerson[person.id] || 0));

  return (
    <div className="card">
      <div className="card-header">
        <h2>Daily Progress</h2>
        <p>{formatDate(date)}</p>
      </div>
      <div className="daily-chart">
        {people.map((person) => {
          const count = totalsByPerson[person.id] || 0;
          const width = (count / maxTotal) * 100;
          return (
            <div key={person.id} className="daily-row">
              <span className="label">{person.name}</span>
              <div className="daily-bar">
                <div
                  className="daily-fill"
                  style={{ width: `${width}%`, backgroundColor: person.color }}
                />
              </div>
              <span className="count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

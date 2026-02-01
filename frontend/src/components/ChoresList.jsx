export default function ChoresList({ chores, people, completionsByPerson }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Chores & Completion Counts</h2>
        <p>Per-person summary for the week</p>
      </div>
      <div className="chores-list">
        {people.map((person) => {
          const personChores = chores.filter((chore) => chore.personId === person.id);
          return (
            <div key={person.id} className="chores-person">
              <div className="person-heading">
                <span className="color-dot" style={{ backgroundColor: person.color }} />
                <div>
                  <h3>{person.name}</h3>
                  <p>{completionsByPerson[person.id] || 0} completions</p>
                </div>
              </div>
              <ul>
                {personChores.map((chore) => (
                  <li key={chore.id}>
                    <span>{chore.name}</span>
                    <span>${chore.rate.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

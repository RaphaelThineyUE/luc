const formatCurrency = (value) =>
  value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

export default function AllowanceSummary({ total, totalsByPerson, people }) {
  return (
    <div className="card allowance-card">
      <div className="card-header">
        <h2>Weekly Allowance Total</h2>
        <p>Current week payout summary</p>
      </div>
      <div className="allowance-total">
        <span className="amount">{formatCurrency(total)}</span>
        <span className="label">Total earned this week</span>
      </div>
      <div className="allowance-breakdown">
        {people.map((person) => (
          <div key={person.id} className="allowance-row">
            <span>{person.name}</span>
            <span>{formatCurrency(totalsByPerson[person.id] || 0)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

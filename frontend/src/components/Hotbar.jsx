import React from 'react';

export default function Hotbar({ active, setActive }) {
  const items = [
    { id: 'overview', label: 'Home', symbol: '🏠' },
    { id: 'chores', label: 'Chores', symbol: '🧹' },
    { id: 'weekly', label: 'Weekly', symbol: '📅' },
    { id: 'daily', label: 'Daily', symbol: '☀️' },
    { id: 'allowance', label: 'Allowance', symbol: '$' },
  ];

  return (
    <nav className="hotbar" aria-label="Primary navigation">
      {items.map((it) => (
        <button
          key={it.id}
          title={it.label}
          className={`hotbar-button ${active === it.id ? 'active' : ''}`}
          onClick={() => setActive(it.id)}
        >
          <span className="hotbar-symbol">{it.symbol}</span>
          <span className="hotbar-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

import React, { useState } from 'react';
import { dataService } from '../services/dataService.js';

export default function AssignChorePanel({ open, onClose, chores, people }) {
  const [selectedPerson, setSelectedPerson] = useState(people[0]?.id || '');
  const [selectedChore, setSelectedChore] = useState(chores[0]?.id || '');
  const [quantity, setQuantity] = useState('1');

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      const today = new Date().toISOString().slice(0, 10);
      await dataService.addCompletion({
        choreId: selectedChore,
        personId: selectedPerson,
        date: today,
        count: quantity,
      });
      // Reset form
      setSelectedPerson(people[0]?.id || '');
      setSelectedChore(chores[0]?.id || '');
      setQuantity('1');
      onClose();
    } catch (error) {
      console.error('Failed to assign chore:', error);
    }
  };

  return (
    <>
      <div className={`assign-panel ${open ? 'open' : ''}`}>
        <div className="assign-panel-header">
          <h2>Assign Chore</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleAssign} className="assign-form">
          <div className="form-group">
            <label htmlFor="person">Person</label>
            <select
              id="person"
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
            >
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="chore">Chore</label>
            <select
              id="chore"
              value={selectedChore}
              onChange={(e) => setSelectedChore(e.target.value)}
            >
              {chores.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (${c.rate.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Times</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              Assign
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

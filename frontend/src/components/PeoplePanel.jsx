import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService.js';

export default function PeoplePanel({ open, onClose, people, chores, allowanceTotalsByPerson, onRefresh, onAddPerson }) {
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAllowance, setEditAllowance] = useState('0');
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonColor, setNewPersonColor] = useState('#4f46e5');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [localPeople, setLocalPeople] = useState(people || []);
  useEffect(() => {
    setLocalPeople(people || []);
  }, [people]);

  const handleEditStart = (person) => {
    setEditingId(person.id);
    setEditName(person.name);
    setEditAllowance(person.allowance || 0);
    setError('');
  };

  const handleSaveEdit = async (id) => {
    try {
      setLoading(true);
      setError('');
      await dataService.updatePerson(id, {
        name: editName,
        allowance: Number(editAllowance),
      });
      setEditingId(null);
      await onRefresh();
    } catch (err) {
      console.error('Failed to update person:', err);
      setError('Failed to update person: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (confirm('Remove this person?')) {
      try {
        setLoading(true);
        setError('');
        await dataService.removePerson(id);
        await onRefresh();
      } catch (err) {
        console.error('Failed to remove person:', err);
        setError('Failed to remove person: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    if (!newPersonName.trim()) {
      setError('Please enter a name');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      console.log('Adding person with name:', newPersonName, 'color:', newPersonColor);
      let newPerson;
      if (onAddPerson) {
        newPerson = await onAddPerson(newPersonName, newPersonColor);
      } else {
        newPerson = await dataService.addPerson(newPersonName, newPersonColor);
      }
      console.log('Person added successfully:', newPerson);
      setNewPersonName('');
      setNewPersonColor('#4f46e5');
      // Add to localPeople immediately for UI
      setLocalPeople((lp) => [...lp, newPerson]);
      // Refresh to update data from backend (if provided)
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Failed to add person:', err);
      setError('Failed to add person: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getPersonChores = (personId) => {
    return chores.filter((c) => c.personId === personId);
  };

  return (
    <>
      <div className={`assign-panel ${open ? 'open' : ''}`}>
        <div className="assign-panel-header">
          <h2>Manage People</h2>
          <button className="close-btn" onClick={onClose} disabled={loading}>✕</button>
        </div>

        <div className="assign-form">
          {error && <div className="error-message">{error}</div>}

          {/* Add new person form */}
          <div className="people-section">
            <h3>Add Member</h3>
            <form onSubmit={handleAddPerson} className="add-person-form">
              <input
                type="text"
                placeholder="Name"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <input
                type="color"
                value={newPersonColor}
                onChange={(e) => setNewPersonColor(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
          </div>

          {/* Existing people */}
          <div className="people-section">
            <h3>Members ({localPeople.length})</h3>
            <div className="people-list">
              {localPeople.map((person) => {
                const personChores = getPersonChores(person.id);
                const allowance = allowanceTotalsByPerson[person.id] || 0;
                const isEditing = editingId === person.id;

                return (
                  <div key={person.id} className="person-card">
                    <div className="person-card-header">
                      <div
                        className="person-color-dot"
                        style={{ background: person.color }}
                      />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="edit-name-input"
                          disabled={loading}
                        />
                      ) : (
                        <h4>{person.name}</h4>
                      )}
                    </div>

                    <div className="person-card-body">
                      <div className="person-info-row">
                        <span>Total Allowance:</span>
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={editAllowance}
                            onChange={(e) => setEditAllowance(e.target.value)}
                            className="edit-allowance-input"
                            disabled={loading}
                          />
                        ) : (
                          <strong>${allowance.toFixed(2)}</strong>
                        )}
                      </div>

                      <div className="person-info-row">
                        <span>Assigned Chores:</span>
                        <span>{personChores.length}</span>
                      </div>

                      {personChores.length > 0 && (
                        <div className="person-chores">
                          {personChores.map((chore) => (
                            <div key={chore.id} className="chore-tag">
                              {chore.name} (${chore.rate.toFixed(2)})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="person-card-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="btn small"
                            onClick={() => handleSaveEdit(person.id)}
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button
                            className="btn small link"
                            onClick={() => setEditingId(null)}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn small"
                            onClick={() => handleEditStart(person)}
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            className="btn small link"
                            onClick={() => handleRemove(person.id)}
                            disabled={loading}
                          >
                            Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const isoDate = (date) => date.toISOString().slice(0, 10);
const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return isoDate(date);
};

export const people = [
  { id: 'alex', name: 'Alex', color: '#4f46e5' },
  { id: 'luc', name: 'Luc', color: '#0ea5e9' },
];

export const chores = [
  { id: 'dishes', name: 'Dishes', personId: 'alex', rate: 1.5 },
  { id: 'laundry', name: 'Laundry', personId: 'luc', rate: 2.0 },
  { id: 'vacuum', name: 'Vacuum', personId: 'luc', rate: 1.75 },
  { id: 'trash', name: 'Trash & Recycling', personId: 'alex', rate: 1.0 },
  { id: 'bathroom', name: 'Bathroom', personId: 'luc', rate: 2.5 },
  { id: 'yard', name: 'Yard', personId: 'luc', rate: 3.0 },
];

export const completions = [
  { id: 'c1', choreId: 'dishes', personId: 'alex', date: daysAgo(0), count: 2 },
  { id: 'c2', choreId: 'trash', personId: 'alex', date: daysAgo(1), count: 1 },
  { id: 'c3', choreId: 'laundry', personId: 'luc', date: daysAgo(0), count: 1 },
  { id: 'c4', choreId: 'bathroom', personId: 'luc', date: daysAgo(2), count: 1 },
  { id: 'c5', choreId: 'vacuum', personId: 'luc', date: daysAgo(1), count: 1 },
  { id: 'c6', choreId: 'yard', personId: 'luc', date: daysAgo(3), count: 1 },
  { id: 'c7', choreId: 'dishes', personId: 'alex', date: daysAgo(4), count: 2 },
  { id: 'c8', choreId: 'laundry', personId: 'luc', date: daysAgo(4), count: 1 },
  { id: 'c9', choreId: 'vacuum', personId: 'luc', date: daysAgo(5), count: 1 },
  { id: 'c10', choreId: 'trash', personId: 'alex', date: daysAgo(6), count: 1 },
  { id: 'c11', choreId: 'bathroom', personId: 'luc', date: daysAgo(6), count: 1 },
  { id: 'c12', choreId: 'yard', personId: 'luc', date: daysAgo(2), count: 1 },
];

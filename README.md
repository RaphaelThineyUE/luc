# Luc

## App overview
Luc is a chores + allowance tracking app that helps families assign chores, track completion status, and calculate allowance totals over time. It focuses on a simple workflow: define kids, assign chores with values, mark work complete, and review totals and charts to understand progress and payouts.

## Setup

### Install dependencies
```bash
npm install
```

### Run the development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

## Data model and mock data
The app uses a small, mock data model to drive the UI. The typical entities are:

- **Kids**: Each child has an `id`, `name`, and (optionally) an avatar or color used in charts.
- **Chores**: Each chore has an `id`, `title`, `value` (the allowance amount), and a `kidId` to link the chore to a child.
- **Completions**: A completion record ties a `choreId` to a `date` and a `status` (completed or pending).

To update the mock data, locate the mock data module (commonly a `data/` or `mocks/` folder) and edit the arrays for kids, chores, and completions. The UI will update automatically on refresh since the mock data is loaded at runtime.

## Charting and totals logic
Charts are derived from the same mock data. Totals are computed by summing completed chore values by child (and, if applicable, by time period). The general flow is:

1. Filter completions to only those marked complete.
2. Join completions to chores to get each chore’s value and owner.
3. Group by child (and optionally by date range) and sum the values.

These totals feed the charts and the summary cards so the visualizations always reflect the current mock data.

export type Person = {
  id: string;
  name: string;
};

export type Chore = {
  id: string;
  name: string;
};

export type Completion = {
  id: string;
  personId: string;
  choreId: string;
  completedAt: string;
  count?: number;
};

export type AllowanceRule = {
  choreId: string;
  rate: number;
};

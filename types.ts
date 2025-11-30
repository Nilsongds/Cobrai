export enum DebtStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL'
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  description: string;
  date: string; // ISO String
  dueDate?: string; // ISO String
  status: DebtStatus;
  category?: string;
}

export interface DebtAnalysis {
  personName: string;
  amount: number;
  description: string;
  dueDate?: string;
  confidenceScore: number;
  category: string;
}

export interface DashboardStats {
  totalOwed: number;
  totalCollected: number;
  pendingCount: number;
}
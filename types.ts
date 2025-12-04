export enum TransactionType {
  YAPE = 'Yape',
  PLIN = 'Plin',
  BANK_TRANSFER = 'Transferencia',
  PAYMENT = 'Pago Servicio',
  UNKNOWN = 'Otro'
}

export enum TransactionStatus {
  SUCCESS = 'Exitoso',
  PENDING = 'Pendiente',
  FAILED = 'Fallido'
}

export enum Currency {
  PEN = 'S/',
  USD = '$'
}

export interface BankApp {
  id: string;
  name: string;
  packageName?: string; // Simulated package name
  color: string;
  iconType: 'smartphone' | 'bank' | 'wallet';
}

export interface Transaction {
  id: string;
  operationCode?: string;
  amount: number;
  currency: Currency;
  type: TransactionType;
  entity: string; // BCP, Interbank, BBVA, etc.
  senderOrReceiver: string;
  description?: string;
  date: string; // ISO string
  timestamp: number;
  status: TransactionStatus;
  isExpense: boolean;
  originAppId?: string; // ID of the app that generated this (e.g. 'yape')
}

export interface FilterState {
  search: string;
  type: string;
  dateRange: 'all' | 'today' | 'week' | 'month';
}

export interface StatsData {
  income: number;
  expenses: number;
  balance: number;
  byEntity: { name: string; value: number }[];
  dailyTrend: { day: string; amount: number }[];
}
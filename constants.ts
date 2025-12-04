import { Transaction, TransactionType, TransactionStatus, Currency, BankApp } from './types';

export const BANK_APPS: BankApp[] = [
  { id: 'yape', name: 'Yape', packageName: 'com.bcp.innovacxion.yape', color: '#6b21a8', iconType: 'smartphone' },
  { id: 'plin', name: 'Plin', packageName: 'com.plin.app', color: '#0ea5e9', iconType: 'smartphone' },
  { id: 'bcp', name: 'Banca Móvil BCP', packageName: 'com.bcp.bank.bcp', color: '#0033A1', iconType: 'bank' },
  { id: 'interbank', name: 'Interbank APP', packageName: 'pe.com.interbank.mobilebanking', color: '#009a3e', iconType: 'bank' },
  { id: 'bbva', name: 'BBVA Perú', packageName: 'com.bbva.bbvacontinental', color: '#004481', iconType: 'bank' },
  { id: 'scotia', name: 'Scotiabank', packageName: 'pe.com.scotiabank.banca.movil', color: '#ec111a', iconType: 'bank' },
  { id: 'izipay', name: 'IzipayYa', packageName: 'pe.com.interbank.izipayya', color: '#ff0055', iconType: 'wallet' },
  { id: 'agora', name: 'Agora', packageName: 'pe.com.agora', color: '#5C2D91', iconType: 'wallet' },
  { id: 'bn', name: 'Banco de la Nación', packageName: 'pe.bn.bancamovil', color: '#9d1d22', iconType: 'bank' }
];

export const ENTITIES = BANK_APPS.map(app => app.name);

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    operationCode: '123456',
    amount: 15.50,
    currency: Currency.PEN,
    type: TransactionType.YAPE,
    entity: 'Yape',
    originAppId: 'yape',
    senderOrReceiver: 'Juan Pérez',
    description: 'Pago almuerzo',
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 30,
    status: TransactionStatus.SUCCESS,
    isExpense: true
  },
  {
    id: '2',
    operationCode: '987654',
    amount: 120.00,
    currency: Currency.PEN,
    type: TransactionType.PLIN,
    entity: 'Plin',
    originAppId: 'plin',
    senderOrReceiver: 'Maria Lopez',
    description: 'Cuota mensual',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    status: TransactionStatus.SUCCESS,
    isExpense: false
  },
  {
    id: '3',
    operationCode: '555111',
    amount: 500.00,
    currency: Currency.PEN,
    type: TransactionType.BANK_TRANSFER,
    entity: 'Banca Móvil BCP',
    originAppId: 'bcp',
    senderOrReceiver: 'Empresa SAC',
    description: 'Pago de servicios',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    status: TransactionStatus.SUCCESS,
    isExpense: true
  }
];

export const COLORS = {
  primary: '#6b21a8',
  secondary: '#0ea5e9',
  success: '#10b981',
  danger: '#ef4444',
  background: '#f3f4f6',
  card: '#ffffff'
};
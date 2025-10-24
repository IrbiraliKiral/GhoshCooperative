import { AppConfig } from '@/types';

export const appConfig: AppConfig = {
  bankName: 'GCB',
  bankFullName: 'Ghosh Cooperative Bankings',
  contactEmail: 'contact@ghoshbank.coop',
  contactPhone: '+91 1234567890',
  monthlyFee: 100,
  transactionFeePercentage: 1,
  dailyDepositLimit: 10000,
  perTransactionLimit: 5000,
  minCreditScore: 3,
  maxLoansAllowed: 1,
};

export default appConfig;

// Member Types
export interface Member {
  name: string;
  role: string;
  isStaff: boolean;
}

// Service Types
export interface Service {
  title: string;
  description: string;
  detailedDescription?: string;
  icon: string;
}

// Rule Types
export interface Rule {
  title: string;
  description: string;
  important?: boolean;
}

// Form Data Types
export interface ContactFormData {
  email: string;
  phone: string;
  message: string;
}

export interface FormErrors {
  email?: string;
  phone?: string;
  message?: string;
  [key: string]: string | undefined;
}

// Navigation Types
export interface NavLink {
  label: string;
  href: string;
}

// Configuration Types
export interface AppConfig {
  bankName: string;
  bankFullName: string;
  contactEmail: string;
  contactPhone: string;
  monthlyFee: number;
  transactionFeePercentage: number;
  dailyDepositLimit: number;
  perTransactionLimit: number;
  minCreditScore: number;
  maxLoansAllowed: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'BANK';
  subRole?: 'ENTERPRISE' | 'GOVERNMENT' | null | string; // customize according to SubRole enum
  phone: string;
  address?: string;
  organization?: string;
}

export interface Questionnaire {
  id: string;
  // Add other questionnaire fields as needed
}

export enum LoanCategory {
  WATER = 'Water Loans',
  CLIMATE_MITIGATION = 'Climate Mitigation',
  CLIMATE_ADAPTATION = 'Climate Adaptation',
  CIRCULAR_ECONOMY = 'Circular Economy',  
  BIODIVERSITY = 'Biodiversity',
  POLLUTION_PREVENTION = 'Pollution Prevention' 
}

export enum LoanStatus {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  REPAID = 'REPAID',
  DISBURSED = 'DISBURSED',
  CLOSED = 'CLOSED'
}

export interface LoanPayment {
  id: number;
  loan: Loan;
  amountPaid: number;
  paymentDate: string;
}

export interface Loan {
  id: number;
  user: User;
  loanCategory: LoanCategory;
  amount: number;
  durationMonths: number;
  interestRate: number;
  status: LoanStatus;
  amountPending: number;
  questionnaire?: Questionnaire;
  questionnaireScore?: number;
  projectName?: string;
  projectReportPath?: string;
  loanStartDate?: string;
  payments: LoanPayment[];
  loanUUID: string;
  disburseAmount?: number;
  disbursedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisburseRequest {
  disburseAmount: number;
  disbursedAmount: number;
}

export interface PaymentRequest {
  loanId: string;
  amountPaid: number;
}

export interface StatusUpdateRequest {
  status: LoanStatus;
}
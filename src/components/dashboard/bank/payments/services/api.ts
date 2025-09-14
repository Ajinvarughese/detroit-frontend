import axios from 'axios';
import { Loan, DisburseRequest, PaymentRequest, StatusUpdateRequest } from '../types/loan';
import API from '../../../../hooks/API';

const useApi = API();
const API_BASE_URL = useApi.url;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loanApi = {
  // Get all loans
  getLoans: async (): Promise<Loan[]> => {
    const response = await api.get('/loan');
    return response.data;
  },

  // Disburse amount
  disburseAmount: async (loanId: string, disburseData: DisburseRequest): Promise<Loan> => {
    const response = await api.put(`/loan/disbursed/${loanId}`, disburseData);
    return response.data;
  },

  // Update loan status
  updateStatus: async (loanId: string, statusData: StatusUpdateRequest): Promise<Loan> => {
    const response = await api.put(`/loan/status/${loanId}`, statusData);
    return response.data;
  },
};

export const paymentApi = {
  // Add payment
  addPayment: async (paymentData: PaymentRequest): Promise<void> => {
    await api.put('/payment', paymentData);
  },
};

export default api;
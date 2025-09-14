import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Save,
  DollarSign,
  AlertCircle,
  Loader2
} from 'lucide-react';
import API from '../../../hooks/API';

// Types
enum LoanStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  DISBURSED = 'DISBURSED',
  REPAID = 'REPAID',
  REJECTED = 'REJECTED'
}

enum LoanCategory {
  WATER = 'WATER',
  BIODIVERSITY = 'BIODIVERSITY',
  CIRCULAR_ECONOMY = 'CIRCULAR_ECONOMY',
  CLIMATE_ADAPTATION = 'CLIMATE_ADAPTATION',
  CLIMATE_MITIGATION = 'CLIMATE_MITIGATION',
  POLLUTION_PREVENTION = 'POLLUTION_PREVENTION'
}

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface Loan {
  id: number;
  user: User;
  loanCategory: LoanCategory;
  amount: number;
  durationMonths: number;
  interestRate: number;
  status: LoanStatus;
  amountPending: number;
  projectName?: string;
  projectReportPath?: string;
  amountPerYear?: number;
  loanStartDate?: string;
  loanUUID: string;
  disburseAmount?: number;
  disbursedAmount: number;
  createdAt: string;
  updatedAt: string;
  questionnaireScore?: number;
}

const useApi = API();
// API base URL
const API_BASE_URL = useApi.url;

// API services
const loanApi = {
  getLoans: async (): Promise<Loan[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/loan`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loans:', error);
      throw error;
    }
  },
  disburseAmount: async (loanId: string, data: { disburseAmount: number; disbursedAmount: number }) => {
    try {
      console.log(`Disbursing ${data.disburseAmount} for loan ${loanId}`);
      // You may need to create this endpoint on your backend
      const response = await axios.put(`${API_BASE_URL}/loan/disburse`, {
        id: parseInt(loanId),
        disburseAmount: data.disburseAmount,
        disbursedAmount: data.disbursedAmount
      });
      return response.data;
    } catch (error) {
      console.error('Error disbursing amount:', error);
      throw error;
    }
  },
  updateStatus: async (loanId: string, data: { status: LoanStatus }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/loan/status`, {
        id: parseInt(loanId),
        status: data.status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating loan status:', error);
      throw error;
    }
  }
};

const paymentApi = {
  addPayment: async (data: { loanId: string; amountPaid: number }) => {
    try {
      console.log(`Recording payment of ${data.amountPaid} for loan ${data.loanId}`);
      // You may need to create this endpoint on your backend
      console.log({loan: {id: parseInt(data.loanId)}, amountPaid: data.amountPaid});
      const response = await axios.post(`${API_BASE_URL}/loan/payment`, {
        loan: {id: parseInt(data.loanId)},
        amountPaid: data.amountPaid
      });
      return response.data;
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }
};

const Payment = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingDisbursement, setEditingDisbursement] = useState<{ [key: string]: string }>({});
  const [editingPayment, setEditingPayment] = useState<{ [key: string]: string }>({});
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  // Load loans on component mount
  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await loanApi.getLoans();
      // Filter to show only APPROVED and DISBURSED loans
      const filteredLoans = data.filter(loan => 
        loan.status === LoanStatus.APPROVED || loan.status === LoanStatus.DISBURSED
      );
      setLoans(filteredLoans);
    } catch (err) {
      setError('Failed to load loans. Please check if the backend server is running on http://localhost:8080');
      console.error('Error loading loans:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort loans
  const filteredLoans = useMemo(() => {
    let filtered = loans.filter(loan => {
      const matchesSearch = loan.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loan.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          loan.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        
        if (sortConfig.key === 'customerName') {
          aValue = a.user.fullName;
          bValue = b.user.fullName;
        } else {
          aValue = a[sortConfig.key as keyof Loan];
          bValue = b[sortConfig.key as keyof Loan];
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [loans, searchTerm, statusFilter, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleRowExpansion = (loanId: string) => {
    setExpandedRows(current => {
      const newSet = new Set(current);
      if (newSet.has(loanId)) {
        newSet.delete(loanId);
      } else {
        newSet.add(loanId);
      }
      return newSet;
    });
  };

  const handleDisburse = async (loanId: string, disburseAmount: number) => {
    try {
      setProcessingActions(prev => new Set(prev).add(loanId));
      
      const loan = loans.find(l => l.id.toString() === loanId);
      if (!loan) return;

      const newDisbursedAmount = loan.disbursedAmount + disburseAmount;
      
      await loanApi.disburseAmount(loanId, {
        disburseAmount,
        disbursedAmount: newDisbursedAmount
      });

      // Update status to DISBURSED if fully disbursed
      if (newDisbursedAmount >= loan.amount) {
        await loanApi.updateStatus(loanId, { status: LoanStatus.DISBURSED });
      }

      // Reload loans to get updated data from database
      await loadLoans();

      // Clear editing state
      setEditingDisbursement(current => {
        const updated = { ...current };
        delete updated[loanId];
        return updated;
      });

    } catch (err) {
      console.error('Error disbursing amount:', err);
      setError('Failed to disburse amount. Please try again.');
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(loanId);
        return newSet;
      });
    }
  };

  const handlePayment = async (loanId: string, amountPaid: number) => {
    try {
      setProcessingActions(prev => new Set(prev).add(loanId));
      
      const loan = loans.find(l => l.id.toString() === loanId);
      if (!loan) return;

      await paymentApi.addPayment({
        loanId,
        amountPaid
      });

      const newAmountPending = loan.amountPending - amountPaid;
      
      // If fully paid, update status to REPAID
      if (newAmountPending <= 0) {
        await loanApi.updateStatus(loanId, { status: LoanStatus.REPAID });
      }

      // Reload loans to get updated data from database
      await loadLoans();

      // Clear editing state
      setEditingPayment(current => {
        const updated = { ...current };
        delete updated[loanId];
        return updated;
      });

    } catch (err) {
      console.error('Error processing payment:', err);
      setError('Failed to process payment. Please try again.');
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(loanId);
        return newSet;
      });
    }
  };

  // Helper function to get payment amount for a loan
  const getPaymentAmount = (loan: Loan) => {
    return editingPayment[loan.id] || (loan.amountPerYear?.toString() || '');
  };

  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.DISBURSED: return 'bg-green-500/20 text-green-400';
      case LoanStatus.APPROVED: return 'bg-blue-500/20 text-blue-400';
      case LoanStatus.REPAID: return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.DISBURSED: return <CheckCircle className="w-4 h-4" />;
      case LoanStatus.APPROVED: return <Clock className="w-4 h-4" />;
      case LoanStatus.REPAID: return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getLoanCategoryDisplay = (category: string) => {
    switch (category) {
      case "WATER": return 'Water loan';
      case "BIODIVERSITY": return 'Biodiversity Loan';
      case "CIRCULAR_ECONOMY": return 'Circular Economy Loan';
      case "CLIMATE_ADAPTATION": return 'Climate Adaptation Loan';
      case "CLIMATE_MITIGATION": return 'Climate Mitigation Loan';
      case "POLLUTION_PREVENTION": return 'Pollution Prevention Loan';
      default: return category;
    }
  };

  const isFullyDisbursed = (loan: Loan) => {
    return loan.disbursedAmount >= loan.amount;
  };

  const getRemainingToDisburse = (loan: Loan) => {
    return loan.amount - loan.disbursedAmount;
  };

  const getTotalPaid = (loan: Loan) => {
    return loan.amount - loan.amountPending;
  };

  if (loading) {
    return (
      <div style={{marginLeft: "220px"}} className="min-h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading loans...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{marginLeft: "220px"}} className="min-h-screen w-full bg-slate-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Loan Management</h1>
          <p className="text-gray-400">Manage approved and disbursed loans</p>
          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-300"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="APPROVED">Approved</option>
                <option value="DISBURSED">Disbursed</option>
              </select>
            </div>

            <button
              onClick={loadLoans}
              className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Loans Table */}
        <div className="bg-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-300 font-medium w-8"></th>
                  <th className="text-left p-4 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('customerName')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Customer
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-gray-300 font-medium">
                    <button 
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      Loan Amount
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Disbursed</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Pending</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Category</th>
                </tr>
              </thead>
              <tbody>
                {filteredLoans.map((loan) => (
                  <React.Fragment key={loan.id}>
                    <tr 
                      className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
                      onClick={() => toggleRowExpansion(loan.id.toString())}
                    >
                      <td className="p-4">
                        {expandedRows.has(loan.id.toString()) ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">{loan.user.fullName}</div>
                          <div className="text-sm text-gray-400">{loan.user.email}</div>
                          <div className="text-xs text-gray-500">ID: {loan.id}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-white">
                          {formatCurrency(loan.amount)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {loan.interestRate}% APR • {loan.durationMonths} months
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
                          {getStatusIcon(loan.status)}
                          {loan.status}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">
                          {formatCurrency(loan.disbursedAmount)}
                        </div>
                        <div className="text-xs text-gray-400">
                          {loan.amount > 0 ? ((loan.disbursedAmount / loan.amount) * 100).toFixed(1) : 0}%
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">
                          {formatCurrency(loan.amountPending)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-white">{getLoanCategoryDisplay(loan.loanCategory)}</div>
                        {loan.projectName && (
                          <div className="text-xs text-gray-400">{loan.projectName}</div>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {expandedRows.has(loan.id.toString()) && (
                      <tr className="bg-gray-800/20">
                        <td colSpan={7} className="p-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Disbursement Management - Only show if not fully disbursed */}
                            {!isFullyDisbursed(loan) && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-4">Disbursement Management</h3>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Disburse Amount
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      placeholder="Enter amount"
                                      value={editingDisbursement[loan.id] || ''}
                                      onChange={(e) => setEditingDisbursement(current => ({
                                        ...current,
                                        [loan.id]: e.target.value
                                      }))}
                                      className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                      max={getRemainingToDisburse(loan)}
                                    />
                                    <button
                                      onClick={() => {
                                        const amount = parseFloat(editingDisbursement[loan.id]) || 0;
                                        if (amount > 0) {
                                          handleDisburse(loan.id.toString(), amount);
                                        }
                                      }}
                                      disabled={processingActions.has(loan.id.toString())}
                                      className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                      {processingActions.has(loan.id.toString()) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Save className="w-4 h-4" />
                                      )}
                                      Disburse
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Maximum: {formatCurrency(getRemainingToDisburse(loan))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      Already Disbursed
                                    </label>
                                    <div className="text-white font-medium">
                                      {formatCurrency(loan.disbursedAmount)}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      Remaining to Disburse
                                    </label>
                                    <div className="text-white font-medium">
                                      {formatCurrency(getRemainingToDisburse(loan))}
                                    </div>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Disbursement Progress
                                  </label>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${loan.amount > 0 ? (loan.disbursedAmount / loan.amount) * 100 : 0}%`
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {loan.amount > 0 ? ((loan.disbursedAmount / loan.amount) * 100).toFixed(1) : 0}% disbursed
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Payment Management - Only show if fully disbursed */}
                            {isFullyDisbursed(loan) && loan.amountPending > 0 && (
                              <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-4">Payment Management</h3>
                                
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Record Payment
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="number"
                                      placeholder="Enter payment amount"
                                      value={getPaymentAmount(loan)}
                                      onChange={(e) => 
                                        setEditingPayment(current => ({
                                          ...current,
                                          [loan.id]: e.target.value
                                        }))
                                      }
                                      className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                      max={loan.amountPending}
                                    />
                                    <button
                                      onClick={() => {
                                        const amount = parseFloat(getPaymentAmount(loan)) || 0;
                                        if (amount > 0) {
                                          handlePayment(loan.id.toString(), amount);
                                        }
                                      }}
                                      disabled={processingActions.has(loan.id.toString())}
                                      className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                                    >
                                      {processingActions.has(loan.id.toString()) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <DollarSign className="w-4 h-4" />
                                      )}
                                      Record
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    Maximum: {formatCurrency(loan.amountPending)}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      Total Payments
                                    </label>
                                    <div className="text-white font-medium">
                                      {formatCurrency(getTotalPaid(loan))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                      Amount Pending
                                    </label>
                                    <div className="text-white font-medium">
                                      {formatCurrency(loan.amountPending)}
                                    </div>
                                  </div>
                                </div>

                                {/* Payment Progress Bar */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Repayment Progress
                                  </label>
                                  <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${loan.amount > 0 ? (getTotalPaid(loan) / loan.amount) * 100 : 0}%`
                                      }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {loan.amount > 0 ? ((getTotalPaid(loan) / loan.amount) * 100).toFixed(1) : 0}% repaid
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Loan Details */}
                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold text-white mb-4">Loan Details</h3>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Loan Amount
                                  </label>
                                  <div className="text-white font-medium">
                                    {formatCurrency(loan.amount)}
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Interest Rate
                                  </label>
                                  <div className="text-white font-medium">
                                    {loan.interestRate}% APR
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Duration
                                  </label>
                                  <div className="text-white font-medium">
                                    {loan.durationMonths} months
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Category
                                  </label>
                                  <div className="text-white font-medium">
                                    {getLoanCategoryDisplay(loan.loanCategory)}
                                  </div>
                                </div>
                              </div>

                              {loan.disburseAmount && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Previous Disburse Amount
                                  </label>
                                  <div className="text-white font-medium">
                                    {formatCurrency(loan.disburseAmount)}
                                  </div>
                                </div>
                              )}

                              {loan.questionnaireScore && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Credit Score
                                  </label>
                                  <div className="text-white font-medium">
                                    {loan.questionnaireScore}
                                  </div>
                                </div>
                              )}

                              {loan.loanStartDate && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Start Date
                                  </label>
                                  <div className="text-white font-medium">
                                    {new Date(loan.loanStartDate).toLocaleDateString()}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-6 p-4 bg-slate-800 rounded-lg">
          <div className="text-sm text-gray-400">
            Showing {filteredLoans.length} loans
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;



// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { 
//   Search, 
//   Filter, 
//   CheckCircle, 
//   Clock, 
//   ArrowUpDown,
//   ChevronDown,
//   ChevronRight,
//   Save,
//   DollarSign,
//   AlertCircle,
//   Loader2
// } from 'lucide-react';
// import { c } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';

// // Types
// enum LoanStatus {
//   PENDING = 'PENDING',
//   APPROVED = 'APPROVED',
//   DISBURSED = 'DISBURSED',
//   REPAID = 'REPAID',
//   REJECTED = 'REJECTED'
// }

// enum LoanCategory {
//   WATER = 'WATER',
//   BIODIVERSITY = 'BIODIVERSITY',
//   CIRCULAR_ECONOMY = 'CIRCULAR_ECONOMY',
//   CLIMATE_ADAPTATION = 'CLIMATE_ADAPTATION',
//   CLIMATE_MITIGATION = 'CLIMATE_MITIGATION',
//   POLLUTION_PREVENTION = 'POLLUTION_PREVENTION'
// }

// interface User {
//   id: number;
//   fullName: string;
//   email: string;
// }

// interface Loan {
//   id: number;
//   user: User;
//   loanCategory: LoanCategory;
//   amount: number;
//   durationMonths: number;
//   interestRate: number;
//   status: LoanStatus;
//   amountPending: number;
//   projectName?: string;
//   projectReportPath?: string;
//   amountPerYear?: number;
//   loanStartDate?: string;
//   loanUUID: string;
//   disburseAmount?: number;
//   disbursedAmount: number;
//   createdAt: string;
//   updatedAt: string;
//   questionnaireScore?: number;
// }

// // API base URL
// const API_BASE_URL = 'http://localhost:8080/api';

// // API services
// const loanApi = {
//   getLoans: async (): Promise<Loan[]> => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/loan`);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching loans:', error);
//       throw error;
//     }
//   },
//   disburseAmount: async (loanId: string, data: { disburseAmount: number; disbursedAmount: number }) => {
//     try {
//       console.log(`Disbursing ${data.disburseAmount} for loan ${loanId}`);
//       // You may need to create this endpoint on your backend
//       const response = await axios.put(`${API_BASE_URL}/loan/disburse`, {
//         id: parseInt(loanId),
//         disburseAmount: data.disburseAmount,
//         disbursedAmount: data.disbursedAmount
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error disbursing amount:', error);
//       throw error;
//     }
//   },
//   updateStatus: async (loanId: string, data: { status: LoanStatus }) => {
//     try {
//       const response = await axios.put(`${API_BASE_URL}/loan/status`, {
//         id: parseInt(loanId),
//         status: data.status
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error updating loan status:', error);
//       throw error;
//     }
//   }
// };

// const paymentApi = {
//   addPayment: async (data: { loanId: string; amountPaid: number }) => {
//     try {
//       console.log(`Recording payment of ${data.amountPaid} for loan ${data.loanId}`);
//       // You may need to create this endpoint on your backend
//       const response = await axios.post(`${API_BASE_URL}/loan/payment`, {
//         loan: {id: parseInt(data.loanId)},
//         amountPaid: data.amountPaid
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error adding payment:', error);
//       throw error;
//     }
//   }
// };

// const Payment = () => {
//   const [loans, setLoans] = useState<Loan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [editingDisbursement, setEditingDisbursement] = useState<{ [key: string]: string }>({});
//   const [editingPayment, setEditingPayment] = useState<{ [key: string]: string }>({});
//   const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

//   // Load loans on component mount
//   useEffect(() => {
//     loadLoans();
//   }, []);

//   const loadLoans = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await loanApi.getLoans();
//       // Filter to show only APPROVED and DISBURSED loans
//       const filteredLoans = data.filter(loan => 
//         loan.status === LoanStatus.APPROVED || loan.status === LoanStatus.DISBURSED
//       );
//       setLoans(filteredLoans);
//     } catch (err) {
//       setError('Failed to load loans. Please check if the backend server is running on http://localhost:8080');
//       console.error('Error loading loans:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter and sort loans
//   const filteredLoans = useMemo(() => {
//     let filtered = loans.filter(loan => {
//       const matchesSearch = loan.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           loan.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           loan.id.toString().toLowerCase().includes(searchTerm.toLowerCase());
      
//       const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
      
//       return matchesSearch && matchesStatus;
//     });

//     if (sortConfig) {
//       filtered.sort((a, b) => {
//         let aValue: any;
//         let bValue: any;
        
//         if (sortConfig.key === 'customerName') {
//           aValue = a.user.fullName;
//           bValue = b.user.fullName;
//         } else {
//           aValue = a[sortConfig.key as keyof Loan];
//           bValue = b[sortConfig.key as keyof Loan];
//         }
        
//         if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
//         if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
//         return 0;
//       });
//     }

//     return filtered;
//   }, [loans, searchTerm, statusFilter, sortConfig]);

//   const handleSort = (key: string) => {
//     setSortConfig(current => ({
//       key,
//       direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
//     }));
//   };

//   const toggleRowExpansion = (loanId: string) => {
//     setExpandedRows(current => {
//       const newSet = new Set(current);
//       if (newSet.has(loanId)) {
//         newSet.delete(loanId);
//       } else {
//         newSet.add(loanId);
//       }
//       return newSet;
//     });
//   };

//   const handleDisburse = async (loanId: string, disburseAmount: number) => {
//     try {
//       setProcessingActions(prev => new Set(prev).add(loanId));
      
//       const loan = loans.find(l => l.id.toString() === loanId);
//       if (!loan) return;

//       const newDisbursedAmount = loan.disbursedAmount + disburseAmount;
      
//       await loanApi.disburseAmount(loanId, {
//         disburseAmount,
//         disbursedAmount: newDisbursedAmount
//       });

//       // Update status to DISBURSED if fully disbursed
//       if (newDisbursedAmount >= loan.amount) {
//         await loanApi.updateStatus(loanId, { status: LoanStatus.DISBURSED });
//       }

//       // Reload loans to get updated data from database
//       await loadLoans();

//       // Clear editing state
//       setEditingDisbursement(current => {
//         const updated = { ...current };
//         delete updated[loanId];
//         return updated;
//       });

//     } catch (err) {
//       console.error('Error disbursing amount:', err);
//       setError('Failed to disburse amount. Please try again.');
//     } finally {
//       setProcessingActions(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(loanId);
//         return newSet;
//       });
//     }
//   };

//   const handlePayment = async (loanId: string, amountPaid: number) => {
//     try {
//       setProcessingActions(prev => new Set(prev).add(loanId));
      
//       const loan = loans.find(l => l.id.toString() === loanId);
//       if (!loan) return;

//       await paymentApi.addPayment({
//         loanId,
//         amountPaid
//       });

//       const newAmountPending = loan.amountPending - amountPaid;
      
//       // If fully paid, update status to REPAID
//       if (newAmountPending <= 0) {
//         await loanApi.updateStatus(loanId, { status: LoanStatus.REPAID });
//       }

//       // Reload loans to get updated data from database
//       await loadLoans();

//       // Clear editing state
//       setEditingPayment(current => {
//         const updated = { ...current };
//         delete updated[loanId];
//         return updated;
//       });

//     } catch (err) {
//       console.error('Error processing payment:', err);
//       setError('Failed to process payment. Please try again.');
//     } finally {
//       setProcessingActions(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(loanId);
//         return newSet;
//       });
//     }
//   };

//   const getStatusColor = (status: LoanStatus) => {
//     switch (status) {
//       case LoanStatus.DISBURSED: return 'bg-green-500/20 text-green-400';
//       case LoanStatus.APPROVED: return 'bg-blue-500/20 text-blue-400';
//       case LoanStatus.REPAID: return 'bg-purple-500/20 text-purple-400';
//       default: return 'bg-gray-500/20 text-gray-400';
//     }
//   };

//   const getStatusIcon = (status: LoanStatus) => {
//     switch (status) {
//       case LoanStatus.DISBURSED: return <CheckCircle className="w-4 h-4" />;
//       case LoanStatus.APPROVED: return <Clock className="w-4 h-4" />;
//       case LoanStatus.REPAID: return <CheckCircle className="w-4 h-4" />;
//       default: return <Clock className="w-4 h-4" />;
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(amount);
//   };

//   const getLoanCategoryDisplay = (category: string) => {
//     switch (category) {
//       case "WATER": return 'Water loan';
//       case "BIODIVERSITY": return 'Biodiversity Loan';
//       case "CIRCULAR_ECONOMY": return 'Circular Economy Loan';
//       case "CLIMATE_ADAPTATION": return 'Climate Adaptation Loan';
//       case "CLIMATE_MITIGATION": return 'Climate Mitigation Loan';
//       case "POLLUTION_PREVENTION": return 'Pollution Prevention Loan';
//       default: return category;
//     }
//   };

//   const isFullyDisbursed = (loan: Loan) => {
//     return loan.disbursedAmount >= loan.amount;
//   };

//   const getRemainingToDisburse = (loan: Loan) => {
//     return loan.amount - loan.disbursedAmount;
//   };

//   const getTotalPaid = (loan: Loan) => {
//     return loan.amount - loan.amountPending;
//   };

//   if (loading) {
//     return (
//       <div style={{marginLeft: "220px"}} className="min-h-screen w-full flex items-center justify-center bg-slate-900">
//         <div className="flex items-center gap-3 text-white">
//           <Loader2 className="w-6 h-6 animate-spin" />
//           <span>Loading loans...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{marginLeft: "220px"}} className="min-h-screen w-full bg-slate-900">
//       <div className="container mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">Loan Management</h1>
//           <p className="text-gray-400">Manage approved and disbursed loans</p>
//           {error && (
//             <div className="mt-4 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center gap-2">
//               <AlertCircle className="w-5 h-5 text-red-400" />
//               <span className="text-red-400">{error}</span>
//               <button 
//                 onClick={() => setError(null)}
//                 className="ml-auto text-red-400 hover:text-red-300"
//               >
//                 ×
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Filters and Search */}
//         <div className="mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search loans..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-10 pr-4 py-2 bg-slate-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
//               />
//             </div>
            
//             <div className="relative">
//               <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value)}
//                 className="pl-10 pr-8 py-2 bg-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
//               >
//                 <option value="all">All Status</option>
//                 <option value="APPROVED">Approved</option>
//                 <option value="DISBURSED">Disbursed</option>
//               </select>
//             </div>

//             <button
//               onClick={loadLoans}
//               className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors"
//             >
//               Refresh
//             </button>
//           </div>
//         </div>

//         {/* Loans Table */}
//         <div className="bg-slate-800 rounded-xl overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-gray-700">
//                   <th className="text-left p-4 text-gray-300 font-medium w-8"></th>
//                   <th className="text-left p-4 text-gray-300 font-medium">
//                     <button 
//                       onClick={() => handleSort('customerName')}
//                       className="flex items-center gap-2 hover:text-white transition-colors"
//                     >
//                       Customer
//                       <ArrowUpDown className="w-4 h-4" />
//                     </button>
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-medium">
//                     <button 
//                       onClick={() => handleSort('amount')}
//                       className="flex items-center gap-2 hover:text-white transition-colors"
//                     >
//                       Loan Amount
//                       <ArrowUpDown className="w-4 h-4" />
//                     </button>
//                   </th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Status</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Disbursed</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Pending</th>
//                   <th className="text-left p-4 text-gray-300 font-medium">Category</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredLoans.map((loan) => (
//                   <React.Fragment key={loan.id}>
//                     <tr 
//                       className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors cursor-pointer"
//                       onClick={() => toggleRowExpansion(loan.id.toString())}
//                     >
//                       <td className="p-4">
//                         {expandedRows.has(loan.id.toString()) ? (
//                           <ChevronDown className="w-4 h-4 text-gray-400" />
//                         ) : (
//                           <ChevronRight className="w-4 h-4 text-gray-400" />
//                         )}
//                       </td>
//                       <td className="p-4">
//                         <div>
//                           <div className="font-medium text-white">{loan.user.fullName}</div>
//                           <div className="text-sm text-gray-400">{loan.user.email}</div>
//                           <div className="text-xs text-gray-500">ID: {loan.id}</div>
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="font-medium text-white">
//                           {formatCurrency(loan.amount)}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {loan.interestRate}% APR • {loan.durationMonths} months
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(loan.status)}`}>
//                           {getStatusIcon(loan.status)}
//                           {loan.status}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="text-white font-medium">
//                           {formatCurrency(loan.disbursedAmount)}
//                         </div>
//                         <div className="text-xs text-gray-400">
//                           {loan.amount > 0 ? ((loan.disbursedAmount / loan.amount) * 100).toFixed(1) : 0}%
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="text-white font-medium">
//                           {formatCurrency(loan.amountPending)}
//                         </div>
//                       </td>
//                       <td className="p-4">
//                         <div className="text-white">{getLoanCategoryDisplay(loan.loanCategory)}</div>
//                         {loan.projectName && (
//                           <div className="text-xs text-gray-400">{loan.projectName}</div>
//                         )}
//                       </td>
//                     </tr>
                    
//                     {/* Expanded Row */}
//                     {expandedRows.has(loan.id.toString()) && (
//                       <tr className="bg-gray-800/20">
//                         <td colSpan={7} className="p-6">
//                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                             {/* Disbursement Management - Only show if not fully disbursed */}
//                             {!isFullyDisbursed(loan) && (
//                               <div className="space-y-4">
//                                 <h3 className="text-lg font-semibold text-white mb-4">Disbursement Management</h3>
                                
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                                     Disburse Amount
//                                   </label>
//                                   <div className="flex gap-2">
//                                     <input
//                                       type="number"
//                                       placeholder="Enter amount"
//                                       value={editingDisbursement[loan.id] || ''}
//                                       onChange={(e) => setEditingDisbursement(current => ({
//                                         ...current,
//                                         [loan.id]: e.target.value
//                                       }))}
//                                       className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                                       max={getRemainingToDisburse(loan)}
//                                     />
//                                     <button
//                                       onClick={() => {
//                                         const amount = parseFloat(editingDisbursement[loan.id]) || 0;
//                                         if (amount > 0) {
//                                           handleDisburse(loan.id.toString(), amount);
//                                         }
//                                       }}
//                                       disabled={processingActions.has(loan.id.toString())}
//                                       className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
//                                     >
//                                       {processingActions.has(loan.id.toString()) ? (
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                       ) : (
//                                         <Save className="w-4 h-4" />
//                                       )}
//                                       Disburse
//                                     </button>
//                                   </div>
//                                   <div className="text-xs text-gray-400 mt-1">
//                                     Maximum: {formatCurrency(getRemainingToDisburse(loan))}
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">
//                                       Already Disbursed
//                                     </label>
//                                     <div className="text-white font-medium">
//                                       {formatCurrency(loan.disbursedAmount)}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">
//                                       Remaining to Disburse
//                                     </label>
//                                     <div className="text-white font-medium">
//                                       {formatCurrency(getRemainingToDisburse(loan))}
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Progress Bar */}
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                                     Disbursement Progress
//                                   </label>
//                                   <div className="w-full bg-gray-700 rounded-full h-2">
//                                     <div 
//                                       className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                                       style={{ 
//                                         width: `${loan.amount > 0 ? (loan.disbursedAmount / loan.amount) * 100 : 0}%`
//                                       }}
//                                     ></div>
//                                   </div>
//                                   <div className="text-xs text-gray-400 mt-1">
//                                     {loan.amount > 0 ? ((loan.disbursedAmount / loan.amount) * 100).toFixed(1) : 0}% disbursed
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Payment Management - Only show if fully disbursed */}
//                             {isFullyDisbursed(loan) && loan.amountPending > 0 && (
//                               <div className="space-y-4">
//                                 <h3 className="text-lg font-semibold text-white mb-4">Payment Management</h3>
                                
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                                     Record Payment
//                                   </label>
//                                   <div className="flex gap-2">
//                                     <input
//                                       type="number"
//                                       placeholder="Enter payment amount"
//                                       value={editingPayment[loan.id] || loan.amountPerYear}
//                                       onChange={(e) => 
//                                         setEditingPayment(current => ({
//                                           ...current,
//                                           [loan.id]: e.target.value
//                                         }))
//                                       }
//                                       className="flex-1 px-3 py-2 bg-slate-900 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
//                                       max={loan.amountPending}
//                                     />
//                                     <button
//                                       onClick={() => {
//                                         if(editingPayment[loan.id] === undefined) {
//                                           console.log('here');
//                                           setEditingPayment(current => ({
//                                             ...current,
//                                             [loan.id]: loan.amountPerYear
//                                           }))
//                                         }
//                                         console.log(editingPayment[loan.id]);
//                                         const amount = parseFloat(editingPayment[loan.id]) || 0;
//                                         if (amount > 0) {
//                                           handlePayment(loan.id.toString(), amount);
//                                         }
//                                       }}
//                                       disabled={processingActions.has(loan.id.toString())}
//                                       className="px-4 py-2 bg-green-500 text-slate-900 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
//                                     >
//                                       {processingActions.has(loan.id.toString()) ? (
//                                         <Loader2 className="w-4 h-4 animate-spin" />
//                                       ) : (
//                                         <DollarSign className="w-4 h-4" />
//                                       )}
//                                       Record
//                                     </button>
//                                   </div>
//                                   <div className="text-xs text-gray-400 mt-1">
//                                     Maximum: {formatCurrency(loan.amountPending)}
//                                   </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">
//                                       Total Payments
//                                     </label>
//                                     <div className="text-white font-medium">
//                                       {formatCurrency(getTotalPaid(loan))}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <label className="block text-sm font-medium text-gray-300 mb-1">
//                                       Amount Pending
//                                     </label>
//                                     <div className="text-white font-medium">
//                                       {formatCurrency(loan.amountPending)}
//                                     </div>
//                                   </div>
//                                 </div>

//                                 {/* Payment Progress Bar */}
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-2">
//                                     Repayment Progress
//                                   </label>
//                                   <div className="w-full bg-gray-700 rounded-full h-2">
//                                     <div 
//                                       className="bg-green-500 h-2 rounded-full transition-all duration-300"
//                                       style={{ 
//                                         width: `${loan.amount > 0 ? (getTotalPaid(loan) / loan.amount) * 100 : 0}%`
//                                       }}
//                                     ></div>
//                                   </div>
//                                   <div className="text-xs text-gray-400 mt-1">
//                                     {loan.amount > 0 ? ((getTotalPaid(loan) / loan.amount) * 100).toFixed(1) : 0}% repaid
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Loan Details */}
//                             <div className="space-y-4">
//                               <h3 className="text-lg font-semibold text-white mb-4">Loan Details</h3>
                              
//                               <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Loan Amount
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {formatCurrency(loan.amount)}
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Interest Rate
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {loan.interestRate}% APR
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Duration
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {loan.durationMonths} months
//                                   </div>
//                                 </div>
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Category
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {getLoanCategoryDisplay(loan.loanCategory)}
//                                   </div>
//                                 </div>
//                               </div>

//                               {loan.disburseAmount && (
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Previous Disburse Amount
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {formatCurrency(loan.disburseAmount)}
//                                   </div>
//                                 </div>
//                               )}

//                               {loan.questionnaireScore && (
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Credit Score
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {loan.questionnaireScore}
//                                   </div>
//                                 </div>
//                               )}

//                               {loan.loanStartDate && (
//                                 <div>
//                                   <label className="block text-sm font-medium text-gray-300 mb-1">
//                                     Start Date
//                                   </label>
//                                   <div className="text-white font-medium">
//                                     {new Date(loan.loanStartDate).toLocaleDateString()}
//                                   </div>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     )}
//                   </React.Fragment>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Summary Footer */}
//         <div className="mt-6 p-4 bg-slate-800 rounded-lg">
//           <div className="text-sm text-gray-400">
//             Showing {filteredLoans.length} loans
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Payment;
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { formattedDate, monthsToYears } from '../../../hooks/CurrentDate';
import { Button, TextField, Typography, Chip } from '@mui/material';
import { ArrowDropDown, ArrowDropUp, PictureAsPdf, Remove } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import API from '../../../hooks/API';

const useApi = API();
const actionableStatus = ["REQUESTED", "PENDING"];
const hiddenStatuses = ["CREATED", "CLOSED"];

const statusColors = {
  PENDING: "warning",
  REQUESTED: "warning",
  APPROVED: "success",
  REJECTED: "error",
  DISBURSED: "secondary",
  REPAID: "info"
};

const LoansTable = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [loans, setLoans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        const res = await axios.get(useApi.url+"/loan");
        const priority = {
          CREATED: 0,
          CLOSED: 1,
          REPAID: 2,
          REJECTED: 3,
          DISBURSED: 4,
          APPROVED: 5,
          PENDING: 6,
          REQUESTED: 7,
        };
        const sorted = res.data
          .filter(loan => !hiddenStatuses.includes(loan.status))
          .sort((a, b) => (priority[b.status] ?? 999) - (priority[a.status] ?? 999));
        setLoans(sorted);
      } catch (error) {
        console.error("Failed to fetch loan applications:", error);
      }
    };
    fetchAllLoans();
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleChange = (id, field, value) => {
    setLoans(prev =>
      prev.map(loan => loan.id === id ? { ...loan, [field]: Number(value) } : loan)
    );
  };

  const handleDecision = async (id, loan, decision) => {
    if (loan.amount == null || loan.durationMonths == null) {
      alert("No empty fields allowed!");
      return;
    }
    try {
      loan.status = decision;
      const res = await axios.put(useApi.url+"/loan/updateRequest", loan);
      setLoans(prev =>
        prev.map(l => l.id === id ? { ...l, status: res.data.status } : l)
      );
    } catch (error) {
      console.error("Failed to update loan:", error);
    } finally {
      setExpandedRow(null);
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const term = searchTerm.toLowerCase();
    return (
      loan?.user?.id?.toString().includes(term) ||
      loan?.user?.fullName?.toLowerCase().includes(term) ||
      formattedDate(loan?.updatedAt)?.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ width: "100%", marginLeft: "220px" }} className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Loan Applications</h2>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by User ID, Name or Date"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#9ca3af', mr: 1 }} />,
            style: { backgroundColor: "#1f2937", color: "white", borderRadius: 8 }
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.map((loan) => (
              <React.Fragment key={loan?.id}>
                <tr
                  className={`hover:bg-gray-700 ${!actionableStatus.includes(loan?.status) ? "opacity-60" : ""} bg-gray-800 cursor-pointer transition`}
                  onClick={() => actionableStatus.includes(loan?.status) && toggleRow(loan.id)}
                >
                  <td className="px-4 py-3">{loan?.user.id}</td>
                  <td className="px-4 py-3">{loan?.user.fullName}</td>
                  <td className="px-4 py-3">{formattedDate(loan?.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <Chip
                      label={loan?.status}
                      color={statusColors[loan?.status] || "default"}
                      size="small"
                    />
                  </td>
                  <td className="px-4 py-3">{loan?.amount || '—'}</td>
                  <td className="px-4 py-3 text-green-400">
                    {!actionableStatus.includes(loan?.status) ? (
                      <Remove sx={{ opacity: 0.8 }} />
                    ) : (
                      expandedRow === loan.id ? <ArrowDropUp /> : <ArrowDropDown />
                    )}
                  </td>
                </tr>

                {expandedRow === loan?.id && actionableStatus.includes(loan?.status) && (
                  <tr className="bg-gray-700">
                    <td colSpan="6" className="p-4 border-t border-gray-700">
                      <div className="flex flex-col gap-3 space-y-3">
                        <p>
                          <strong>Eligibility:</strong>{' '}
                          {loan.questionnaireScore >= 70 ? (
                            <span className="text-green-400">Eligible</span>
                          ) : (
                            <span className="text-red-400">Not Eligible</span>
                          )}
                        </p>
                        <p><strong>Score:</strong> {loan?.questionnaireScore}%</p>
                        <p>
                          <strong>Documents:</strong>{' '}
                          {loan?.projectReportPath && (
                            <Button variant="outlined">
                              <a href={loan.projectReportPath} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                                <PictureAsPdf color="error" sx={{ mr: 1 }} />
                                <Typography variant="body2">View project Report</Typography>
                              </a>
                            </Button>
                          )}
                        </p>

                        <div className="flex gap-4 flex-wrap items-center">
                          <div>
                            <label className="block text-sm mb-1">Loan Amount</label>
                            <input
                              type="number"
                              className="bg-gray-800 text-white p-2 rounded w-40"
                              value={loan?.amount}
                              onChange={(e) => handleChange(loan.id, 'amount', e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="block text-sm mb-1">Duration Months</label>
                            <input
                              type="number"
                              className="bg-gray-800 text-white p-2 rounded w-40"
                              value={loan?.durationMonths}
                              onChange={(e) => handleChange(loan.id, 'durationMonths', e.target.value)}
                            />
                            <p>{monthsToYears(loan?.durationMonths)}</p>
                          </div>
                        </div>

                        <div className="flex gap-5">
                          <button
                            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => handleDecision(loan?.id, loan, 'REJECTED')}
                          >
                            Reject
                          </button>
                          <button
                            className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            onClick={() => handleDecision(loan?.id, loan, 'APPROVED')}
                          >
                            Approve
                          </button>
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
  );
};

export default LoansTable;

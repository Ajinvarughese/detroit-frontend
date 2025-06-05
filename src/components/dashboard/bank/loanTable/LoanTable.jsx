import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { formattedDate, monthsToYears } from '../../../hooks/CurrentDate';
import { Button, Typography } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

const loanApplications = [
  {
    id: 1,
    userId: 'U001',
    name: 'John Doe',
    date: '2025-05-24',
    status: 'Pending',
    score: 82,
    eligible: true,
    reason: 'Good credit and income history',
    documents: ['income-proof.pdf'],
    amount: '',
    interest: ''
  },
  {
    id: 2,
    userId: 'U002',
    name: 'Jane Smith',
    date: '2025-05-23',
    status: 'Pending',
    score: 55,
    eligible: false,
    reason: 'Low credit score',
    documents: ['bank-statement.pdf'],
    amount: '',
    interest: ''
  }
];

const LoansTable = () => {

    const [expandedRow, setExpandedRow] = useState(null);
    const [loans, setLoans] = useState(null);


    useEffect(() => {
        const fetchAllLoans = async () => {
            try {
                const loanRes = await axios.get("http://localhost:8080/api/loan");
                const sortedLoans = loanRes.data.sort((a, b) => {
                    // Move 'REJECTED' status to the end
                    if (a.status === 'REJECTED' && b.status !== 'REJECTED') return 1;
                    if (a.status !== 'REJECTED' && b.status === 'REJECTED') return -1;
                    return 0; // Keep the order for other statuses
                });
                setLoans(sortedLoans);
            } catch (error) {
                console.error("Failed to fetch loan applications:", error);
            }
        }
        fetchAllLoans();
    }, []);

    const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
    };

    const handleChange = (id, field, value) => {
        setLoans((prev) =>
            prev.map((loan) =>
            loan.id === id ? { ...loan, [field]: Number(value) } : loan
            )
        );
    };

    const handleDecision = async (id, loan, decision) => {
        if(loan.interestRate.length === null || loan.amount === null || loan.durationMonths === null) {
            alert("No empty fields allowed!");
        }
        if(decision === "APPROVED") {
            try {
                const loanRes = await axios.put("http://localhost:8080/api/loan/updateRequest", loan, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setLoans((prev) =>
                    prev.map((loan) =>
                    loan.id === id ? { ...loan, status: loanRes.data.status } : loan
                    )
                );
            } catch (error){
                console.error("Failed to fetch loan applications:", error);
            } finally {
                setExpandedRow(null);
            }
        } else {
            try {
                loan.status = "REJECTED";
                const loanRes = await axios.put("http://localhost:8080/api/loan/updateRequest", loan, {
                    headers: { 'Content-Type': 'application/json' }
                });
                setLoans((prev) =>
                    prev.map((loan) =>
                    loan.id === id ? { ...loan, status: loanRes.data.status } : loan
                    )
                );
            } catch (error){
                console.error("Failed to fetch loan applications:", error);
            } finally {
                setExpandedRow(null);
            }
        }
    };

    return (
        <div style={{width:"100%", marginLeft: "220px"}} className="p-8 bg-gray-900 min-h-screen text-white">
            <h2 className="text-2xl font-semibold mb-6">Loan Applications</h2>
            <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-700 text-gray-300">
                <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Interest</th>
                    <th className="px-4 py-3">Action</th>
                </tr>
                </thead>
                <tbody>
                {loans?.map((loan) => (
                    <React.Fragment key={loan?.id}>
                    <tr

                        className={`hover:bg-gray-700 ${loan?.status === "REJECTED" ? "opacity-60" : ""} bg-gray-800 cursor-pointer transition`}
                        onClick={() => toggleRow(loan.id)}
                    >
                        <td className="px-4 py-3">{loan?.user.id}</td>
                        <td className="px-4 py-3">{loan?.user.fullName}</td>
                        <td className="px-4 py-3">{formattedDate(loan?.updatedAt)}</td>
                        <td className={`px-4 py-3 ${loan?.status === 'APPROVED' ? 'text-[#4ade80]' : loan?.status === 'DISBURSED' ? 'text-[#9D00FF]' : loan?.status === 'REJECTED' ? 'text-red-500' : loan?.status === "CLOSED" ? 'text-gray          -500' : 'text-yellow-500'}`}>{loan?.status}</td>
                        <td className="px-4 py-3">{loan?.amount || '—'}</td>
                        <td className="px-4 py-3">{loan?.interestRate || '—'}</td>
                        <td className="px-4 py-3 text-blue-400 underline">Expand</td>
                    </tr>

                    {expandedRow === loan?.id && (
                        <tr className="bg-gray-700">
                        <td colSpan="7" className="p-4 border-t border-gray-700">
                            <div className=" flex flex-col gap-3 space-y-3">
                                <p>
                                    <strong>Eligibility:</strong>{' '}
                                    {loan.questionnaireScore >= 70 ? (
                                    <span className="text-green-400">Eligible</span>
                                    ) : (
                                    <span className="text-red-400">Not Eligible</span>
                                    )}
                                </p>
                                <p>
                                    <strong>Score:</strong> {loan?.questionnaireScore}%
                                </p>
                                <p>
                                    <strong>Documents:</strong>{' '}
                                    {loan?.projectReportPath && (
                                        <Button variant="outlined">
                                            <a href={loan.projectReportPath} target="_blank" style={{ display: 'flex', alignItems: 'center' }} rel="noopener noreferrer">
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
                                        onChange={(e) =>
                                            handleChange(loan.id, 'amount', e.target.value)
                                        }
                                        />
                                        <p style={{visibility: 'hidden'}}>hidden</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Interest Rate (%)</label>
                                        <input
                                        type="number"
                                        className="bg-gray-800 text-white p-2 rounded w-40"
                                        value={loan?.interestRate}
                                        onChange={(e) =>
                                            handleChange(loan.id, 'interestRate', e.target.value)
                                        }
                                        />
                                        <p style={{visibility: 'hidden'}}>hidden</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Duration Months</label>
                                        <input
                                        type="number"
                                        className="bg-gray-800 text-white p-2 rounded w-40"
                                        value={loan?.durationMonths}
                                        onChange={(e) =>
                                            handleChange(loan?.id, 'durationMonths', e.target.value)
                                        }
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

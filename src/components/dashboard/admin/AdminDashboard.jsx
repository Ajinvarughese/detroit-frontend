// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import AdminSidebar from './AdminSidebar';
import axios from 'axios';
import API from '../../hooks/API';
import dayjs from 'dayjs';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);

const useApi = API();
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminDashboard = () => {
  const [loanStats, setLoanStats] = useState({
    created: 0,
    approved: 0,
    rejected: 0,
  });

  const [turnoverData, setTurnoverData] = useState(null);

  const [feedback, setFeedback] = useState([
    { id: 1, name: 'John Doe', message: 'Application stuck at verification', reply: '' },
    { id: 2, name: 'Jane Smith', message: 'Unable to upload documents', reply: '' },
  ]);
  const [currentReply, setCurrentReply] = useState({});

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await axios.get(useApi.url + "/loan");
        const loans = res.data;

        // ---- Stats ----
        const rejectedStatuses = ["REJECTED", "CLOSED"];
        const approvedStatuses = ["APPROVED", "DISBURSED", "REPAID"];
        const rejected = loans.filter(l => rejectedStatuses.includes(l.status)).length;
        const approved = loans.filter(l => approvedStatuses.includes(l.status)).length;
        const created = loans.length;
        setLoanStats({ created, approved, rejected });

        // ---- Graph data ----
        const counts = Array(12).fill(0);
        loans.forEach(loan => {
          if (loan.createdAt) {
            const month = dayjs(loan.createdAt).month(); // 0-11
            counts[month] += 1;
          }
        });

        const currentMonth = new Date().getMonth();
        const maskedData = counts.map((val, i) => (i <= currentMonth ? val : null));

        setTurnoverData({
          labels: monthNames,
          datasets: [
            {
              label: "Loan Applications",
              data: maskedData,
              fill: true,
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
                gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
                return gradient;
              },
              borderColor: '#3b82f6',
              tension: 0.4,
              pointBackgroundColor: '#3b82f6',
              spanGaps: false,
            },
          ],
        });

      } catch (err) {
        console.error("Failed to fetch loans:", err);
      }
    };

    fetchLoans();
  }, []);

  const turnoverOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e3a8a',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#4b5563' } },
      y: { grid: { color: '#e5e7eb' }, ticks: { color: '#4b5563' } },
    },
  };

  const handleReplyChange = (id, value) => {
    setCurrentReply({ ...currentReply, [id]: value });
  };

  const handleReplySubmit = (id) => {
    setFeedback(prev =>
      prev.map(fb => fb.id === id ? { ...fb, reply: currentReply[id] || fb.reply } : fb)
    );
    setCurrentReply({ ...currentReply, [id]: '' });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <AdminSidebar />

      <main className="ml-64 flex-1 p-6 grid grid-cols-3 gap-6">
        {/* Header */}
        <div className="col-span-3">
          <h1 className="text-3xl font-bold text-blue-800">Admin Dashboard</h1>
          <p className="text-gray-600 mb-4">Loan application trends and feedback panel</p>
        </div>

        {/* Stat Cards */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">📦 Loans Created</p>
            <p className="text-xl font-bold">{loanStats.created}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">✅ Loans Approved</p>
            <p className="text-xl font-bold">{loanStats.approved}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">❌ Loans Rejected</p>
            <p className="text-xl font-bold">{loanStats.rejected}</p>
          </div>
        </div>

        {/* Loan Applications Graph */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Loan Applications Overview</h2>
          {turnoverData && <Line data={turnoverData} options={turnoverOptions} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

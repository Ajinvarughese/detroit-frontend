// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, Filler);



const AdminDashboard = () => {
  const turnoverData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Total Turnover ($)',
        data: [12000, 15000, 18000, 17000, 20000],
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
      },
    ],
  };

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
      x: {
        grid: { display: false },
        ticks: { color: '#4b5563' },
      },
      y: {
        grid: { color: '#e5e7eb' },
        ticks: { color: '#4b5563' },
      },
    },
  };

  const [feedback, setFeedback] = useState([
    { id: 1, name: 'John Doe', message: 'Application stuck at verification', reply: '' },
    { id: 2, name: 'Jane Smith', message: 'Unable to upload documents', reply: '' },
  ]);
  const [currentReply, setCurrentReply] = useState({});

  const handleReplyChange = (id, value) => {
    setCurrentReply({ ...currentReply, [id]: value });
  };

  const handleReplySubmit = (id) => {
    setFeedback((prev) =>
      prev.map((fb) =>
        fb.id === id ? { ...fb, reply: currentReply[id] || fb.reply } : fb
      )
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
          <p className="text-gray-600 mb-4">Turnover insights and feedback panel</p>
        </div>

        {/* Stat Cards */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">📦 Loans Created</p>
            <p className="text-xl font-bold">124</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">✅ Loans Approved</p>
            <p className="text-xl font-bold">86</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">❌ Loans Rejected</p>
            <p className="text-xl font-bold">21</p>
          </div>
        </div>

        {/* Turnover Graph */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Turnover Overview</h2>
          <Line data={turnoverData} options={turnoverOptions} />
        </div>

        {/* Feedback Panel */}
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-xl shadow h-full flex flex-col">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">User Feedback</h2>
            <div className="overflow-y-auto space-y-4 flex-1 pr-2">
              {feedback.map((fb) => (
                <div key={fb.id} className="bg-blue-50 p-3 rounded border border-blue-100">
                  <p className="font-semibold text-blue-800">{fb.name}</p>
                  <p className="text-gray-700 mt-1">🗨️ {fb.message}</p>
                  {fb.reply ? (
                    <p className="text-green-700 mt-2 italic">🧑‍💻 Reply: {fb.reply}</p>
                  ) : (
                    <div className="mt-2">
                      <textarea
                        value={currentReply[fb.id] || ''}
                        onChange={(e) => handleReplyChange(fb.id, e.target.value)}
                        placeholder="Type your reply..."
                        className="w-full p-2 border rounded mb-2 text-sm"
                        rows={2}
                      />
                      <button
                        onClick={() => handleReplySubmit(fb.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

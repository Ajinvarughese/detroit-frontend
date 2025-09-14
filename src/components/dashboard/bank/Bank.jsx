import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Bank.css';
import { useNavigate } from 'react-router';
import LoansTable from './loanTable/LoanTable';
import axios from 'axios';
import Feedback from '../applicant/feedback/Feedback';
import Payment from './payments/payment';
import API from '../../hooks/API';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const useApi = API();
const navLinks = [
  { label: '🏠 Dashboard', path: '/dashboard', key: ['home'] },
  { label: '📄 Loans', path: '/dashboard/loans', key: ['loans', 'loanDetails'] },
  { label: '💳 Payments', path: '/dashboard/payment', key: ['payments'] },
  { label: '💬 Feedback', path: '/dashboard/feedback', key: ['feedback'] }
];

const Sidebar = ({ page }) => {
  const navigate = useNavigate();
  return (
    <div style={{ zIndex: 1 }} className="applicant-sidebar">
      <div className="applicant-logo">Detroit SF</div>
      <div className="applicant-nav-wrapper">
        <div className="applicant-nav-links">
          {navLinks.map(link => (
            <a
              key={link.key.join('-')}
              href={link.path}
              style={link.key.includes(page) ? { fontWeight: "bold", color: "#4ADE80" } : {}}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <button
        className="applicant-upgrade-btn"
        onClick={() => {
          // TODO: implement deleteUser()
          navigate("/");
        }}
      >
        Log Out
      </button>
    </div>
  );
};

const HomeDashboard = () => {
  const [loans, setLoans] = useState(null);
  const [users, setUsers] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [active, setActive] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllLoans = async () => {
      const userRes = await axios.get(useApi.url + "/user");
      setUsers(userRes.data);

      const loanRes = await axios.get(useApi.url + "/loan");
      setLoans(loanRes.data);

      // count APPROVED or DISBURSED
      const activeCount = loanRes.data.filter(
        (loan) => loan.status === "APPROVED" || loan.status === "DISBURSED"
      ).length;
      setActive(activeCount);

      // ---- Build chart dataset ----
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const counts = Array(12).fill(0);

      loanRes.data.forEach((loan) => {
        if (loan.createdAt) {
          const month = dayjs(loan.createdAt).month(); // 0-11
          counts[month] += 1;
        }
      });

      const currentMonth = dayjs().month(); // e.g., 8 for September

      // 👉 After current month, set values to null so line stops
      const maskedCounts = counts.map((c, i) => (i <= currentMonth ? c : null));

      setChartData({
        labels: monthNames,
        datasets: [
          {
            label: "Loan Applications",
            data: maskedCounts,
            fill: false,
            borderColor: "#4ADE80",
            backgroundColor: "#4ADE80",
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
            spanGaps: false, // ensures the line does not connect over nulls
          },
        ],
      });
    };

    fetchAllLoans();
  }, []);


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#e5e7eb" } },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { ticks: { color: "#a0aec0" }, grid: { color: "#2e3a44" } },
      y: { ticks: { color: "#a0aec0" }, grid: { color: "#2e3a44" }, beginAtZero: true },
    },
  };

  return (
    <main style={{ marginLeft: "220px" }} className="bank-main-content">
      <div style={{ maxWidth: '700px' }}>
        <section className="bank-cards">
          <div className="bank-card">
            <h2>Total Customers</h2>
            <p className="bank-value">{users?.length}</p>
            <p className="bank-trend up">+12% From last month</p>
          </div>
          <div className="bank-card">
            <h2>Total Applications</h2>
            <p className="bank-value">{loans?.length}</p>
            <p className="bank-trend down">-12% From last month</p>
          </div>
          <div className="bank-card">
            <h2>Active Loans</h2>
            <p className="bank-value">{active}</p>
            <p className="bank-trend up">+8% From last month</p>
          </div>
        </section>

        <section className="bank-centered-trend">
          <h3>Loan Trends</h3>
          <div className="chart-wrapper">
            {chartData && <Line data={chartData} options={options} />}
          </div>
        </section>
      </div>
    </main>
  );
};


const Bank = ({ page = "home" }) => {
  return (
    <div className="bank-dashboard-container">
      <Sidebar page={page} />
      {page === "home" && <HomeDashboard />}
      {page === "loanTable" && <LoansTable />}
      {page === "feedback" && <Feedback />}
      {page === "payment" && <Payment />}
    </div>
  );
};

export default Bank;

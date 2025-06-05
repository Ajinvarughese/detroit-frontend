import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const navLinks = [
  { label: '🏠 Dashboard', path: '/dashboard', key: ['home'] },
  { label: '📄 Loans', path: '/dashboard/loans', key: ['loans', 'loanDetails'] },
  { label: '💳 Payments', path: '#', key: ['payments'] },
  { label: '🔔 Notifications', path: '#', key: ['notifications'] },
  { label: '💬 Feedback', path: '/dashboard/feedback', key: ['feedback'] }
];

const Sidebar = ({ page }) => {
  const navigate = useNavigate();
  return (
    <div style={{zIndex: 1}} className="applicant-sidebar">
      <div className="applicant-logo">Detroit SF</div>
      <div className="applicant-nav-wrapper">
        <div className="applicant-nav-links">
          {navLinks.map(link => (
            <a
              key={link.key.join('-')} 
              href={link.path}
              style={link.key.includes(page) ? style.active : {}}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <button className="applicant-upgrade-btn" onClick={() => {
        deleteUser();
        navigate("/");
      }}>Log Out</button>
    </div>
  )
};

const HomeDashboard = () => {
  const [loans, setLoans] = useState(null);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllLoans = async () => {
      const userRes = await axios.get("http://localhost:8080/api/user");
      setUsers(userRes.data);
      console.log(userRes.data);
      const loanRes = await axios.get("http://localhost:8080/api/loan");
      setLoans(loanRes.data);
    }
    fetchAllLoans();
  }, []);

   const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [{
      label: 'Loan Applications',
      data: [120, 190, 170, 220, 240, 280, 300, 350],
      fill: false,
      borderColor: '#4ADE80',
      backgroundColor: '#4ADE80',
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' }
      },
      title: { display: false },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: { ticks: { color: '#a0aec0' }, grid: { color: '#2e3a44' } },
      y: { ticks: { color: '#a0aec0' }, grid: { color: '#2e3a44' }, beginAtZero: true }
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false }
  };

  return(
    <main style={{ marginLeft: "220px" }} className="bank-main-content">
        <div style={{ maxWidth: '700px' }} >
          <section  className="bank-cards">
            <div className="bank-card">
              <h2>Total Customers</h2>
              {console.log(users)}
              <p className="bank-value">{loans?.length}</p>
              <p className="bank-trend up">+12% From last month</p>
            </div>
            <div className="bank-card">
              <h2>Pending Applications</h2>
              <p className="bank-value">120</p>
              <p className="bank-trend down">-12% From last month</p>
            </div>
            <div className="bank-card">
              <h2>Active Loans</h2>
              <p className="bank-value">8,450</p>
              <p className="bank-trend up">+8% From last month</p>
            </div>
          </section>

          <section className="bank-centered-trend">
            <h3>Loan Trends</h3>
            <div className="chart-wrapper">
              <Line data={data} options={options} />
            </div>
          </section>
        </div>

        <section className="bank-top-session">
          <div style={{ width: "100%" }} className="bank-weekly-analytics">
            <h4>Weekly Analytics</h4>
            <ul>
              {["Mobile", "TV", "Desktop", "iOS", "Android", "Linux"].map(item => (
                <li key={item}>
                  <span style={{fontSize: "15px"}}>{item}</span>
                  <span className="bank-trend up">1,273 visits</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
  )
}


const Bank = ({ page="home" }) => {

  return (
    <div className="bank-dashboard-container">
      <Sidebar />
      {page === "home" && <HomeDashboard />}
      {page === "loanTable" && <LoansTable />}
    </div>
  );
};

export default Bank;

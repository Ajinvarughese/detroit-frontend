import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Bank = () => {
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

  return (
    <div className="bank-dashboard-container">
      <aside className="bank-sidebar">
        <div>
          <h1 className="bank-logo">Detroit</h1>
          <nav className="bank-dash-nav-links">
            <a href="#">Dashboard</a>
            <a href="#">Analytics</a>
            <a href="#">Messages</a>
            <a href="#">Community</a>
          </nav>
        </div>
        <div className="bank-bottom-links">
          <a href="#">Settings</a>
          <a href="#">Help</a>
          <button className="bank-upgrade-btn">Log Out</button>
        </div>
      </aside>

      <main className="bank-main-content">
        <section className="bank-cards">
          <div className="bank-card">
            <h2>Total Customers</h2>
            <p className="bank-value">12,132</p>
            <p className="bank-trend up">+12% From last month</p>
          </div>
          <div className="bank-card">
            <h2>Pending Applications</h2>
            <p className="bank-value">2,982</p>
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

        <section className="bank-top-session">
          <h3>Mobile Session</h3>
          <div className="bank-progress-circle"></div>
          <div className="bank-weekly-analytics">
            <h4>Weekly Analytics</h4>
            <ul>
              {["Mobile", "TV", "Desktop", "iOS", "Android", "Linux"].map(item => (
                <li key={item}>
                  <span>{item}</span>
                  <span className="bank-trend up">1,273 visits</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Bank;

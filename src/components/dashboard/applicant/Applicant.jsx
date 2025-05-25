import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Applicant.css';

const Sidebar = () => (
  <div className="applicant-sidebar">
    <div className="applicant-logo">MyLoans</div>
    <div className="applicant-nav-wrapper">
      <div className="applicant-nav-links">
        <a href="#">🏠 Dashboard</a>
        <a href="#">📄 My Loans</a>
        <a href="#">💳 Payments</a>
        <a href="#">🔔 Notifications</a>
        <a href="#">❓ Help</a>
      </div>

    </div>
    <button className="applicant-upgrade-btn">Log Out</button>
  </div>
);

const LoanSummary = ({ loan }) => (
  <div className="applicant-card">
    <h3>Loan Summary</h3>
    <p><strong>Loan Amount:</strong> ₹{loan?.amount?.toLocaleString()}</p>
    <p><strong>Status:</strong> {loan?.status}</p>
    <p><strong>Pending Amount:</strong> ₹{loan?.amount_Pending?.toLocaleString()}</p>
    <p><strong>Eligibility:</strong> {loan?.isEligible ? 'Eligible' : 'Not Eligible'}</p>
  </div>
);

const PaymentHistory = ({ payments }) => (
  <div className="applicant-card applicant-payment-history">
    <h3>Payment History</h3>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p, i) => (
          <tr key={i}>
            <td>{p.date?.split('T')[0]}</td>
            <td>₹{p.amount}</td>
            <td className={p.status === 'PAID' ? 'applicant-status-paid' : 'applicant-status-due'}>
              {p.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LoanDetails = ({ loan }) => (
  <div className="applicant-card">
    <h3>Loan Details</h3>
    <p><strong>Category:</strong> {loan?.loanCategory}</p>
    <p><strong>Tenure:</strong> {loan?.durationMonths} months</p>
    <p><strong>Interest Rate:</strong> {loan?.interestRate}%</p>
    <p><strong>Start Date:</strong> {loan?.loanStartDate?.split('T')[0]}</p>
    <p><strong>Questionnaire Score:</strong> {loan?.questionnaireScore}</p>
    <p><strong>Document Verified:</strong> {loan?.documentVerified ? 'Yes' : 'No'}</p>
    {loan?.projectReportPath && (
      <p><a href={loan.projectReportPath} target="_blank" rel="noopener noreferrer">📎 View Project Report</a></p>
    )}
  </div>
);

const Notifications = ({ loan }) => (
  <div className="applicant-card applicant-notifications">
    <h3>Notifications</h3>
    <ul>
      {!loan?.documentVerified && <li>📌 Please verify your documents.</li>}
      {loan?.amount_Pending > 0 && <li>⚠️ EMI is due. Make a payment soon.</li>}
      {loan?.isEligible === false && (
        <li>❗ Not eligible: {loan?.eligibilityReason || 'Reason not provided'}</li>
      )}
    </ul>
  </div>
);

const SupportSection = () => (
  <div className="applicant-card">
    <h3>Need Help?</h3>
    <p>If you have any queries, reach out to our support team.</p>
    <button>Contact Support</button>
  </div>
);

const Applicant = () => {
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchLoan = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/loans');
        setLoan(res.data);
        setPayments(res.data.payments || []);
      } catch (err) {
        console.error('Error fetching loan:', err);
      }
    };
    fetchLoan();
  }, []);

  return (
    <div className='applicant-dashboard'>
      <div className="applicant-dashboard-container">
        <Sidebar />
        <div className="applicant-main-content">
          <LoanSummary loan={loan} />
          <PaymentHistory payments={payments} />
          <LoanDetails loan={loan} />
          <Notifications loan={loan} />
          <SupportSection />
        </div>
      </div>
    </div>
  );
};

export default Applicant;

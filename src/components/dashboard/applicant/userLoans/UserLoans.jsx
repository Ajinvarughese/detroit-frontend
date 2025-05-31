import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { PictureAsPdf } from "@mui/icons-material";
import { Typography, Button, Box, Breadcrumbs, Link } from "@mui/material";
import { getUser } from "../../../hooks/LocalStorageUser";
import { formattedDate } from "../../../hooks/CurrentDate";


const AllLoans = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState([]);

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/loan/user/${getUser("user").id}`);
        setLoan(res.data);    
      } catch (err) {
        console.error('Error fetching loan:', err);
      }
    };
    fetchAllLoans();
  }, [])

  return (
    <>
      {
        loan.length === 0 ? 
          <div className="applicant-card">
            No data
          </div>
        :
        loan.map((item) => (
          <div
            onClick={() => navigate(`/dashboard/loan/${item.loanUUID}`)}
            className="applicant-card cursor-pointer transition-transform duration-300 hover:scale-101 hover:border-1"
            key={item.id}
          >
            <h3><strong>{item.projectName}</strong></h3>
            <p>Loan Amount: <strong>₹{item.amount?.toLocaleString()}</strong></p>
            <p>Status: <strong>{item.status}</strong></p>
            <p>Created Date: <strong>{formattedDate(item.createdAt)}</strong></p>
          </div>
        ))
      }
    </>
  )
}


const LoanSummary = () => { 
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
      const fetchLoan = async () => {
      try {
          const res = await axios.get(`http://localhost:8080/api/loan/${id}`);
          setLoan(res.data);
          setPayments(res.data.payments || []);
      } catch (err) {
          console.error('Error fetching loan:', err);
      }
      };
      fetchLoan();
  }, []);
  
  return (
    <>
      {/* Loan Summary */}
      <div className="applicant-card">
        <h3>Loan Summary</h3>
        <p>Project Name:<strong> {loan?.projectName}</strong></p>
        <p><strong>Loan Amount:</strong> ₹{loan?.amount?.toLocaleString()}</p>
        <p><strong>Status:</strong> {loan?.status}</p>
        <p><strong>Pending Amount:</strong> ₹{loan?.amountPending?.toLocaleString()}</p>
      </div>

      {/* Loan Details */}
      <div className="applicant-card">
        <h3>Loan Details</h3>
        <p><strong>Category:</strong> {loan?.loanCategory}</p>
        <p><strong>Tenure:</strong> {loan?.durationMonths} months</p>
        <p><strong>Interest Rate:</strong> {loan?.interestRate ? loan.interestRate+"%" : '' }</p>
        <p><strong>Start Date:</strong> {loan?.loanStartDate?.split('T')[0]}</p>
        <p><strong>Questionnaire Score:</strong> {loan?.questionnaireScore}</p>
        <p><strong>Document Verified:</strong> {loan?.documentVerified ? 'Yes' : 'No'}</p>
        {loan?.projectReportPath && (
          <Button variant="outlined"><a href={loan.projectReportPath} target="_blank" style={{ display: 'flex', alignItems: 'center' }} rel="noopener noreferrer">
            <PictureAsPdf color="error" sx={{ mr: 1 }} />
            <Typography variant="body2">View project Report</Typography>  
          </a></Button>
        )}
      </div>

      {/* Payment History */}
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

      {/* Notifications */}
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

      {/* Support Section */}
      <div className="applicant-card">
        <h3>Need Help?</h3>
        <p>If you have any queries, reach out to our support team.</p>
        <button>Contact Support</button>
      </div>
    </>
  )
};

const UserLoans = ({ page }) => {
  return(
    <Box sx={{width: "100%"}} overflow={{y: "auto"}}>
      {
        page === "allLoans" && (
          <Breadcrumbs sx={{margin: "30px 0px 0px 20px",color: "#ccc"}} aria-label="breadcrumb">
            <Link underline="hover" sx={{opacity: '0.6'}} color="inherit" href="/dashboard">
              Home
            </Link>
            <Typography sx={{ color: '#fff'}}>Loans</Typography>
          </Breadcrumbs>
        )
      }
      {
        page === "details" && (
          <Breadcrumbs sx={{margin: "30px 0px 0px 20px",color: "#ccc"}} aria-label="breadcrumb">
            <Link underline="hover" sx={{opacity: '0.6'}} color="inherit" href="/dashboard">
              Home
            </Link>
            <Link
              sx={{
                opacity: '0.6'
              }}
              underline="hover"
              color="inherit"
              href="/dashboard/loan"
            >
              Loans
            </Link>
            <Typography sx={{ color: '#fff'}}>Loan details</Typography>
          </Breadcrumbs>
        )
      }
      <div className="applicant-main-content" style={{padding: "24px"}}>
        { page === "allLoans" && <AllLoans /> }
        { page === "details" && (
            <>
              <LoanSummary />
            </>
        )}
      </div>
    </Box>
  )
}

export default UserLoans;
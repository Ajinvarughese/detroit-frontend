import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { PictureAsPdf } from "@mui/icons-material";
import { Typography, Button, Box, Breadcrumbs, Link, Divider } from "@mui/material";
import { getUser } from "../../../hooks/LocalStorageUser";
import { formattedDate, monthsToYears } from "../../../hooks/CurrentDate";
import { Send } from "lucide-react";
import { motion } from 'framer-motion';
import { amountFormat } from "../../../hooks/Formatter";
import { convertToString, toCamelCase } from "../../../hooks/EnumToString";


const AllLoans = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState([]);

  useEffect(() => {
    const fetchAllLoans = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/loan/user/${getUser("user").id}`);
        setLoan(res.data.reverse());    
      } catch (err) {
        console.error('Error fetching loan:', err);
      }
    };
    fetchAllLoans();
  }, []);
  

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


const LoanUpdation = () => {
  const { id } = useParams();

  const [newAmount, setNewAmount] = useState(null);
  const [duration, setDuration] = useState(null);
  const [status, setStatus] = useState(null);
  const [loan, setLoan] = useState(null);
  const [success, setSuccess] = useState(false);

  const fetchLoan = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/loan/${id}`);
        setLoan(res.data);
        setStatus(res.data.status);
      } catch (err) {
        console.error('Error fetching loan:', err);
      }
    };
  useEffect(() => {
    fetchLoan();
  }, []);

  const handleApproved = async () => {
    console.log(loan);
    try {
      const approvedRes = await axios.put("http://localhost:8080/api/loan/updateRequest", loan, {
       headers: { 'Content-Type' : 'application/json' }
      })
      console.log(approvedRes);
      
    } catch (error) {
      console.error(error);
    }
  }

  const handleClose = async () => {
    const data = {
      id: loan.id,
      status: "CLOSED"
    }
    const res = await axios.put(`http://localhost:8080/api/loan/status`,data, {
      headers: { 'Content-Type': 'application/json'}
    });
    fetchLoan();
    console.log(res.data);
  }

  const handleSubmit = async () => {
    if (!newAmount && !duration) {
      alert('Please fill in a field.');
      return;
    }

    try {
      loan.amount = newAmount === null ? loan.amount : amountFormat(newAmount, false);
      loan.durationMonths = duration === null ? loan.durationMonths : Number(duration);
      
      const res = await axios.put(`http://localhost:8080/api/loan/newRequest`, loan, {
        headers: { 'Content-Type': 'application/json' }
      });

      setStatus(res.data.status);
      setSuccess(true);
      setNewAmount('');
      setDuration('');
      setTimeout(() => setSuccess(false), 3000); // Auto-hide after 3 seconds
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (status !== "PENDING") return null;

  return (
    <div className="applicant-card flex flex-col md:flex-row">
      {/* Left Side - Loan Details */}
      <div className="md:w-1/2 p-6">
        <h3 className="text-2xl font-bold text-white mb-4">Loan Updation</h3>
        <p className="text-slate-300 mb-2">Approved Amount: <span className="text-[#4ade80] font-bold">₹{amountFormat(loan?.amount)}</span></p>
        <p className="text-slate-300 mb-2">Interest Rate: <span className="text-[#4ade80] font-bold">{loan?.interestRate}%</span></p>
        <p className="text-slate-300 mb-2">Duration: <span className="text-[#4ade80] font-bold">{loan?.durationMonths} months</span><span style={{ fontSize: "12px", opacity: 0.7 }}> ({monthsToYears(loan?.durationMonths)})</span></p>
        <p className="text-slate-300 mb-2">Status: <span className={`${loan?.status === 'APPROVED' ? 'text-[#4ade80]' : loan?.status === 'DISBURSED' ? 'text-[#9D00FF]' : 'text-yellow-500'} font-bold`}>{loan?.status}</span></p>
        <p className="text-slate-300 mb-2">Created Date: <span className="text-[#4ade80] font-bold">{formattedDate(loan?.createdAt)}</span></p>

        <div className="flex gap-4">
          <button
          onClick={handleApproved}
          className="group cursor-pointer flex w-fit items-center px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-green-400 text-sm font-semibold shadow-lg hover:shadow-xl"
        >Accept Loan</button>
        <button
          onClick={handleClose}
          className="group cursor-pointer flex w-fit items-center px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-green-400 text-sm font-semibold shadow-lg hover:shadow-xl"
        >Close Loan</button>
        </div>
      </div>

      <Divider sx={{
        background: "#ccc", opacity: 0.3, borderRadius: "100%",
        height: { xs: '1px', md: '100%' },
        width: { xs: '100%', md: '1px' }
      }} />

      {/* Right Side - Update Inputs */}
      <div className="w-full flex flex-col gap-5 md:w-1/2 p-6 space-y-4">
        <h4 className="text-xl font-semibold text-white">Update Loan Details</h4>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Request New Amount (₹)</label>
          <input
            type="text"
            value={newAmount}
            onChange={(e) => {
              const value = e.target.value;
              setNewAmount(amountFormat(value));
            }}
            placeholder="Enter new amount"
            className="w-full px-3 py-3 mt-1 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80] hover:bg-slate-700/70"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">New Duration (months)</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => {
              const value = e.target.value;
              if (isNaN(value)) return;
              setDuration(value);
            }}
            placeholder="Enter new duration"
            className="w-full px-3 py-3 mt-1 bg-slate-700/50 border border-slate-600 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/50 focus:border-[#4ade80] hover:bg-slate-700/70"
          />
          <p>{monthsToYears(duration)}</p>
        </div>
        
        {/* Animated Submit Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          className="group flex w-fit items-center px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-green-400 text-sm font-semibold shadow-lg hover:shadow-xl"
        >
          <Send className="w-4 h-4 mr-2" /> Submit Update
        </motion.button>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-green-400 text-sm font-semibold"
          >
            Loan updated successfully!
          </motion.div>
        )}
      </div>
    </div>
  );
};

const LoanSummary = () => { 
  const { id } = useParams();
  const navigate = useNavigate();
  const [loan, setLoan] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
      const fetchLoan = async () => {
      try {
          const res = await axios.get(`http://localhost:8080/api/loan/${id}`);
          console.log(res.data);
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
      { /* Loan Summary */ }
      <div className="applicant-card">
        <h3>Loan Summary</h3>
        <p>Project Name:<strong> {loan?.projectName}</strong></p>
        <p><strong>Loan Amount:</strong> ₹{amountFormat(loan?.amount)}</p>
        <p className="text-slate-300 mb-2">Status: <span className={`${loan?.status === 'APPROVED' || loan?.status === 'REPAID' ? 'text-[#4ade80]' : loan?.status === 'DISBURSED' ? 'text-[#9D00FF]' : loan?.status === 'REJECTED' ? 'text-red-500' : loan?.status === 'CLOSED' ? 'text-gray-500' :'text-yellow-500'} font-bold`}>{loan?.status}</span></p>
        <p><strong>Pending Amount:</strong> ₹{amountFormat(loan?.amountPending)}</p>
        <p><strong>Created date: </strong> {formattedDate(loan?.createdAt)}</p>
        {
          loan?.status === "CREATED" && (
            <button
              onClick={() => navigate(`/loan/application/${toCamelCase(loan.loanCategory)}/${loan.loanUUID}`)}
              className="group cursor-pointer flex w-fit items-center px-6 py-2 bg-[#4ade80] text-white rounded-lg hover:bg-green-400 text-sm font-semibold shadow-lg hover:shadow-xl"
            >Finish Application</button>
          )
        }
      </div>

      {/* Loan Details */}
      <div className="applicant-card">
        <h3>Loan Details</h3>
        <p><strong>Category:</strong> {convertToString(loan?.loanCategory ?? '')}</p>
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
    <Box sx={{width: "100%", marginLeft: '220px'}} overflow={{y: "auto"}}>
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
          <>
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
            <Box>
              <div style={{padding: "24px"}} className="applicant-main-content">
                <LoanUpdation />
              </div>
            </Box>
          </>
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
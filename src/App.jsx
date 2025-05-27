import './App.css';
import Landing from './landing/index';
import { BrowserRouter, Route, Routes } from 'react-router';
import Loginpage from './components/auth/Loginpage';
import QuestionnaireEditor from './components/questionnaire/editor/QuestionnaireEditor';
import { getUser } from './components/hooks/LocalStorageUser';
import Questionnaire from "./components/questionnaire/Questionnaire.jsx";
import LoanPage from "./components/Loan/LoanPage.jsx";
import Applicant from "./components/dashboard/applicant/Applicant";
import Bank from "./components/dashboard/bank/Bank";
import AnswerForm from './components/answer/AnswerForm';
import LoanApplicationForm from './components/loan/loanApplication/LoanApplicationForm';

function App() {
  return (
    <>
    <BrowserRouter>
    {/* user depended routes */}
    {
      getUser('user').role === "BANK"  &&
      <Routes>
        <Route path='/questionnaire/editor/:id' element={<QuestionnaireEditor />} />
        <Route path='/questionnaire' element={<Questionnaire />} />
        <Route path='/dashboard' element={<Bank />} />
      </Routes>
    }
    {
      getUser('user').role === "APPLICANT" &&
      <Routes>
        <Route path='/dashboard' element={<Applicant />} />
        <Route path='/questionnaire/form/:id' element={<AnswerForm />} />
        <Route path='/loan' element={<LoanApplicationForm />} />
      </Routes>

    }
      {/* Loan pages */}
      <Routes>
        <Route path='/loan/biodiversity' element={<LoanPage type={"BIODIVERSITY"} />} />
        <Route path='/loan/water' element={<LoanPage type={"WATER"} />} />
        <Route path='/loan/climateAdaptation' element={<LoanPage type={"CLIMATE_ADAPTATION"} />} />
        <Route path='/loan/climateMitigation' element={<LoanPage type={"CLIMATE_MITIGATION"} />} />
        <Route path='/loan/pollutionPrevention' element={<LoanPage type={"POLLUTION_PREVENTION"} />} />
        <Route path='/loan/circularEconomy' element={<LoanPage type={"CIRCULAR_ECONOMY"} />} />
      </Routes>
      

      {/* Questionnaire */}
      <Routes>
        <Route path="/questionnaire/:id" element={<LoanPage />} />
      </Routes>

        {/* Login pages */}
      <Routes>
        <Route path='/login/applicant' element={<Loginpage user='APPLICANT' />} />
        <Route path='/login/bank' element={<Loginpage user='BANK' />} />
        <Route path='/' element={<Landing />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

import './App.css'
import Landing from './landing/index'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loginpage from './components/auth/Loginpage'
import QuestionnaireEditor from './components/questionnaire/editor/QuestionnaireEditor'
import { getUser } from './components/hooks/LocalStorageUser'
import Questionnaire from "./components/questionnaire/Questionnaire.jsx";

function App() {

  return (
    <>
    <BrowserRouter>
    {
      getUser('user').role === "BANK"  &&
      <Routes>
        <Route path='/questionnaire/editor/:id' element={<QuestionnaireEditor />} />
        <Route path='/questionnaire' element={<Questionnaire />} />
      </Routes>
    }
    {
      getUser('user').role === "APPLICANT" &&
      <Routes>
      </Routes>
    }
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

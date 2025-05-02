import './App.css'
import Landing from './landing/index'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loginpage from './components/auth/Loginpage'
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Loginpage />} />
        <Route path='/' element={<Landing />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

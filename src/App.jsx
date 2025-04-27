import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home/index'
import Landing from './landing/Landing'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loginpage from './components/auth/Loginpage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Loginpage />} />
        <Route path='/' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App

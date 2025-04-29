import { useState } from 'react'
import './App.css'
import Home from './Home/index'
import { BrowserRouter, Route, Routes } from 'react-router'
import Loginpage from './components/auth/Loginpage'
function App() {

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

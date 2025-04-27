import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './Home/index'
import Landing from './landing/Landing'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Landing />
      <Home />
    </>
  )
}

export default App

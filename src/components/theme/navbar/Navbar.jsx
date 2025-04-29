import React, { useState } from 'react'
import './Navbar.css'
import { FaBars, FaTimes } from 'react-icons/fa'

import logo_light from '../../../assets/logo-de.png'
import logo_dark from '../../../assets/logo-deli.png'
import search_icon_light from '../../../assets/search-w.png'
import search_icon_dark from '../../../assets/search-b.png'
import toggle_light from '../../../assets/night.png'
import toggle_dark from '../../../assets/day.png'

const Navbar = ({ theme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <>
      <div className='navbar'>
        <img src={theme === 'light' ? logo_light : logo_dark} alt="Logo" className="Logo" />

        <ul className={`nav-links ${sidebarOpen ? 'open' : ''}`}>
          <a href='#'><li onClick={toggleSidebar}>Home</li></a>
          <a href='#'><li onClick={toggleSidebar}>About</li></a>
          <a href='#'><li onClick={toggleSidebar}>Loan details</li></a>
          <a href='/login'><li onClick={toggleSidebar}>Login</li></a>
        </ul>

        <div className="search-box">
          <input type="text" placeholder="Search" />
          <img src={theme === 'light' ? search_icon_light : search_icon_dark} alt="Search Icon" />
        </div>

        <img onClick={toggleMode} src={theme === 'light' ? toggle_light : toggle_dark} alt="Toggle Theme" className='toggle-icon' />

        <div className="menu-icon" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Optional: Overlay to close menu */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  )
}

export default Navbar

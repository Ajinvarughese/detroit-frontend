import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { FaBars, FaTimes } from 'react-icons/fa'

import logo_light from '../../../assets/DETROIT.png'
import search_icon_light from '../../../assets/search-w.png'


const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)  // State to track scroll
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Function to handle scroll event
  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true)
    } else {
      setScrolled(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <img src={logo_light} alt="Logo" className="logo" />

        <ul
          style={
            isMobile
              ? {
                  background: scrolled ? '#fff' : 'transparent',
                  backdropFilter: 'blur(15px)',
                  '&a': {
                    color: scrolled ? '#000' : '#fff',
                  }
                }
              : {}
          }
          className={`nav-links ${sidebarOpen ? 'open' : ''}`}
        >
          <a href='#' style={isMobile && scrolled ? { color: '#000' } : {}}><li onClick={toggleSidebar}>Home</li></a>
          <a href='#' style={isMobile && scrolled ? { color: '#000' } : {}}><li onClick={toggleSidebar}>About</li></a>
          <a href='#' style={isMobile && scrolled ? { color: '#000' } : {}}><li onClick={toggleSidebar}>Loan details</li></a>
          <a href='/login' style={isMobile && scrolled ? { color: '#000' } : {}}><li onClick={toggleSidebar}>Login</li></a>
        </ul>

        <div className="search-box">
          <input type="text" placeholder="Search" />
          <img src={search_icon_light} alt="Search Icon" />
        </div>

       

        <div className="menu-icon" onClick={toggleSidebar}>
          {sidebarOpen ? <FaTimes color={scrolled ? '#000' : '#fff'} /> : <FaBars color={scrolled ? '#000' : '#fff'} />}
        </div>
      </div>

      {/* Optional: Overlay to close menu */}
      {sidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
    </>
  )
}

export default Navbar

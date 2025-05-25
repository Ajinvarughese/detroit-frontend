import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { FaBars, FaTimes } from 'react-icons/fa'
import logo_light from '../../../assets/DETROIT.png'
import search_icon_light from '../../../assets/search-w.png'
import { deleteUser, getUser } from '../../hooks/LocalStorageUser'


const Navbar = ({style = {position: "fixed"}, isDark = false }) => {

  const navList = {
    guest: [
      {
        name: 'Home',
        link: '/'
      },
    ],
    applicant: [
      {
        name: 'Home',
        link: '/'
      },
      {
        name: 'Dashboard',
        link: '/dashboard'
      },
    ],
    bank: [
      {
        name: 'Questionnaire',
        link: '/questionnaire',
      },
      {
        name: 'SF',
      link: '/sf'
      },
      {
        name: 'Rules',
        link: '/rules'
      },
    ]
  }
  
  const user = getUser('user');
  var mapUser = navList.guest;
  if(user.role === 'BANK') {
    mapUser = navList.bank;
  }else if(user.role === 'APPLICANT') {
    mapUser = navList.applicant;
  }


  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrolled, setScrolled] = useState(isDark)  // State to track scroll
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
    <div className="nav">
      <div style={{
        ...style
      }} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <img src={logo_light} alt="Logo" className="logo" />
        <ul
        
          style={
            isMobile
              ? {
                  background: scrolled ? '#fff' : 'transparent',
                  backdropFilter: 'blur(15px)',
                  
                }
              : {}
          }
          className={`nav-links ${sidebarOpen ? 'open' : ''}`}
        >
          {
            mapUser.map((item, i) => (
              <a href={item.link} style={style.position == "relative" ? { color: '#000' } : isMobile ? scrolled ? {color: "#000"} : {color: '#fff'} : scrolled ? { color: '#000' } : {color: "#fff"}}>
                <li onClick={toggleSidebar}>{item.name}</li>
              </a>
            ))
          }
          {
            user.role ? 
              (
                <li style={scrolled || style.position == "relative" ? { color: '#000' } : {color: "#fff"}} className="dropdown-toggle" 
                  onClick={() => {
                    toggleSidebar
                    deleteUser();
                    window.location.reload();
                  }
                }>
                  Logout
                </li>
              )
            : 
            (
              <div
                className="dropdown"
                style={scrolled ? { color: '#000' } : {color: "#fff"}}
              >
                <li className="dropdown-toggle">
                  Login ▾
                </li>
                <ul className="dropdown-menu">
                  <a href="/login/applicant"><li style={{color: "#000"}} onClick={toggleSidebar}>Applicant</li></a>
                  <a href="/login/bank"><li style={{color: "#000"}} onClick={toggleSidebar}>Bank</li></a>
                </ul>
              </div>
            )
          }

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
    </div>
  )
}

export default Navbar

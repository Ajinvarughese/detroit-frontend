import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Applicant.css';
import Dashboard from './dashboard/dashboard';
import Feedback from './feedback/Feedback';
import { deleteUser } from '../../hooks/LocalStorageUser';
import { useNavigate } from 'react-router';

const style = {
  active: {
    backgroundColor: "rgba(74, 222, 128, 0.15)", 
    fontWeight: "bold"
  }
}

const navLinks = [
  { label: '🏠 Dashboard', path: '/dashboard', key: 'home' },
  { label: '📄 My Loans', path: '#', key: 'loans' },
  { label: '💳 Payments', path: '#', key: 'payments' },
  { label: '🔔 Notifications', path: '#', key: 'notifications' },
  { label: '💬 Feedback', path: '/dashboard/feedback', key: 'feedback' }
];
const Sidebar = ({page}) => {
  const navigate = useNavigate();
  return (
  <div className="applicant-sidebar">
    <div className="applicant-logo">MyLoans</div>
    <div className="applicant-nav-wrapper">
      <div className="applicant-nav-links">
        {navLinks.map(link => (
          <a
            key={link.key}
            href={link.path}
            style={page === link.key ? style.active : {}}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
    <button className="applicant-upgrade-btn" onClick={() => {
      deleteUser();
      navigate("/")
    }}>Log Out</button>
  </div>
)};



const Applicant = ({ page="home" }) => {
  

  return (
    <div className='applicant-dashboard'>
      <div className="applicant-dashboard-container">
        <Sidebar page={page} />
          {page === 'home' && <Dashboard />}
          {page === 'feedback' && <Feedback />}
      </div>
    </div>
  );
};

export default Applicant;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Applicant.css';
import UserLoans from './userLoans/UserLoans';
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
  { label: '🏠 Dashboard', path: '/dashboard', key: ['home'] },
  { label: '📄 My Loans', path: '/dashboard/loan', key: ['loans', 'loanDetails'] },
  { label: '💳 Payments', path: '#', key: ['payments'] },
  { label: '🔔 Notifications', path: '#', key: ['notifications'] },
  { label: '💬 Feedback', path: '/dashboard/feedback', key: ['feedback'] }
];
const Sidebar = ({page, open}) => {
  const navigate = useNavigate();
  return (
    <div className="applicant-sidebar">
      <div className="applicant-logo">My Loans</div>
      <div className="applicant-nav-wrapper">
        <div className="applicant-nav-links">
          {navLinks.map(link => (
            <a
              key={link.key.join('-')} 
              href={link.path}
              style={link.key.includes(page) ? style.active : {}}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <button className="applicant-upgrade-btn" onClick={() => {
        deleteUser();
        navigate("/");
      }}>Log Out</button>
    </div>
  )
};




const Applicant = ({ page="home" }) => {
  return (
    <div className='applicant-dashboard'>
      <div className="applicant-dashboard-container">
        <Sidebar page={page} />
          {page === 'home' && <Dashboard />}
          {page === 'feedback' && <Feedback />}
          {page === 'loan' &&  <UserLoans page="allLoans" />}
          {page === 'loanDetails' &&  <UserLoans page="details" />}
      </div>
    </div>
  );
};

export default Applicant;

import React, { useState } from 'react';
import './Loginpage.css';
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaBriefcase } from "react-icons/fa";

const Loginpage = () => {
  const [action, setAction] = useState('');

  const registerLink = () => setAction('active');
  const loginLink = () => setAction('');

  return (
    <div className="container">
      <div className={`wrapper ${action}`}>
        <div className="form-box login">
          <form>
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <FaLock className="icon" />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>
            
            <button type="submit">Login</button>
            <div className="register-link">
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={registerLink}>Register</a>
              </p>
            </div>
          </form>
        </div>
        <div className="form-box register">
          <form>
            <h1>Registration</h1>
            <div className="name-row">
              <div className="input-box half">
              <input type="text" placeholder="First Name" required />
              <FaUser className="icon" />
            </div>

            <div className="input-box half">
              <input type="text" placeholder="Last Name" required />
              <FaUser className="icon" />
            </div>
            </div>

            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <input type="password" placeholder="Password" required />
              <FaLock className="icon" />
            </div>
            
            <div className="input-box">
              <input type="text" placeholder="Address" required />
              <FaMapMarkerAlt className="icon" />
            </div>

            <div className="input-box">
              <input type="text" placeholder="Organization" required />
              <FaBuilding className="icon" />
            </div>

            <div className="input-box">
              <input type="text" placeholder="Business Name" required />
              <FaBriefcase className="icon" />
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> I agree to the terms & conditions
              </label>
            </div>

            <button type="submit">Register</button>
            <div className="register-link">
              <p>
                Already have an account?{' '}
                <a href="#" onClick={loginLink}>Login</a>
              </p>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};

export default Loginpage;

import React, { useState } from 'react';
import axios from 'axios';
import './Loginpage.css';
import {
  FaUser, FaLock, FaEnvelope, FaMapMarkerAlt,
  FaBuilding, FaBriefcase, FaPhone,
  FaEye, FaEyeSlash
} from "react-icons/fa";

const Loginpage = () => {
  const [showPass, setShowPass] = useState(false);
  const [action, setAction] = useState('');

  const registerLink = () => setAction('active');
  const loginLink = () => setAction('');

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
    organization: '',
    role: '',
    agreed: false
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const data = {
      fullName: registerData.firstName + " " + registerData.lastName,
      phone: registerData.phone,
      email: registerData.email,
      password: registerData.password,
      address: registerData.address,
      role: "APPLICANT",
      organization: registerData.organization,
      subRole: registerData.role
    };

    try {
      const response = await axios.post('http://localhost:8080/api/user', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Registration success:', response.data);
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: loginData.email,
      password: loginData.password
    };

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login success:', response.data);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className={`wrapper ${action}`}>
        {/* Login Form */}
        <div className="form-box login">
          <form onSubmit={handleLoginSubmit}>
            <h1>Login</h1>
            <div className="input-box">
              <input
                type="text"
                name="email"
                placeholder="email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="password"
                required
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <div onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>
                {showPass ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
              </div>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#">Forgot Password?</a>
            </div>

            <button type="submit">Login</button>
            <div className="register-link">
              <p>Don't have an account? <a href="#" onClick={registerLink}>Register</a></p>
            </div>
          </form>
        </div>

        {/* Registration Form */}
        <div className="form-box register">
          <form onSubmit={handleRegisterSubmit}>
            <h1>Registration</h1>
            <div className="name-row">
              <div className="input-box half">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  value={registerData.firstName}
                  onChange={handleRegisterChange}
                />
                <FaUser className="icon" />
              </div>
              <div className="input-box half">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  value={registerData.lastName}
                  onChange={handleRegisterChange}
                />
                <FaUser className="icon" />
              </div>
            </div>

            <div className="input-box">
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                required
                value={registerData.phone}
                onChange={handleRegisterChange}
              />
              <FaPhone className="icon" />
            </div>

            <div className="input-box">
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={registerData.email}
                onChange={handleRegisterChange}
              />
              <FaEnvelope className="icon" />
            </div>

            <div className="input-box">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={registerData.password}
                onChange={handleRegisterChange}
              />
              <div onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>
                {showPass ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
              </div>
            </div>

            <div className="input-box">
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={registerData.address}
                onChange={handleRegisterChange}
              />
              <FaMapMarkerAlt className="icon" />
            </div>

            <div className="input-box">
              <input
                type="text"
                name="organization"
                placeholder="Organization"
                value={registerData.organization}
                onChange={handleRegisterChange}
              />
              <FaBuilding className="icon" />
            </div>

            <div className="input-box">
              <select
                name="role"
                value={registerData.role}
                onChange={handleRegisterChange}
                required
              >
                <option value="">Select Role</option>
                <option value="INDIVIDUAL">Individual</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="GOVERNMENT">Government</option>
              </select>
              <FaBriefcase className="icon" />
            </div>

            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  name="agreed"
                  checked={registerData.agreed}
                  onChange={handleRegisterChange}
                  required
                /> I agree to the terms & conditions
              </label>
            </div>

            <button type="submit">Register</button>
            <div className="register-link">
              <p>Already have an account? <a href="#" onClick={loginLink}>Login</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;

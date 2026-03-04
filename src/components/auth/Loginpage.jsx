import React, { useState } from 'react';
import axios from 'axios';
import './Loginpage.css';
import {
  FaUser, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaPhone,
  FaEye, FaEyeSlash, FaBriefcase
} from "react-icons/fa";
import { saveUser } from '../hooks/LocalStorageUser';
import { useNavigate } from "react-router";
import API from '../hooks/API';

const useApi = API();

const Loginpage = ({ user }) => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [forgotEmail, setForgotEmail] = useState('');
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

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Validation error state
  const [formErrors, setFormErrors] = useState({
    phone: '',
    password: ''
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const role = window.location.pathname.split('/')[2].toUpperCase();
    const data = {
      email: loginData.email,
      password: loginData.password,
      role: role
    };

    try {
      const response = await axios.post(useApi.url + '/user/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login success:', response.data);
      saveUser(response.data);
      navigate("/");
    } catch (error) {
      alert("Username or password is incorrect.");
      console.error('Login error:', error.response?.data || error.message);
    }
  };


  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Field-level validation
    if (name === "phone") {
      if (!/^\d+$/.test(value)) {
        setFormErrors((prev) => ({ ...prev, phone: "Phone number must be numeric" }));
      } else {
        setFormErrors((prev) => ({ ...prev, phone: "" }));
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setFormErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters" }));
      } else {
        setFormErrors((prev) => ({ ...prev, password: "" }));
      }
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Check if errors exist
    if (formErrors.phone || formErrors.password) {
      return; // Block submit if errors
    }

    const data = {
      fullName: `${registerData.firstName} ${registerData.lastName}`,
      phone: registerData.phone,
      email: registerData.email,
      password: registerData.password,
      address: registerData.address,
      role: user === "APPLICANT" ? user : registerData.role,
      organization: registerData.organization,
      subRole: user === "APPLICANT" ? registerData.role : null
    };

    try {
      const response = await axios.post(useApi.url + '/user', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Registration success:', response.data);
      saveUser(response.data);
      window.location.href = '/';
    } catch (error) {
      alert("User already exists");
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

  const registerLink = () => {
    setIsRegistration(true);
    setIsForgotPassword(false);
  };

  const loginLink = () => {
    setIsRegistration(false);
    setIsForgotPassword(false);
  };

  return (
    <div className="container-login">
      <div
        style={{
          width: '100%',
          maxWidth: isRegistration ? '500px' : '400px'
        }}
        className="wrapper"
      >
        {/* Login Form */}
        {!isForgotPassword && !isRegistration && (
          <div style={{ width: "100%" }} className="form-box login">
            <form onSubmit={handleLoginSubmit}>
              <h1>Login</h1>
              <div className="input-box">
                <input
                  type="text"
                  name="email"
                  placeholder="Email"
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
                  placeholder="Password"
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                />
                <div className="icon" onClick={() => setShowPass(!showPass)} style={{ zIndex: 100, cursor: 'pointer' }}>
                  {showPass ? <FaEye /> : <FaEyeSlash />}
                </div>
              </div>

              <button type="submit">Login</button>
              <div className="register-link">
                <p>Don't have an account? <a style={{ cursor: 'pointer' }} onClick={registerLink}>Register</a></p>
              </div>
            </form>
          </div>
        )}

        {/* Registration Form */}
        {isRegistration && (
          <div className="form-box register">
            <form onSubmit={handleRegisterSubmit}>
              <h1>Register</h1>
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
              {formErrors.phone && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.phone}</p>}

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
              {formErrors.password && <p style={{ color: "red", fontSize: "12px" }}>{formErrors.password}</p>}

              {user === "APPLICANT" && (
                <>
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
                      value={registerData.subRole}
                      onChange={handleRegisterChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="ENTERPRISE">Enterprise</option>
                      <option value="GOVERNMENT">Government</option>
                    </select>
                    <FaBriefcase className="icon" />
                  </div>
                </>
              )}

              {user === "BANK" && (
                <div className="input-box">
                  <select
                    name="role"
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="BANK">Bank</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <FaBriefcase className="icon" />
                </div>
              )}

              <button type="submit">Register</button>
              <div className="register-link">
                <p>Already have an account? <a style={{ cursor: 'pointer' }} onClick={loginLink}>Login</a></p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loginpage;

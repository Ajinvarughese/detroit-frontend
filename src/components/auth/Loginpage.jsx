import React, { useState } from 'react';
import axios from 'axios';
import './Loginpage.css';
<<<<<<< HEAD
import { FaUser, FaLock, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaBriefcase, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";
=======
import {
  FaUser, FaEnvelope, FaMapMarkerAlt,
  FaBuilding, FaPhone,
  FaEye, FaEyeSlash
} from "react-icons/fa";
import { saveUser } from '../hooks/LocalStorageUser';
>>>>>>> d390e6c7480d06271410a8c11490b6339cd8c4a2

const Loginpage = ({user}) => {
  const [showPass, setShowPass] = useState(false);
  const [action, setAction] = useState('');
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

  // Login Form Handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const data = { email: loginData.email, password: loginData.password };

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login success:', response.data);
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  // Forgot Password Form Handlers
  const handleForgotEmailChange = (e) => setForgotEmail(e.target.value);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    const data = { email: forgotEmail };

    try {
      const response = await axios.post('http://localhost:8080/api/user/forgot-password', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage('A password reset link has been sent to your email.');
      setError('');
    } catch (error) {
      setError('An error occurred, please try again.');
      setMessage('');
    }
  };

  // Registration Form Handlers
  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const data = {
      fullName: `${registerData.firstName} ${registerData.lastName}`,
      phone: registerData.phone,
      email: registerData.email,
      password: registerData.password,
      address: registerData.address,
      role: user,
      organization: registerData.organization,
      subRole: registerData.role
    };

    console.log(data)

    try {
      const response = await axios.post('http://localhost:8080/api/user', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Registration success:', response.data);
      saveUser(response.data);
        
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
    }
  };

<<<<<<< HEAD
=======
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const role = window.location.pathname.split('/')[2].toUpperCase();
    const data = {
      email: loginData.email,
      password: loginData.password,
      role: role
    };
    console.log(data)
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', data, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Login success:', response.data);
      saveUser(response.data);
      window.location.href = '/';
    } catch (error) {
      alert("Error occured during log in");
      console.error('Login error:', error.response?.data || error.message);
    }
  };

>>>>>>> d390e6c7480d06271410a8c11490b6339cd8c4a2
  return (
    <div className="container">
      <div className={`wrapper ${action}`}>
        {/* Login Form */}
        {!isForgotPassword && !isRegistration && (
          <div className="form-box login">
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
                <div onClick={() => setShowPass(!showPass)} style={{ cursor: 'pointer' }}>
                  {showPass ? <FaEye className="icon" /> : <FaEyeSlash className="icon" />}
                </div>
              </div>

<<<<<<< HEAD
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" onClick={() => setIsForgotPassword(true)}>Forgot Password?</a>
              </div>

              <button type="submit">Login</button>
              <div className="register-link">
                <p>Don't have an account? <a href="#" onClick={() => setIsRegistration(true)}>Register</a></p>
              </div>
            </form>
          </div>
        )}

        {/* Forgot Password Form */}
        {isForgotPassword && (
          <div className="forgot-password-box">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="input-box">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                />
                <FaEnvelope className="icon" />
              </div>

              {message && <p className="success-message">{message}</p>}
              {error && <p className="error-message">{error}</p>}

              <button type="submit">Send OTP</button>
            </form>
            <p onClick={() => setIsForgotPassword(false)} className="back-to-login">Back to Login</p>
          </div>
        )}
=======
            <button type="submit">Login</button>
            <div className="register-link">
              <p>Don't have an account? <a style={{ cursor: 'pointer' }} onClick={registerLink}>Register</a></p>
            </div>
          </form>
        </div>
>>>>>>> d390e6c7480d06271410a8c11490b6339cd8c4a2

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

<<<<<<< HEAD
              <div className="input-box">
=======
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


            {
              user === "APPLICANT" ? 
              (
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
                      value={registerData.role}
                      onChange={handleRegisterChange}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="ENTERPRISE">Enterprise</option>
                      <option value="GOVERNMENT">Government</option>
                    </select>
                  </div>
                </>
              )
              :
                user == "BANK" &&  
                (
                <div className="input-box">
                  <select
                    name="role"
                    value={registerData.role}
                    onChange={handleRegisterChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="QUESTIONNAIRE_SERVICE">Questionnaire</option>
                    <option value="SF_SERVICE">Sustainable Finance</option>
                    <option value="RULE_SERVICE">Rule</option>
                  </select>
                  
                </div>
              )
              
            }

            <div className="remember-forgot">
              <label>
>>>>>>> d390e6c7480d06271410a8c11490b6339cd8c4a2
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

<<<<<<< HEAD
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
                <p>Already have an account? <a href="#" onClick={() => setIsRegistration(false)}>Login</a></p>
              </div>
            </form>
          </div>
        )}
=======
            <button type="submit">Register</button>
            <div className="register-link">
              <p>Already have an account? <a style={{ cursor: 'pointer' }} onClick={loginLink}>Login</a></p>
            </div>
          </form>
        </div>
>>>>>>> d390e6c7480d06271410a8c11490b6339cd8c4a2
      </div>
    </div>
  );
};

export default Loginpage

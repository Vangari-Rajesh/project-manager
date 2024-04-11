
import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for password visibility

const LR = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      console.log(response.data.message);
      // Handle successful login, such as redirecting to another page
    } catch (error) {
      console.error('Login failed:', error.response.data.error);
      // Handle login failure, such as displaying an error message
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', { username, password });
      console.log(response.data.message);
      // Handle successful registration, such as redirecting to login page
    } catch (error) {
      console.error('Registration failed:', error.response.data.error);
      // Handle registration failure, such as displaying an error message
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          <form>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <div className="input-group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="d-flex justify-content-center"> {/* Added container div */}
                <button
                type="submit"
                className="btn btn-primary btn-block mb-3"
                onClick={isLogin ? handleLogin : handleRegister}
                >
                {isLogin ? 'Login' : 'Register'}
                </button>
            </div>
            <p className="text-center">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span
                className="text-primary"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register here' : 'Login here'}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LR;



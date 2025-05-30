import React, { useContext } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { AuthContext } from './AuthContext';  


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const{login}=useContext(AuthContext);


  const checkLogin = async () => {
    const notyf = new Notyf({
      duration: 1000,
      position: {
        x: 'right',
        y: 'top',
      },
    });

    try {
      const response = await fetch('http://localhost:3003/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

      const data = await response.json();
      console.log("login data", data);

      if (response.ok) {
        const { token ,is_first_login } = data;
       login(token);
               
        const decodeToken = JSON.parse(atob(token.split('.')[1]));
        const role = decodeToken.role;

        console.log("Role", role);

        if (is_first_login) {
          notyf.success('Please change your password.');
          setTimeout(() => {
            navigate('employee/change-password'); 
          }, 1000);
          return; 
        }

        if (role == 'Hr') {
          notyf.success('Login in successfully!')
          setTimeout(() => {
            navigate('/dashboard/userdashboard');
          }, 1000);
        } else {
          notyf.success('Login in successfully!');
          setTimeout(() => {
            navigate('/dashboard/userdashboard');
          }, 1000);
        }
      } else {
        notyf.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      notyf.error('Something went wrong.');
    }
  };


  return (
    <section className='login-container'>
      <div className="login-form">
        <h2>Login</h2>
        <div className="email-input">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <br /><br />
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
          </span>
        </div>
        <br /><br />
        <button onClick={checkLogin}>Login</button>
      </div>
    </section>
  )
}
export default Login;
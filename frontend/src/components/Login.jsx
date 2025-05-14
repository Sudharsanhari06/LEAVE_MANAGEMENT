import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const checkLogin = async () => {
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
        console.log("data",data);
        // console.log("hr",data);
  
        if (response.ok) {
          const{token}=data;
          localStorage.setItem('token', token);
          const decodeToken=JSON.parse(atob(token.split('.')[1]));
          const role=decodeToken.role
          if(role=='Hr'){
            alert('Hr is login');
            navigate('/employees');
          }else{
            alert('Login successful!');
            navigate('/dashboard');
          }
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Something went wrong');
      }
    };


  return (
    <section className='login-container'>

    <div className="login-form">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />
      <button onClick={checkLogin}>Login</button>
      </div>
    </section>
  )
}
export default Login;


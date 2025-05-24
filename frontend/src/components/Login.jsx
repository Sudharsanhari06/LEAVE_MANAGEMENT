import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });




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
      console.log("data", data);
      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token);
        const decodeToken = JSON.parse(atob(token.split('.')[1]));
        const role = decodeToken.role;

        console.log("Role", role);
        if (role == 'Hr') {
          alert('Hr is login');
          navigate('/dashboard');
        } else {
          // alert('Login successful!');
          Toast.fire({
            icon: "success",
            title: "Signed in successfully"
          });
          navigate('/dashboard/userdashboard');

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


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const notyf = new Notyf({
        duration: 1000,
        position: {
            x: 'center',
            y: 'top',
        }
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3003/employee/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                notyf.success('Password changed successfully!');
                setTimeout(() => {
                    navigate('/dashboard/userdashboard');
                }, 1000);
            } else {
                notyf.error('Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
        }
    };

    return (
        <section className='password-container'>
            <div className="change-password">
                <h2>Change Your Password</h2>
                <form onSubmit={handleSubmit} className="change-password-form">
                    <div className='password'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                        </span>

                    </div>
                    <div className='password'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fa-regular fa-eye-slash"></i> : <i className="fa-regular fa-eye"></i>}
                        </span>
                    </div>
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </section>
    );
};

export default ChangePassword;

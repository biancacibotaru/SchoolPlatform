import React, { useState, useEffect } from "react";
import './LoginSignup.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errorMessage, setErrorMessage] = useState('');

    const setLoginCookies = (userData) => {
        const userDataJSON = JSON.stringify(userData); 
        Cookies.set('loggedIn', userDataJSON, { expires: 0.0208 });
    };

    const clearLoginCookies = () => {
        Cookies.remove('loggedIn');
    };

    const handleInactive = () => {
        clearLoginCookies();
    };

    const resetTimer = () => {
        clearTimeout(window.inactivityTimer);
        window.inactivityTimer = setTimeout(handleInactive, 30 * 60 * 1000);
    };

    useEffect(() => {
        const handleResetTimer = () => {
            clearTimeout(window.inactivityTimer);
            resetTimer();
        };

        const handleActivity = () => {
            handleResetTimer();
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('mousedown', handleActivity);
        window.addEventListener('keypress', handleActivity);

        resetTimer();

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('mousedown', handleActivity);
            window.removeEventListener('keypress', handleActivity);
            clearTimeout(window.inactivityTimer);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        resetTimer();
    };

    
    const handleSubmit = async () => {
        if (!formData.email || !formData.password) {
            setErrorMessage("Please enter your credentials.");
        } else {
            try {
                const { email, password } = formData;
                const response = await fetch(`http://localhost:5271/api/user/getuserbycredentials`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
    
                if (response.ok) {
                    const userData = await response.json();
                    console.log(userData);
                    if (userData.Type === 'student') {
                        try {
                            const classResponse = await fetch(`http://localhost:5271/api/userclass/getstudentclass/${userData.Id}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
    
                            if (classResponse.ok) {
                                const studentClassName = await classResponse.text();
                                userData.Class = studentClassName;
                            } else {
                                console.error('Error fetching student class:', classResponse.statusText);
                                setErrorMessage("Error fetching student class.");
                                return;
                            }
                        } catch (error) {
                            console.error('Error fetching student class:', error);
                            setErrorMessage("Error fetching student class.");
                            return;
                        }
                    }
                    
                    setLoginCookies(userData);
                   
                    if (userData.Type === 'student' && userData.Class) {
                        navigate('/student-courses');
                    } else if(userData.Type === 'student' && !userData.Class){
                        navigate('/student-join-class');
                    }
                    else if (userData.Type === 'admin') {
                        navigate('/admin-classes-list');
                    }
                    else if (userData.Type === 'teacher') {
                        navigate('/teacher-courses-list');
                    }
                } else {
                    const errorMessage = await response.text();
                    console.error(errorMessage);
                    setErrorMessage("Incorrect email or password.");
                }
            } catch (error) {
                console.error('Auth error:', error);
            }
        }
    };
     

    const handleLogout = () => {
        clearLoginCookies();
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">Login</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <FaEnvelope className="picture" />
                    <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
                </div>
                <div className="input">
                    <FaLock className="picture" />
                    <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} />
                </div>
            </div>
            <div className="submit-container">
                <div className="submit" onClick={handleSubmit}>Login</div>
            </div>
            {errorMessage && <p className="login-error">{errorMessage}</p>}
            <div className="signup-link">
                Don't have an account? <Link to="/signup">Register</Link>
            </div>
        </div>
    );
};

export default Login;

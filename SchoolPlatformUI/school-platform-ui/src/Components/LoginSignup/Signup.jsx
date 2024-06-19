import React, { useState } from "react";
import './LoginSignup.css';
import { FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const { firstName, lastName, email, password, confirmPassword } = formData;
            const errorsCopy = { ...errors };

            for (const key in errorsCopy) {
                errorsCopy[key] = '';
            }

            if (!firstName.trim()) {
                errorsCopy.firstName = 'First name is required';
            }
            if (!lastName.trim()) {
                errorsCopy.lastName = 'Last name is required';
            }

            if (!email.trim()) {
                errorsCopy.email = 'Email is required';
            } else if (!isValidEmail(email)) {
                errorsCopy.email = 'Invalid email format';
            }

            if (!password.trim()) {
                errorsCopy.password = 'Password is required';
            } else if (password.length < 8) {
                errorsCopy.password = 'Password must be at least 8 characters long';
            } else if (!containsLetterAndNumber(password)) {
                errorsCopy.password = 'Password must contain at least one letter and one number';
            } else if (password !== confirmPassword) {
                errorsCopy.confirmPassword = 'Passwords do not match';
            }

            setErrors(errorsCopy);

            if (!Object.values(errorsCopy).some(error => error)) {
                const response = await fetch('http://localhost:5271/api/user/insertuser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: 0,
                        email,
                        password,
                        hashedPassword: '',
                        firstName,
                        lastName,
                        type: 'student' 
                    })
                });
                if (response.ok) {
                    setShowSuccessPopup(true);
                    console.log('Registration successful');
                } else {
                    const errorMessage = await response.text(); 
                    setErrorMessage(errorMessage);
                    console.error('Error during registration:', errorMessage);
                }
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const containsLetterAndNumber = (password) => {
        const letterRegex = /[a-zA-Z]/;
        const numberRegex = /\d/;
        return letterRegex.test(password) && numberRegex.test(password);
    };

    return (
        <div className='container'>
            <div className="header">
                <div className="text">Sign up</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <FaUser className="picture" />
                    <input type="text" name="firstName" value={formData.firstName} placeholder="First Name" onChange={handleChange} />
                </div>
                {errors.firstName && <span className="error">{errors.firstName}</span>}
                <div className="input">
                    <FaUser className="picture" />
                    <input type="text" name="lastName" value={formData.lastName} placeholder="Last Name" onChange={handleChange} />
                </div>
                {errors.lastName && <span className="error">{errors.lastName}</span>}
                <div className="input">
                    <FaEnvelope className="picture" />
                    <input type="email" name="email" value={formData.email} placeholder="Email" onChange={handleChange} />
                </div>
                {errors.email && <span className="error">{errors.email}</span>}
                <div className="input">
                    <FaLock className="picture" />
                    <input type="password" name="password" value={formData.password} placeholder="Password" onChange={handleChange} />
                </div>
                {errors.password && <span className="error">{errors.password}</span>}
                <div className="input">
                    <FaLock className="picture" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} placeholder="Confirm Password" onChange={handleChange} />
                </div>
                {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
            </div>
            <div className="submit-container">
                {!showSuccessPopup && (
                    <div className="submit" onClick={handleSubmit}>Register</div>
                )}
            </div>
            <div className="signup-link">
                Already have an account? <Link to="/login">Login</Link>
            </div>
            {showSuccessPopup && (
                <div className="popup">
                    <p>Registration successful!</p>
                    <Link to="/login">
                        <button onClick={() => setShowSuccessPopup(false)}>OK</button>
                    </Link>
                </div>
            )}
            {errorMessage && (
                <div className="error">
                    {errorMessage}
                </div>
            )}
        </div>
    );
};

export default SignupPage;

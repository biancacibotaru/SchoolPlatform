import React, { useState, useEffect } from "react";
import './slidebar.scss'
import { useLocation } from "react-router";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import SchoolIcon from '../Assets/school.png';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [closeMenu, setCloseMenu] = useState(false);
    const [userData, setUserData] = useState({});
    const [hasFutureExams, setHasFutureExams] = useState(false);
    const [hasFutureHomeworks, setHasFutureHomeworks] = useState(false);

    useEffect(() => {
        const getUserDataFromCookie = () => {
            const userDataFromCookie = Cookies.get('loggedIn');
            if (userDataFromCookie) {
                setUserData(JSON.parse(userDataFromCookie));
            }
        };

        const checkForFutureExams = async (classCode) => {
            try {
                const response = await fetch(`http://localhost:5271/api/Exam/CheckIfFutureExamsByClass?classCode=${classCode}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHasFutureExams(data); 
            } catch (error) {
                console.error('Error checking for future exams:', error);
            }
        };

        const checkForFutureHomeworks = async (classCode, studentId) => {
            try {
                const response = await fetch(`http://localhost:5271/api/Homework/CheckIfFutureHomeworksByClass?classCode=${classCode}&studentId=${studentId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHasFutureHomeworks(data); 
            } catch (error) {
                console.error('Error checking for future exams:', error);
            }
        };

        getUserDataFromCookie();

        if (userData.Class) {
            checkForFutureExams(userData.Class);
            checkForFutureHomeworks(userData.Class, userData.Id);
        }
    }, [userData.Class, userData.Id]);

    const handleCloseMenu = () => {
        setCloseMenu(!closeMenu);
    };

    const handleLogout = () => {
        Cookies.remove('loggedIn');
        navigate('/login'); 
    };

    return (
        <div className={closeMenu === false ? "sidebar" : "sidebar active"}>
            <div className={closeMenu === false ? "logoContainer" : "logoContainer active"}>
                <img src={SchoolIcon} alt="icon" />
                <h2 className="title">School Platform</h2>
            </div>
            <div className={closeMenu === false ? "burgerContainer" : "burgerContainer active"}>
                <div className="burgerTrigger" onClick={() => { handleCloseMenu(); }}></div>
                <div className="burgerMenu"></div>
            </div>
            <div className={closeMenu === false ? "profileContainer" : "profileContainer active"}>
                <div className="profileContents">
                    <p className="name">Hello, {userData.Firstname} 👋</p>
                    <p>{userData.Email}</p>
                </div>
            </div>
            {userData.Type === "student" && userData.Class ? (
                <div className={closeMenu === false ? "contentsContainer" : "contentsContainer active"}>
                    <ul>
                        <li className={location.pathname === "/student-courses" ? "active" : ""}><a href="student-courses">Courses</a></li>
                        <li className={location.pathname === "/student-grades" ? "active" : ""}><a href="student-grades">Grades</a></li>
                        <li className={location.pathname === "/student-exams" ? "active" : ""}><a href="student-exams">Exams {hasFutureExams && <span className="alert-icon">!</span>}</a></li>
                        <li className={location.pathname === "/student-homeworks" ? "active" : ""}><a href="student-homeworks">Homeworks {hasFutureHomeworks && <span className="alert-icon">!</span>}</a></li>
                        <li className="logout" onClick={handleLogout}>
                            <button>
                                <FaSignOutAlt className="logoutIcon" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            ) : userData.Type === "student" && userData.Class === "" ? (
                <div className={closeMenu === false ? "contentsContainer" : "contentsContainer active"}>
                    <ul>
                        <li className={location.pathname === "/student-join-class" ? "active" : ""}><a href="student-choose-class">Join in a class</a></li>
                        <li className="logout" onClick={handleLogout}>
                            <button>
                                <FaSignOutAlt className="logoutIcon" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            ) : userData.Type === "admin" ? (
                <div className={closeMenu === false ? "contentsContainer" : "contentsContainer active"}>
                    <ul>
                        <li className={location.pathname === "/admin-classes-list" ? "active" : ""}><a href="admin-classes-list">Classrooms</a></li>
                        <li className={location.pathname === "/admin-teachers-list" ? "active" : ""}><a href="admin-teachers-list">Teachers</a></li>
                        <li className={location.pathname === "/admin-subjects-list" ? "active" : ""}><a href="admin-subjects-list">Subjects</a></li>
                        <li className={location.pathname === "/admin-join-requests-list" ? "active" : ""}><a href="admin-join-requests-list">Join Requests</a></li>
                        <li className="logout" onClick={handleLogout}>
                            <button>
                                <FaSignOutAlt className="logoutIcon" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            ) : userData.Type === "teacher" ? (
                <div className={closeMenu === false ? "contentsContainer" : "contentsContainer active"}>
                    <ul>
                        <li className={location.pathname === "/teacher-courses-list" ? "active" : ""}><a href="teacher-courses-list">Courses</a></li>
                        <li className="logout" onClick={handleLogout}>
                            <button>
                                <FaSignOutAlt className="logoutIcon" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            ) : null}
        </div>
    );
};

export default Sidebar;

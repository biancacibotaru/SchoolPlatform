import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './coursePages.css';

const GradePage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const subjectId = queryParams.get('id');
    const [studentId, setStudentId] = useState(null);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentId = () => {
            const userDataFromCookie = Cookies.get('loggedIn');
            if (userDataFromCookie) {
                const userData = JSON.parse(userDataFromCookie);
                setStudentId(userData.Id);
            }
        };

        fetchStudentId();
    }, []);

    useEffect(() => {
        if (subjectId && studentId) {
            fetchGrades(subjectId, studentId);
        }
    }, [subjectId, studentId]);

    const fetchGrades = async (subjectId, studentId) => {
        try {
            const response = await fetch(`http://localhost:5271/api/Grade/GetGradesBySubjectAndStudent?subjectId=${subjectId}&studentId=${studentId}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setGrades(data);
        } catch (error) {
            console.error('Error fetching grades:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="content-course">
            <h1 className="title">Grades</h1>
            {grades.length === 0 ? (
                <h2 className='no-items-with-space'>No grades yet.</h2>
            ) : (
                <table className="grades-table">
                    <thead>
                        <tr>
                            <th>Grade</th>
                            <th>Grade For</th>
                            <th>Homework/Exam Title</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((grade, index) => (
                            <tr key={index}>
                                <td>{grade.Points.toFixed(2)}</td>
                                <td>{grade.GradeFor}</td>
                                <td>{grade.HomeworkTitle ? grade.HomeworkTitle : grade.ExamTitle}</td>
                                <td>{grade.GradeDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GradePage;

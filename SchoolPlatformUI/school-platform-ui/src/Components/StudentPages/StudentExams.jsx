import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const StudentExams = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const userDataFromCookie = Cookies.get('loggedIn');
                const userData = JSON.parse(userDataFromCookie);
                const classCode = userData.Class; 
                const response = await fetch(`http://localhost:5271/api/Exam/GetFutureExamsByClass?classCode=${classCode}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setExams(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="content-course">
            <h1 className="title">Future Exams</h1>
            {exams.length === 0 ? (
                <h2 className='no-items-with-space'>No future exams.</h2>
            ) : (
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Title</th>
                        <th>Duration (min)</th>
                        <th>Start Date</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map((exam, index) => (
                        <tr key={index}>
                            <td>{exam.Description}</td>
                            <td>{exam.Title}</td>
                            <td>{exam.Duration}</td>
                            <td>{exam.StartedOn}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    );
};

export default StudentExams;

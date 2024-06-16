import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const StudentHomeworks = () => {
    const [homeworks, setHomework] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHomeworks = async () => {
            try {
                const userDataFromCookie = Cookies.get('loggedIn');
                const userData = JSON.parse(userDataFromCookie);
                const classCode = userData.Class; 
                const studentId = userData.Id; 
                const response = await fetch(`http://localhost:5271/api/Homework/GetFutureHomeworksByClass?classCode=${classCode}&studentId=${studentId}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setHomework(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeworks();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="content-course">
            <h1 className="title">TO DO Homeworks</h1>
            {homeworks.length === 0 ? (
                <h2 className='no-items-with-space'>No homeworks to do.</h2>
            ) : (
            <table>
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Title</th>
                        <th>Start Date</th>
                        <th>Deadline</th>
                    </tr>
                </thead>
                <tbody>
                    {homeworks.map((homework, index) => (
                        <tr key={index}>
                            <td>{homework.Description}</td>
                            <td>{homework.Title}</td>
                            <td>{homework.StartDate}</td>
                            <td>{homework.Deadline}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    );
};

export default StudentHomeworks;

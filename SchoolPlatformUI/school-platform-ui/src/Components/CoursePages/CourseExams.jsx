import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './coursePages.css';

const CourseExams = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [examStatuses, setExamStatuses] = useState({});
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        // Assuming studentId is stored in Cookies
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
        const fetchExams = async () => {
            if (!id || !studentId) return;

            try {
                const response = await fetch(`http://localhost:5271/api/Exam/GetAllExamsBySubjectForStudent/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setExams(data);

                const statusPromises = data.map(exam =>
                    fetch(`http://localhost:5271/api/Exam/GetStudentExamStatus/${exam.Id}?studentId=${studentId}`)
                        .then(res => res.json())
                        .catch(() => null) // Handle error by returning null
                );

                const statuses = await Promise.all(statusPromises);
                const statusMap = {};
                data.forEach((exam, index) => {
                    statusMap[exam.Id] = statuses[index];
                });

                setExamStatuses(statusMap);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [id, studentId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="content-course">
            <h1 className="title">Course Exams</h1>
            {exams.length === 0 ? (
                <h2 className='no-items-with-space'>No exams yet.</h2>
            ) : (
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Duration (min)</th>
                            <th>Started on</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, index) => {
                            const startTime = new Date(exam.StartedOn).getTime();
                            const endTime = startTime + exam.Duration * 60000;
                            const currentTime = new Date().getTime();
                            const status = examStatuses[exam.Id];

                            return (
                                <tr key={index}>
                                    <td>{exam.Title}</td>
                                    <td>{exam.Description}</td>
                                    <td>{exam.Duration}</td>
                                    <td>{exam.StartedOn}</td>
                                    <td>
                                        {currentTime < startTime ? (
                                            <span>Not started yet</span>
                                        ) : currentTime > endTime ? (
                                            status ? (
                                                <Link to={`/view-exam-result-for-student?id=${exam.Id}`} style={{ textDecoration: 'none' }}>
                                                    View results
                                                </Link>
                                            ) : (
                                                <span>Missed exam</span>
                                            )
                                        ) : status ? (
                                            <Link to={`/view-exam-result-for-student?id=${exam.Id}`} style={{ textDecoration: 'none' }}>
                                                View results
                                            </Link>
                                        ) : (
                                            <Link to={`/view-exam-for-student?id=${exam.Id}&subjectId=${id}`} style={{ textDecoration: 'none' }}>
                                                Start exam
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CourseExams;

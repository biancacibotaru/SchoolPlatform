import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './coursePages.css';

const CourseExamsForTeacher = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            if (!id) return;

            try {
                const response = await fetch(`http://localhost:5271/api/Exam/GetAllExamsBySubject/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setExams(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [id]);

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const isExamCompleted = (exam) => {
        if (exam.State === 'published') {
            const currentDate = new Date();
            const examStartDate = new Date(exam.StartedOn);
            const examDuration = exam.Duration * 60000; // Durata examenului în milisecunde
            return examStartDate.getTime() + examDuration < currentDate.getTime();
        }
        return false;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="content-course">
            <h1 className="title">Course Exams</h1>
            <Link to={`/configure-exam?subjectId=${id}`} className="new-exam-button">
                + New Exam
            </Link>
            {exams.length > 0 ? (
                <table className="exam-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Duration (min)</th>
                            <th>Started on</th>
                            <th>State</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, index) => (
                            <tr key={index}>
                                <td>{exam.Title}</td>
                                <td>{exam.Description}</td>
                                <td>{exam.Duration}</td>
                                <td>{exam.StartedOn}</td>
                                <td>{exam.State}</td>
                                <td>
                                    {exam.State === 'draft' ? (
                                        <Link className='exam-btns' to={`/configure-exam?id=${exam.Id}&subjectId=${id}`}>
                                            Edit
                                        </Link>
                                    ) : (
                                        <Link className='exam-btns' to={`/view-exam-for-teacher?id=${exam.Id}&subjectId=${id}`}>
                                            View exam
                                        </Link>
                                    )}
                                </td>
                                <td>
                                    {isExamCompleted(exam) && (
                                        <Link className='exam-btns' to={`/exam-students-results?id=${exam.Id}&subjectId=${id}`}>
                                            View results
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <h2 className='no-items'>No exams yet.</h2>
            )}
        </div>
    );
};

export default CourseExamsForTeacher;

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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="content-course">
            <h1 className="title">Course Exams</h1>
            <Link to={`/configure-exam?subjectId=${id}`} className="add-exam-button">
                + Add New Exam
            </Link>
            <table className="exam-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Duration</th>
                        <th>Started on</th>
                        <th>State</th>
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
                                {exam.State == 'draft' ? 
                                <Link to={`/configure-exam?id=${exam.Id}&subjectId=${id}`} style={{ textDecoration: 'none' }}>
                                    Edit
                                </Link> :  
                                <Link to={`/view-exam-for-teacher?id=${exam.Id}&subjectId=${id}`} style={{ textDecoration: 'none' }}>
                                    View exam
                                </Link>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseExamsForTeacher;

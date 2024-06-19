import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ExamResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const subjectId = queryParams.get('subjectId');
    const navigate = useNavigate();

    const fetchExamResults = async () => {
        try {
            const response = await fetch(`http://localhost:5271/api/Exam/GetExamResultsForAllStudents?examId=${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setResults(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExamResults();
    }, [id]); 

    const handleInsertGradesForAbsentStudents = async () => {
        try {
            const response = await fetch(`http://localhost:5271/api/Exam/InsertExamGradeForAbsentStudents?examId=${id}&subjectId=${subjectId}`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to insert grades for absent students');
            }
            
            fetchExamResults();

            window.alert('Grades for absent students have been inserted.');
            navigate(`/course-exams-for-teacher?id=${subjectId}`);
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='content-course'>
            <h2 className='title'>Exam Results for All Students</h2>
            <button className="insert-grade-exam" onClick={handleInsertGradesForAbsentStudents}>Insert Grades for Absent Students</button>
            {results.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Total Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.Firstname} {result.Lastname}</td>
                                <td>{result.Email}</td>
                                <td>{result.TotalPoints == null ? 'Absent' : result.TotalPoints.toFixed(2)} {result.Status === "Cheating" ? '(Cheating)' : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No results available.</p>
            )}
        </div>
    );
};

export default ExamResults;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table } from 'reactstrap';
import './coursePages.css';

const HomeworkSubmission = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [studentHomework, setStudentHomework] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStudentHomework = async () => {
        try {
            const response = await fetch(`http://localhost:5271/api/Homework/GetStudentsHomework/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch student homework');
            }
            const data = await response.json();
            setStudentHomework(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching student homework:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudentHomework();
    }, [id]);

    const handleGradeUpdate = async (homework, isWithUpdate) => {
        const newGrade = prompt('Enter the grade:');
        if (newGrade !== null) {
            try {
                const response = await fetch('http://localhost:5271/api/Homework/UpdateGradeForHomework', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        id: homework.Id,
                        grade: newGrade,
                        subjectId: homework.SubjectId,
                        studentId: homework.StudentId,
                        homeworkId: homework.HomeworkId,
                        withUpdate: isWithUpdate
                    })
                });
                if (!response.ok) {
                    throw new Error('Failed to update grade');
                }
                // Refresh the homework list after successful update
                fetchStudentHomework();
            } catch (error) {
                console.error('Error updating grade:', error);
                // Handle error
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="content-course">
            <h1 className='title'>Student Homework Submissions</h1>
            <br />
            {studentHomework.length == 0 ? (
                <h2 className='no-items'>No submissions yet.</h2>
            ) : (
                <Table className='table-submissions' bordered>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Email</th>
                            <th>Homework</th>
                            <th>Submission Date</th>
                            <th>Grade</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentHomework.map((homework, index) => (
                            <tr key={index}>
                                <td className="student-name">{homework.FirstName} {homework.LastName}</td>
                                <td>{homework.Email}</td>
                                <td className="homework-file">
                                    {homework.FileName ? (
                                        <a className="download-button" href={`data:${homework.ContentType};base64,${homework.Content}`} download={homework.FileName}>
                                            👁️{homework.FileName}
                                        </a>
                                    ) : (
                                        'No file'
                                    )}
                                </td>
                                <td>{new Date(homework.SubmitDate).toLocaleString()}</td>
                                <td>
                                    {homework.Grade ? (
                                        homework.Grade
                                    ) : (
                                        <p>-</p>
                                    )}
                                </td>
                                {homework.Grade ?
                                    (<td><button className='grade-button' onClick={() => handleGradeUpdate(homework, true)}>Update</button></td>) :
                                    (<td><button className='grade-button' onClick={() => handleGradeUpdate(homework, false)}>Grade</button></td>)}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default HomeworkSubmission;

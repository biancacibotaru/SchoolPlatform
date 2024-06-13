import React, { useState, useEffect } from 'react';
import './coursePages.css';

const StudentHomeworkPopup = ({ isOpen, toggle, homeworkId }) => {
    const [studentHomework, setStudentHomework] = useState(null);

    useEffect(() => {
        const fetchStudentHomework = async () => {
            try {
                const response = await fetch(`http://localhost:5271/api/Homework/GetStudentHomework/${homeworkId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch student homework');
                }
                const data = await response.json();
                setStudentHomework(data);
            } catch (error) {
                console.error('Error fetching student homework:', error);
            }
        };

        if (isOpen && homeworkId) {
            fetchStudentHomework();
        }
    }, [isOpen, homeworkId]);

    return (
        <div className={`overlay ${isOpen ? 'visible' : ''}`} onClick={toggle}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
                <h2>Student Homework Details</h2>
                {studentHomework && (
                    <>
                        <p><strong>Student ID:</strong> {studentHomework.StudentId}</p>
                        <p><strong>Homework ID:</strong> {studentHomework.HomeworkId}</p>
                        <p><strong>File Content ID:</strong> {studentHomework.FileContentId}</p>
                        <p><strong>Submit Date:</strong> {studentHomework.SubmitDate}</p>
                        <p><strong>Grade:</strong> {studentHomework.Grade}</p>
                        <p><strong>Comments:</strong> {studentHomework.Comments}</p>
                    </>
                )}
                <button onClick={toggle}>Close</button>
            </div>
        </div>
    );
};

export default StudentHomeworkPopup;

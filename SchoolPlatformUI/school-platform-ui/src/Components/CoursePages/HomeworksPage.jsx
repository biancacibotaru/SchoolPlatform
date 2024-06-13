import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import './coursePages.css';

const HomeworksPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [studentId, setStudentId] = useState(null);
    const [file, setFile] = useState(null);
    const [homeworks, setHomeworks] = useState([]);
    const [showUploadSection, setShowUploadSection] = useState({});

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
        if (studentId) {
            fetchHomeworksForStudent();
        }
    }, [studentId]);

    const fetchHomeworksForStudent = async () => {
        try {
            const response = await fetch(`http://localhost:5271/api/Homework/GetHomeworksForStudentBySubject/${id}?studentId=${studentId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch homeworks');
            }
            const data = await response.json();
            setHomeworks(data);
        } catch (error) {
            console.error('Error fetching homeworks:', error);
        }
    };

    const handleStudentInputChange = (e) => {
        const { files } = e.target;
        setFile(files[0]);
    };

    const handleStudentFormSubmit = async (e, homeworkId) => {
        e.preventDefault();

        const currentDate = new Date();
        const formattedDateTime = currentDate.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        const formData = new FormData();
        formData.append('studentId', studentId);
        formData.append('homeworkId', homeworkId);
        formData.append('submitDate', formattedDateTime);
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:5271/api/Homework/InsertStudentHomework', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit homework');
            }

            fetchHomeworksForStudent();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleUploadSection = (homeworkId) => {
        setShowUploadSection(prevState => ({
            ...prevState,
            [homeworkId]: !prevState[homeworkId]
        }));
    };

    const isWithinDeadline = (startDate, endDate) => {
        const currentDate = new Date();
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        return startDateObj <= currentDate && currentDate <= endDateObj;
    };

    const isPastDeadline = (endDate) => {
        const currentDate = new Date();
        const endDateObj = new Date(endDate);

        return currentDate > endDateObj;
    };

    const isFutureStartDate = (startDate) => {
        const currentDate = new Date();
        const startDateObj = new Date(startDate);

        return currentDate < startDateObj;
    };

    return (
        <div className="content-course">
            <h1 className='title'>Homeworks</h1>
            <div className="homeworks-list">
                {homeworks.map((homework, index) => (
                    <div key={index} className="homework-item">
                        <div className="homework-header">
                            <h2>{homework.Title}</h2>
                            {isFutureStartDate(homework.StartDate) && (
                                <p className="submission-alert">The homework can be loaded in the future</p>
                            )}
                        </div>
                        <hr />
                        <p>TO DO: {homework.Description}</p>
                        <p>
                            <a className="homework-requirement" href={`data:${homework.HomeworkFileContent};base64,${homework.HomeworkFileName}`} download={homework.HomeworkFileName}>
                                📎{homework.HomeworkFileName}
                            </a>
                        </p>
                        <p>Start Date: {homework.StartDate}</p>
                        <p>End Date: {homework.Deadline}</p>
                        {isFutureStartDate(homework.StartDate) ? (
                            null
                        ) : homework.SubmitDate ? (
                            <div>
                                {homework.Grade ?
                                    (<p className="submission-alert">Grade: {homework.Grade}</p>) :
                                    (<p className="submission-alert">Submitted for grading</p>)
                                }
                                <hr />
                                <p>Submitted on: {homework.SubmitDate}</p>
                                {homework.StudentHomeworkFileName && (
                                    <p>
                                        <a className="homework-solved" href={`data:${homework.StudentHomeworkFileContent};base64,${homework.StudentHomeworkFileName}`} download={homework.StudentHomeworkFileName}>
                                            📝 {homework.StudentHomeworkFileName}
                                        </a>
                                    </p>

                                )}
                            </div>
                        ) : (
                            <>
                                {isWithinDeadline(homework.StartDate, homework.Deadline) ? (
                                    <>
                                        <p className="submission-alert">TO DO!</p>
                                        <Button className="button-view-teacher-homework" onClick={() => toggleUploadSection(homework.HomeworkId)}>⬆️ Upload Homework</Button>
                                        {showUploadSection[homework.HomeworkId] && (
                                            <Form onSubmit={(e) => handleStudentFormSubmit(e, homework.HomeworkId)} className="upload-form">
                                                <FormGroup>
                                                    <Label for={`studentFile-${index}`}>Browse File</Label>
                                                    <Input type="file" name="file" id={`studentFile-${index}`} onChange={handleStudentInputChange} required />
                                                </FormGroup>
                                                <Button type="submit" className='submit-homework'>Submit</Button>
                                            </Form>
                                        )}
                                    </>
                                ) : (
                                    isPastDeadline(homework.Deadline) && (
                                        <p className="submission-alert">Homework has not been submitted!</p>
                                    )
                                )}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworksPage;

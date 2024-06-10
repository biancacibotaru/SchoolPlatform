import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import './coursePages.css';

const HomeworksPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [showAddSection, setShowAddSection] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: ''
    });
    const [file, setFile] = useState(null);
    const [homeworks, setHomeworks] = useState([]);
    const [showUploadSection, setShowUploadSection] = useState({});

    useEffect(() => {
        fetchHomeworks();
    }, []);

    const fetchHomeworks = async () => {
        try {
            const response = await fetch(`http://localhost:5271/api/Homework/GetHomeworksBySubject/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch homeworks');
            }
            const data = await response.json();
            setHomeworks(data);
        } catch (error) {
            console.error('Error fetching homeworks:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setFile(files[0]);
        } else {
            setNewMaterial({ ...newMaterial, [name]: value });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', newMaterial.title);
        formData.append('description', newMaterial.description);
        formData.append('startDate', newMaterial.startDate);
        formData.append('endDate', newMaterial.endDate);
        formData.append('subjectId', id);
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5271/api/Homework/InsertStudentHomework', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to add homework');
            }

            setShowAddSection(false);
            fetchHomeworks();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleAddSection = () => {
        setShowAddSection(!showAddSection);
    };

    const handleStudentInputChange = (e) => {
        const { name, files } = e.target;
        setFile(files[0]);
    };

    const handleStudentFormSubmit = async (e, homeworkId) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);
        formData.append('homeworkId', homeworkId);

        try {
            const response = await fetch('http://localhost:5271/api/Homework/SubmitStudentHomework', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit homework');
            }

            fetchHomeworks();
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

    return (
        <div className="content-course">
            <h1>Homeworks</h1>
            <div className="homeworks-list">
                {homeworks.map((homework, index) => (
                    <div key={index} className="homework-item">
                        <h2>{homework.Title}</h2>
                        <p>{homework.Description}</p>
                        <p>Start Date: {new Date(homework.StartDate).toLocaleDateString()}</p>
                        <p>End Date: {new Date(homework.Deadline).toLocaleDateString()}</p>
                        {homework.Submitted && <p>Submitted</p>}
                        {!homework.Submitted && !homework.FileName && new Date(homework.StartDate) <= new Date() && (
                            <>
                                <Button color="primary" onClick={() => toggleUploadSection(homework.Id)}>Submit Homework</Button>
                                {showUploadSection[homework.Id] && (
                                    <Form onSubmit={(e) => handleStudentFormSubmit(e, homework.Id)} className="upload-form">
                                        <FormGroup>
                                            <Label for={`studentFile-${index}`}>Browse File</Label>
                                            <Input type="file" name="file" id={`studentFile-${index}`} onChange={handleStudentInputChange} required />
                                        </FormGroup>
                                        <Button type="submit" color="primary">Submit</Button>
                                    </Form>
                                )}
                            </>
                        )}
                        {homework.FileName && (
                            <p>
                                <a href={`data:${homework.ContentType};base64,${homework.Content}`} download={homework.FileName}>
                                    Download {homework.FileName}
                                </a>
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworksPage;
import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import './coursePages.css';

const HomeworksPageForTeacher = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const navigate = useNavigate();

    const [showAddSection, setShowAddSection] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0], 
        endDate: ''
    });
    const [file, setFile] = useState(null);
    const [homeworks, setHomeworks] = useState([]);

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
            const response = await fetch('http://localhost:5271/api/Homework/InsertHomework', {
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

    const handleViewSubmissions = (homeworkId) => {
        navigate(`/view-homework-submissions?id=${homeworkId}`);
    };

    return (
        <div className="content-course">
            <h1 className='title'>Homeworks</h1>
            {showAddSection && (
                <Form className="form-homework" onSubmit={handleFormSubmit}>
                    <FormGroup>
                        <Label className="label-homework" for="title">Title</Label>
                        <Input className="input-homework" type="text" name="title" id="title" value={newMaterial.title} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label className="label-homework" for="description">Description</Label>
                        <Input className="textarea-homework" type="textarea" name="description" id="description" value={newMaterial.description} onChange={handleInputChange} required />
                    </FormGroup>
                    <div className="form-dates">
                        <FormGroup className="form-group">
                            <Label className="label-homework" for="startDate">Start Date</Label>
                            <Input className="datetime-homework" type="datetime-local" name="startDate" id="startDate" value={newMaterial.startDate} onChange={handleInputChange} required />
                        </FormGroup>
                        <FormGroup className="form-group">
                            <Label className="label-homework" for="endDate">End Date</Label>
                            <Input className="datetime-homework" type="datetime-local" name="endDate" id="endDate" value={newMaterial.endDate} onChange={handleInputChange} required />
                        </FormGroup>
                    </div>
                    <FormGroup>
                        <Label className="label-homework" for="file">File</Label>
                        <Input className="file-homework" type="file" name="file" id="file" onChange={handleInputChange} />
                    </FormGroup>
                    <Button className="button-homework" type="submit" color="primary">Submit</Button>
                </Form>
            )}
            <Button className="new-material-button" color="primary" onClick={toggleAddSection}>{showAddSection ? 'Cancel' : '+ New Homework'}</Button>

            <div className="homeworks-list">
                {homeworks.length == 0 ? (
                    <h2 className='no-items'>No homeworks yet.</h2>
                ) : (<p></p>)}
                {homeworks.map((homework, index) => (
                    <div key={index} className="homework-item">
                        <h2>{homework.Title}</h2>
                        <hr />
                        <p><strong>Description:</strong> {homework.Description}</p>
                        {homework.FileName && (
                            <p className="file-viewer">
                                <a href={`data:${homework.ContentType};base64,${homework.Content}`} download={homework.FileName}>
                                    {homework.FileName}
                                </a>
                            </p>
                        )}
                        <p><strong>Start Date:</strong> {new Date(homework.StartDate).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                        <p><strong>End Date:</strong> {new Date(homework.Deadline).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
                        <button className="view-submissions" onClick={() => handleViewSubmissions(homework.Id)}>View submissions</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomeworksPageForTeacher;

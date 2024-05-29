import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './coursePages.css';

const HomeworksPageForTeacher = () => {
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
        formData.append('subjectId', id); // Schimbați acest ID cu cel corect
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
            // Actualizați lista temelor după adăugare (opțional)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toggleAddSection = () => {
        setShowAddSection(!showAddSection);
    };

    return (
        <div className="content-course">
            <h1>Homeworks</h1>
            {showAddSection && (
                <Form onSubmit={handleFormSubmit}>
                    <FormGroup>
                        <Label for="title">Title</Label>
                        <Input type="text" name="title" id="title" value={newMaterial.title} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" value={newMaterial.description} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="startDate">Start Date</Label>
                        <Input type="date" name="startDate" id="startDate" value={newMaterial.startDate} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="endDate">End Date</Label>
                        <Input type="date" name="endDate" id="endDate" value={newMaterial.endDate} onChange={handleInputChange} required />
                    </FormGroup>
                    <FormGroup>
                        <Label for="file">File</Label>
                        <Input type="file" name="file" id="file" onChange={handleInputChange} />
                    </FormGroup>
                    <Button type="submit" color="primary">Add New Homework</Button>
                </Form>
            )}
            <Button color="primary" onClick={toggleAddSection}>{showAddSection ? 'Cancel' : 'Add New Homework'}</Button>
            {/* Afisarea temelor existente */}
            {/* Implementați această secțiune pentru a afișa temele existente */}
        </div>
    );
};

export default HomeworksPageForTeacher;

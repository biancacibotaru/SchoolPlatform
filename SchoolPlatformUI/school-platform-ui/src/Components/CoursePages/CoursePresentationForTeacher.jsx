import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import './coursePages.css';

const CoursePresentationForTeacher = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        description: '',
        file: null
    });

    const toggleModal = () => setModal(!modal);

    useEffect(() => {
        const fetchMaterials = async () => {
            if (!id) return;

            try {
                const response = await fetch(`http://localhost:5271/api/StudyMaterial/GetStudyMaterialsForSubject/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setMaterials(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMaterials();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'file') {
            setNewMaterial({ ...newMaterial, [name]: files[0] });
        } else {
            setNewMaterial({ ...newMaterial, [name]: value });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Title', newMaterial.title);
        formData.append('Description', newMaterial.description);
        formData.append('File', newMaterial.file);
        formData.append('SubjectId', id);

        try {
            const response = await fetch('http://localhost:5271/api/StudyMaterial/AddStudyMaterial', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newMaterialData = await response.json();
            setMaterials([...materials, newMaterialData]);
            toggleModal(); // Close the modal after successful submission
        } catch (error) {
            console.error('Error adding new material:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Gruparea materialelor după dată
    const groupedMaterials = materials.reduce((groups, material) => {
        const date = material.CreatedOn;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(material);
        return groups;
    }, {});

    return (
        <div className="content-course">
            <h1>Course Materials</h1>
            <Button color="primary" onClick={toggleModal}>Add New Material</Button>
            <Modal isOpen={modal} toggle={toggleModal} className="custom-modal">
                <ModalHeader toggle={toggleModal} className="custom-modal-header">Add New Material</ModalHeader>
                <ModalBody className="custom-modal-body">
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
                            <Label for="file">File</Label>
                            <Input type="file" name="file" id="file" onChange={handleInputChange} required />
                        </FormGroup>
                        <Button type="submit" color="primary">Submit</Button>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggleModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
            {Object.keys(groupedMaterials).map((date, index) => (
                <div key={date} className="material-group">
                    <h2 className="material-date">{date}</h2>
                    {groupedMaterials[date].map((material, materialIndex) => {
                        // Crearea URL-ului data-uri pentru descărcare/vizualizare
                        const fileUrl = `data:application/octet-stream;base64,${material.FileContent}`;
                        
                        return (
                            <div key={material.id} className="material-item">
                                <h2 className="material-title">{material.Title}</h2>
                                <p className="material-description">{material.Description}</p>
                                {material.FileName && (
                                    <a href={fileUrl} download={material.FileName} className="material-download">
                                      📃 {material.FileName}
                                    </a>
                                )}
                                {/* Adăugarea unei linii orizontale între materiale, cu excepția ultimului material din grup */}
                                {materialIndex < groupedMaterials[date].length - 1 && <hr className="material-divider" />}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default CoursePresentationForTeacher;

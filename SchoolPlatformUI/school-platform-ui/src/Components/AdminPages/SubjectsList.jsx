import React, { useState, useEffect } from 'react';
import './admin.css';
import AddSubjectForm from './AddSubjectForm';

const SubjectsList = () => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch('http://localhost:5271/api/class/getallclasses');
                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        fetchClasses();
    }, []);

    const handleSelectClass = (classId) => {
        setSelectedClass(classId === selectedClass ? null : classId);
    };

    return (
        <div className="admin-page">
            <h1 className='title'>All Subjects</h1>
            <div className="class-buttons-container">
                {classes.map((classItem, index) => (
                    <button
                        key={index}
                        className={`class-name ${classItem.Id === selectedClass ? 'active' : ''}`}
                        onClick={() => handleSelectClass(classItem.Id)}
                    >
                        {classItem.Code} {selectedClass === classItem.Id ? '▲' : '▼'}
                    </button>
                ))}
            </div>
            {selectedClass && (
                <ClassSubjects classId={selectedClass} />
            )}
        </div>
    );
};

const ClassSubjects = ({ classId }) => {
    const [subjects, setSubjects] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const fetchSubjectsByClass = async () => {
            try {
                const response = await fetch(`http://localhost:5271/api/subject/getallsubjectsbyclass/${classId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch subjects');
                }
                const data = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjectsByClass();
    }, [classId]);

    const handleAddSubject = async (newSubjectData) => {
        try {
            const response = await fetch('http://localhost:5271/api/subject/insertsubject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSubjectData),
            });
            setPopupMessage(`Subject added successfully for class ${newSubjectData.Class}!`);
            setShowPopup(true);
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    return (
        <div>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Teacher</th>
                            <th>Hours/ week</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => (
                            <tr key={index}>
                                <td>{subject.Name}</td>
                                <td>{subject.TeacherFirstname} {subject.TeacherLastname}</td>
                                <td>{subject.HoursPerWeek}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {!showPopup && (
                    <button className="add-item-button" onClick={() => setShowPopup(true)}>+ Subject</button>
                )}
                {showPopup && (
                    <div className="popup">
                        <div className="popup-message">{popupMessage}</div>
                        <a href="/admin-subjects-list" className="close-button">X</a>
                        <AddSubjectForm
                            onAddSubject={handleAddSubject}
                            selectedClassName={classId} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectsList;

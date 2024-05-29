import React, { useState, useEffect } from 'react';
import './admin.css';
import AddSubjectForm from './AddSubjectForm';

const SubjectsList = () => {
    const [classes, setClasses] = useState([]);

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

    return (
        <div className="admin-page">
            <h1>All Subjects</h1>
            {classes.map((classItem, index) => (
                <ClassSubjects key={index} classItem={classItem} />
            ))}
        </div>
    );
};

const ClassSubjects = ({ classItem }) => {
    const [subjects, setSubjects] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [selectedClassName, setSelectedClassName] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const classFromUrl = urlParams.get('class');

        if (classFromUrl && classFromUrl === classItem.Code) {
            setSelectedClassName(classFromUrl);
            setShowTable(true);
        }
    }, [classItem.Code]);

    useEffect(() => {
        if (showTable && classItem.Code === selectedClassName) {
            const fetchSubjectsByClass = async () => {
                try {
                    const response = await fetch(`http://localhost:5271/api/subject/getallsubjectsbyclass/${classItem.Id}`);
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
        }
    }, [classItem.Code, classItem.Id, selectedClassName, showTable]);

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

            setSelectedClassName(newSubjectData.Class);
            setShowTable(true);

            // Actualizare URL pentru a include clasa selectată
            const searchParams = new URLSearchParams({ class: newSubjectData.Class });
            window.history.pushState(null, '', `${window.location.pathname}?${searchParams}`);
        } catch (error) {
            console.error('Error adding subject:', error);
        }
    };

    return (
        <div className="class-subjects">
            <button className="class-name" onClick={() => {
                setShowTable(!showTable);
                setSelectedClassName(classItem.Code);
                // Actualizare URL pentru a include clasa selectată
                const searchParams = new URLSearchParams({ class: classItem.Code });
                window.history.pushState(null, '', `${window.location.pathname}?${searchParams}`);
            }}>
                {classItem.Code}
            </button>

            {showTable && classItem.Code === selectedClassName && (
                <div>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Teacher</th>
                                    <th>Hours per week</th>
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
                            <button className="add-subject-button" onClick={() => setShowPopup(true)}>Add Subject</button>
                        )}
                        {showPopup && (
                            <div className="popup">
                                <a href={`/admin-subjects-list?class=${selectedClassName}`} className="close-button">X</a>
                                <div className="popup-message">{popupMessage}</div>
                                <AddSubjectForm
                                    onAddSubject={handleAddSubject}
                                    selectedClassName={selectedClassName}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectsList;

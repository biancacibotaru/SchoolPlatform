import React, { useState, useEffect } from 'react';
import './admin.css'; // Importați stilurile CSS

const AddSubjectForm = ({ onAddSubject, selectedClassName }) => {
    const [newSubjectName, setNewSubjectName] = useState('');
    const [newSubjectTeacher, setNewSubjectTeacher] = useState('');
    const [newSubjectHours, setNewSubjectHours] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('http://localhost:5271/api/user/getallteachers');
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                setTeachers(data);
            } catch (error) {
                console.error('Error fetching teachers:', error);
            }
        };

        fetchTeachers();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Verificați dacă toate câmpurile sunt completate
        if (!newSubjectName || !selectedClassName || !newSubjectTeacher || !newSubjectHours) {
            setError('All fields are required.');
            return;
        }

        // Trimiteți datele către funcția de adăugare a materiei
        onAddSubject({
            Name: newSubjectName,
            Class: selectedClassName, // Pasăm numele clasei
            TeacherId: newSubjectTeacher,
            HoursPerWeek: newSubjectHours
        });

        // Resetați câmpurile după trimiterea cu succes a formularului
        setNewSubjectName('');
        setNewSubjectTeacher('');
        setNewSubjectHours('');
        setError(''); // Resetați și mesajul de eroare
    };

    return (
        <div className="add-item-form-container">
            {error && <span className="error-message">{error}</span>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Subject Name"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                />
                <input
                    type="text"
                    hidden
                    placeholder="Class"
                    value={selectedClassName} // Utilizăm numele clasei selectate
                    readOnly
                />

                <select
                    value={newSubjectTeacher}
                    onChange={(e) => setNewSubjectTeacher(e.target.value)}
                >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.Id}>
                            {teacher.Firstname} {teacher.Lastname}
                        </option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Hours per week"
                    value={newSubjectHours}
                    onChange={(e) => setNewSubjectHours(e.target.value)}
                />
                <button className="new-item-button" type="submit">Add</button>
            </form>
        </div>
    );
};

export default AddSubjectForm;

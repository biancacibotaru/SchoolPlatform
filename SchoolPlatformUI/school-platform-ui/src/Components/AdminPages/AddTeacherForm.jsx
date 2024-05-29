import React, { useState } from 'react';
import './admin.css'; // Importați stilurile CSS

const AddTeacherForm = ({ onAddTeacher }) => {
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherFirstname, setNewTeacherFirstname] = useState('');
  const [newTeacherLastname, setNewTeacherLastname] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificați dacă toate câmpurile sunt completate
    if (!newTeacherEmail || !newTeacherFirstname || !newTeacherLastname || !newTeacherPassword) {
      setError('All fields are required.');
      return;
    }

    // Trimiteți datele către funcția de adăugare a profesorului
    onAddTeacher({
      email: newTeacherEmail,
      password: newTeacherPassword,
      firstName: newTeacherFirstname,
      lastName: newTeacherLastname,
    });
    
    // Resetați câmpurile după trimiterea cu succes a formularului
    setNewTeacherEmail('');
    setNewTeacherFirstname('');
    setNewTeacherLastname('');
    setNewTeacherPassword('');
    setError(''); // Resetați și mesajul de eroare
  };

  return (
    <div className="add-teacher-form-container">
    {error && <span className="error-message">{error}</span>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={newTeacherEmail}
          onChange={(e) => setNewTeacherEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="First Name"
          value={newTeacherFirstname}
          onChange={(e) => setNewTeacherFirstname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newTeacherLastname}
          onChange={(e) => setNewTeacherLastname(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={newTeacherPassword}
          onChange={(e) => setNewTeacherPassword(e.target.value)}
        />
        <button className="new-teacher-button" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTeacherForm;

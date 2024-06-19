import React, { useState } from 'react';
import './admin.css'; 

const AddTeacherForm = ({ onAddTeacher }) => {
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherFirstname, setNewTeacherFirstname] = useState('');
  const [newTeacherLastname, setNewTeacherLastname] = useState('');
  const [newTeacherPassword, setNewTeacherPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTeacherEmail || !newTeacherFirstname || !newTeacherLastname || !newTeacherPassword) {
      setError('All fields are required.');
      return;
    }

    onAddTeacher({
      email: newTeacherEmail,
      password: newTeacherPassword,
      firstName: newTeacherFirstname,
      lastName: newTeacherLastname,
    });
    
    setNewTeacherEmail('');
    setNewTeacherFirstname('');
    setNewTeacherLastname('');
    setNewTeacherPassword('');
    setError(''); 
  };

  return (
    <div className="add-item-form-container">
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
        <button className="new-item-button" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddTeacherForm;

import React, { useState, useEffect } from 'react';
import './admin.css'; 

const AddClassroomForm = ({ onAddClassroom }) => {
  const [newClassroomCode, setNewClassroomCode] = useState('');
  const [newClassroomLeader, setNewClassroomLeader] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch('http://localhost:5271/api/user/getallnonliders');
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newClassroomCode || !newClassroomLeader) {
      setError('All fields are required.');
      return;
    }

    onAddClassroom({
      Code: newClassroomCode,
      Teacher: newClassroomLeader,
    });
    
    setNewClassroomCode('');
    setNewClassroomLeader('');
    setError(''); 
  };

  return (
    <div className="add-item-form-container">
      {error && <span className="error-message">{error}</span>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Code"
          value={newClassroomCode}
          onChange={(e) => setNewClassroomCode(e.target.value)}
        />
        <select
          value={newClassroomLeader}
          onChange={(e) => setNewClassroomLeader(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.Id} value={teacher.Id}>
              {teacher.Firstname} {teacher.Lastname}
            </option>
          ))}
        </select>
        <button className="new-item-button" type="submit">Add</button>
      </form>
    </div>
  );
};

export default AddClassroomForm;

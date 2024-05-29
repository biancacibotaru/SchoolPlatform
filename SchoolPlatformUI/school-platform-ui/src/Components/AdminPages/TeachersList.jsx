import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importați Link din 'react-router-dom'
import './admin.css';
import AddTeacherForm from './AddTeacherForm';

const TeachersListPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5271/api/user/getallteachers`);
        if (!response.ok) {
          throw new Error('Failed to fetch teachers');
        }
        const data = await response.json();
        setTeachers(data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddTeacher = async (newTeacherData) => {
    try {
      const response = await fetch('http://localhost:5271/api/user/insertuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTeacherData,
          hashedPassword: '',
          type: 'teacher'
        }),
      });
      setPopupMessage('Teacher added successfully!'); // Setăm mesajul de succes
      setShowPopup(true); // Afisam popup-ul cu mesajul de succes
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };  

  return (
    <div className="admin-page">
      <h1>All Teachers</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{teacher.Email}</td>
                <td>{teacher.Firstname}</td>
                <td>{teacher.Lastname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        {!showPopup && (
          <button className="add-teacher-button" onClick={() => setShowPopup(true)}>+</button>
        )}
        {showPopup && (
          <div className="popup">
            <a href="/admin-teachers-list" className="close-button">X</a>
            <div className="popup-message">{popupMessage}</div>
            <AddTeacherForm onAddTeacher={handleAddTeacher} />
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachersListPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importă Link din react-router-dom
import './admin.css';
import AddClassroomForm from './AddClassroomForm';

const ClassesListPage = () => {
  const [classes, setClasses] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5271/api/userclass/getallclasseswithleaders`);
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddClassroom = async (newClassroomData) => {
    let newClassroom = '';
    try {
      const response = await fetch('http://localhost:5271/api/class/insertclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Code: newClassroomData.Code,
          Description: ''
        }),
      });
      setPopupMessage('Classroom added successfully!'); // Setăm mesajul de succes
      setShowPopup(true); // Afisam popup-ul cu mesajul de succes
      newClassroom = await response.json();
      // setClasses([...classes, newClassroom]);
    } catch (error) {
      console.error('Error adding classroom:', error);
    }

    try {
      console.log('lalalalalaa');
      const response = await fetch('http://localhost:5271/api/userclass/insertuserclass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ClassId: newClassroom,
          UserId: newClassroomData.Teacher,
          Role: 'leader'
        }),
      });
      setPopupMessage('Classroom added successfully!'); // Setăm mesajul de succes
      setShowPopup(true); // Afisam popup-ul cu mesajul de succes
      // const newClassroom = await response.json();
      // setClasses([...classes, newClassroom]);
    } catch (error) {
      console.error('Error adding classroom:', error);
    }
  };  

  return (
    <div className="admin-page">
      <h1 className='title'>All Classrooms</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Code</th>
              <th>Leader name</th>
              <th>Leader email</th>
              <th>Members</th> {/* Adaugă coloana "Members" */}
            </tr>
          </thead>
          <tbody>
            {classes.map((c, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{c.Code}</td>
                <td>{c.TeacherFirstname} {c.TeacherLastname}</td>
                <td>{c.TeacherEmail}</td>
                <td> {/* Adaugă butonul pentru fiecare clasă */}
                  <Link to={`/student-list-by-class/${c.Id}`}>
                    <button className="red-button">View Members</button> {/* Aplică stilul pentru buton */}
                  </Link>
                </td>
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
            <a href="/admin-classes-list" className="close-button">X</a>
            <div className="popup-message">{popupMessage}</div>
            <AddClassroomForm onAddClassroom={handleAddClassroom} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesListPage;

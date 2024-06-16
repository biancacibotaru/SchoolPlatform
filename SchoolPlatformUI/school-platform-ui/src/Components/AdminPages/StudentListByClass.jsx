import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './admin.css';

const StudentListByClass = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [classCode, setClassCode] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5271/api/userclass/getstudentlistbyclass/${id}`);
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
        if (data.length > 0) {
          setClassCode(data[0].ClassCode);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="admin-page">
      <h1 className='title'>Students of Classroom {classCode}</h1>
      {students.length > 0 ? (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.StudentFirstname} {student.StudentLastname}</td>
                <td>{student.StudentEmail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : 
    (<div>
      <h2 className='no-students'>No students in the classroom.</h2>
      </div>)}
    </div> 
  );
};

export default StudentListByClass;

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom'; // Importă Link din react-router-dom
import Cookies from 'js-cookie';
import './studentPages.css';

const StudentCourses = () => {
    const [subjects, setSubjects] = useState([]);
    const [classId, setClassId] = useState(null);

    useEffect(() => {
        const fetchClassId = async () => {
            const userDataFromCookie = Cookies.get('loggedIn');
            if (userDataFromCookie) {
                const userData = JSON.parse(userDataFromCookie);
                const classCode = userData.Class;

                try {
                    const response = await fetch(`http://localhost:5271/api/class/GetClassIdByCode/${classCode}`);
                    if (response.ok) {
                        const id = await response.json();
                        setClassId(id);
                    } else {
                        console.error("Error fetching class ID:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching class ID:", error);
                }
            }
        };

        fetchClassId();
    }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (!classId) return;

            try {
                const response = await fetch(`http://localhost:5271/api/subject/GetAllSubjectsByClass/${classId}`);
                if (response.ok) {
                    const data = await response.json();
                    setSubjects(data);
                } else {
                    console.error("Error fetching subjects:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchSubjects();
    }, [classId]);

    return (
        <div className="content">
            <h1 className="title">Dashboard</h1>
            <div className="card-list row"> {/* Schimbăm row-cols-md-3 cu row-cols-lg-3 */}
                {subjects.map((subject, index) => (
                    <div key={index} className="row-cols-mb-6"> {/* Adăugăm clasa col pentru a defini fiecare card */}
                        {/* Înfășurăm conținutul cardului într-un element Link */}
                        <Link to={`/course-main-page?id=${subject.SubjectId}&name=${subject.Name}`} style={{ textDecoration: 'none' }}>
                            <Card className="card-bordered">
                                <CardBody>
                                    <CardTitle className="card-title" tag="h2">📝{subject.Name}</CardTitle>
                                    <CardText className="card-teacher">Teacher: {subject.TeacherFirstname} {subject.TeacherLastname}</CardText>
                                    <CardText className="card-hours">Hours per week: {subject.HoursPerWeek}</CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );    
};

export default StudentCourses;

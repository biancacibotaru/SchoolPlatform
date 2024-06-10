import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './teacherPages.css';

const TeacherCourses = () => {
    const [subjects, setSubjects] = useState([]);
    const [teacherId, setTeacherId] = useState(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            const userDataFromCookie = Cookies.get('loggedIn');
            if (userDataFromCookie) {
                const userData = JSON.parse(userDataFromCookie);
                const teacherId = userData.Id;

                if (!teacherId) return;

                setTeacherId(teacherId);

                try {
                    const response = await fetch(`http://localhost:5271/api/subject/GetAllSubjectsByTeacher/${teacherId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSubjects(data);
                    } else {
                        console.error("Error fetching subjects:", response.statusText);
                    }
                } catch (error) {
                    console.error("Error fetching subjects:", error);
                }
            }
        };

        fetchSubjects();
    }, []);

    return (
        <div className="content">
            <h1 className="title">Dashboard</h1>
            <div className="card-list row"> {/* Schimbăm row-cols-md-3 cu row-cols-lg-3 */}
                {subjects.map((subject, index) => (
                    <div key={index} className="row-cols-mb-6"> {/* Adăugăm clasa col pentru a defini fiecare card */}
                        {/* Înfășurăm conținutul cardului într-un element Link */}
                        <Link to={`/course-main-page-for-teacher?id=${subject.SubjectId}&name=${subject.Name}`} style={{ textDecoration: 'none' }}>
                            <Card className="card-bordered">
                                <CardBody>
                                    <CardTitle className="card-title" tag="h2">📝{subject.Name}</CardTitle>
                                    <CardText className="card-text">Class: {subject.Class}</CardText>
                                    <CardText className="card-text">Hours per week: {subject.HoursPerWeek}</CardText>
                                </CardBody>
                            </Card>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherCourses;

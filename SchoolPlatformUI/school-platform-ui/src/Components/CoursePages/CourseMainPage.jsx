import React, { useState, useEffect } from 'react';
import { useLocation , Link } from 'react-router-dom';
import './coursePages.css';

const CourseMainPage = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const name = queryParams.get('name');

    return (
        <div className="content-main">
           <h1 className="title">{name} Course</h1>
           <Link className="course-link" to={`/course-presentation?id=${id}`}>Presentation</Link><br />
           <Link className="course-link" to={`/course-homeworks?id=${id}`}>Homeworks</Link><br />
           <Link className="course-link" to={`/course-exams?id=${id}`}>Exams</Link>
        </div>
    );
};

export default CourseMainPage;

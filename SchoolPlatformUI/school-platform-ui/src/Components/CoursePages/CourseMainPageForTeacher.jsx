import React, { useState, useEffect } from 'react';
import { useLocation , Link } from 'react-router-dom';
import './coursePages.css'

const CourseMainPageForTeacher = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    return (
        <div className="content">
           <Link to={`/course-presentation-for-teacher?id=${id}`}>Course Presentation</Link><br />
           <Link to={`/course-homeworks-for-teacher?id=${id}`}>Homeworks</Link><br />
           <Link to={`/course-exams-for-teacher?id=${id}`}>Exams</Link>
        </div>
    );
};

export default CourseMainPageForTeacher;

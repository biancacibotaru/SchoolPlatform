import React, { useState, useEffect } from 'react';
import { useLocation , Link } from 'react-router-dom';
import './coursePages.css'

const CourseMainPage = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    return (
        <div className="content">
           <Link to={`/course-presentation?id=${id}`}>Course Presentation</Link><br />
           <Link to={`/course-exams?id=${id}`}>Exams</Link>
        </div>
    );
};

export default CourseMainPage;

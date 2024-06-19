import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './examPages.css';

const ViewExamForTeacher = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const subjectId = queryParams.get('subjectId');
    const examId = queryParams.get('id');

    const [examDetails, setExamDetails] = useState({
        Title: '',
        Description: '',
        Duration: '',
        StartedOn: '',
        ClosedOn: ''
    });

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        if (examId) {
            fetchExamData(examId);
        }
    }, [examId]);

    const fetchExamData = async (id) => {
        try {
            const response = await fetch(`http://localhost:5271/api/Exam/GetExam/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const examData = await response.json();
            console.log('Exam data fetched:', examData); 

            setExamDetails({
                Title: examData.Title || '',
                Description: examData.Description || '',
                Duration: examData.Duration || '',
                StartedOn: formatDateForInput(examData.StartedOn) || ''
            });
            setQuestions(examData.Questions || []); 
        } catch (error) {
            console.error('Error fetching exam data:', error);
        }
    };

    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <div className="exam-content-course">
            <h1 className="title">Exam</h1>
            <div className="exam-details">
                <div className="exam-detail-item">
                    <label>
                        Exam Title:
                        <input
                            className='exam-detail-item-text'
                            type="text"
                            name="Title"
                            value={examDetails.Title}
                            readOnly
                        />
                    </label>
                </div>
                <div className="exam-detail-item">
                    <label>
                        Description:
                        <input
                            className='exam-detail-item-text'
                            name="Description"
                            value={examDetails.Description}
                            readOnly
                            rows="10"
                        />
                    </label>
                </div>
                <div className="exam-detail-item">
                    <label>
                        Duration (minutes):
                        <input
                            type="number"
                            name="Duration"
                            value={examDetails.Duration}
                            readOnly
                        />
                    </label>
                </div>
                <div className="exam-detail-item">
                    <label>
                        Started on:
                        <input
                            type="datetime-local"
                            name="StartedOn"
                            value={examDetails.StartedOn}
                            readOnly
                        />
                    </label>
                </div>
            </div>
            {questions.map((question, qIndex) => (
                <div key={qIndex} className="exam-question-item">
                    <h2 className='exam-p'>Question {qIndex + 1} ({question.Points} p)</h2>
                    <p className='exam-p'>{question.Text}</p>
                    <ul className="exam-ul">
                        {question.Answers.map((answer, aIndex) => (
                            <li key={aIndex}>
                                <input
                                    type="checkbox"
                                    checked={answer.IsCorrect}
                                    readOnly
                                /> {answer.Text}
                            </li>
                        ))}
                    </ul>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default ViewExamForTeacher;

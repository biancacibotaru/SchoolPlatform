import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './examPages.css';
import Cookies from 'js-cookie';

const ViewExamForStudent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const examId = queryParams.get('id');
    const subjectId = queryParams.get('subjectId');

    const [examDetails, setExamDetails] = useState({
        Title: '',
        Description: '',
        Duration: '',
        StartedOn: ''
    });

    const [questions, setQuestions] = useState([]);
    const [timeLeft, setTimeLeft] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await fetch(`http://localhost:5271/api/Exam/GetExam/${examId}`);
                const data = await response.json();
                setExamDetails({
                    Title: data.Title,
                    Description: data.Description,
                    Duration: data.Duration,
                    StartedOn: data.StartedOn,
                    ClosedOn: data.ClosedOn
                });
                setQuestions(data.Questions);

                const interval = setInterval(() => {
                    calculateTimeLeft(data.StartedOn, data.Duration);
                }, 1000);

                return () => clearInterval(interval);
            } catch (error) {
                console.error('Error fetching exam details:', error);
            }
        };

        fetchExam();
    }, [examId]);

    const calculateTimeLeft = (startedOn, duration) => {
        const now = new Date();
        const startTime = new Date(startedOn);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        const difference = endTime - now;

        if (difference > 0) {
            const minutes = Math.floor((difference / 1000) / 60);
            const seconds = Math.floor((difference / 1000) % 60);
            setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
            setTimeLeft('Time\'s up!');
            alert('Time is up! You will be redirected.');
            navigate(`/course-exams?id=${subjectId}`);  // Redirect to the course page
        }
    };

    const [studentAnswers, setStudentAnswers] = useState({});

    const handleAnswerChange = (questionIndex, answerText, isChecked) => {
        const userDataFromCookie = Cookies.get('loggedIn');
        if (userDataFromCookie) {
            const userData = JSON.parse(userDataFromCookie);
            setUserId(userData.Id);
        }

        setStudentAnswers(prevState => {
            const questionAnswers = prevState[questionIndex] ? [...prevState[questionIndex]] : [];
            if (isChecked) {
                if (!questionAnswers.includes(answerText)) {
                    questionAnswers.push(answerText);
                }
            } else {
                const index = questionAnswers.indexOf(answerText);
                if (index > -1) {
                    questionAnswers.splice(index, 1);
                }
            }
            return {
                ...prevState,
                [questionIndex]: questionAnswers
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentResponse = {
            StudentId: userId,
            ExamId: examId,
            Responses: questions.map((question, questionIndex) => ({
                QuestionId: question.Id,
                Answers: studentAnswers[questionIndex] || []
            }))
        };

        try {
            console.log(JSON.stringify(studentResponse));
            const response = await fetch(`http://localhost:5271/api/Exam/SubmitExam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentResponse),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Exam submitted successfully!');
            setTimeout(() => {
                navigate(`/course-exams?id=${subjectId}`);  // Redirect to the course page after submission
            }, 1000); // Adjust the delay as needed
        } catch (error) {
            console.error('Error submitting exam:', error);
        }
    };

    return (
        <div className="exam-content-course">
            <div className="timer">{timeLeft}</div>
            {warningMessage && <div className="warning-message">{warningMessage}</div>}
            <h1 className="title">{examDetails.Title}</h1>
            <p className="exam-details-student">{examDetails.Description}</p>
            <p className="exam-details-student">Duration: {examDetails.Duration} minutes</p>
            <form onSubmit={handleSubmit} className="exam-form">
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="exam-question-item-student">
                        <h2>➡️ Question {qIndex + 1}</h2>
                        <p className="question-align">{question.Text}</p>
                        <p className="question-align">Points: {question.Points}</p>
                        <ul className="exam-ul question-align">
                            {question.Answers.map((answer, aIndex) => (
                                <li key={aIndex}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => handleAnswerChange(qIndex, answer.Text, e.target.checked)}
                                        /> {answer.Text}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
                <button type="submit" className="exam-submit">Submit Exam</button>
            </form>
        </div>
    );
};

export default ViewExamForStudent;

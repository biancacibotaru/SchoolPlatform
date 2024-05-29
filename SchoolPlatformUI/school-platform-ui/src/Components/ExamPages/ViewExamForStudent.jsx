import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './examPages.css';
import Cookies from 'js-cookie';

const ViewExamForStudent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const examId = queryParams.get('id');

    const [examDetails, setExamDetails] = useState({
        Title: '',
        Description: '',
        Duration: '',
        StartedOn: '',
        ClosedOn: ''
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
                    StartedOn: new Date(),
                    ClosedOn: data.ClosedOn
                });
                setQuestions(data.Questions);

                const durationInSeconds = data.Duration * 60;
                const startTime = new Date().getTime();
                const endTime = startTime + durationInSeconds * 1000;
                const interval = setInterval(() => {
                    const now = new Date().getTime();
                    const timeDifference = endTime - now;
                    if (timeDifference > 0) {
                        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                        setTimeLeft(`${minutes}m ${seconds}s`);

                        const timeSpentOnOtherTabs = (now - startTime) / 1000;
                        if (document.visibilityState === 'hidden' && timeSpentOnOtherTabs > 10) {
                            setWarningMessage('You spent an extended period of time away from this exam. Please refrain from using other tabs/windows.');
                        }
                    } else {
                        clearInterval(interval);
                        setTimeLeft('Time\'s up!');
                    }
                }, 1000);

                return () => clearInterval(interval);
            } catch (error) {
                console.error('Error fetching exam details:', error);
            }
        };

        fetchExam();
    }, [examId]);

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
        } catch (error) {
            console.error('Error submitting exam:', error);
        }
    };

    return (
        <div className="exam-content-course">
            <div className="timer">{timeLeft}</div> {/* Timer element with fixed position */}
            {warningMessage && <div className="warning-message">{warningMessage}</div>} {/* Warning message for suspicious behavior */}
            <h1>{examDetails.Title}</h1>
            <p>{examDetails.Description}</p>
            <p>Duration: {examDetails.Duration} minutes</p>
            <form onSubmit={handleSubmit} className="exam-form">
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="exam-question-item">
                        <h2>Question {qIndex + 1}</h2>
                        <p>{question.Text}</p>
                        <p>Points: {question.Points}</p>
                        <ul className="exam-ul">
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

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './examPages.css';
import Cookies from 'js-cookie';

const ViewExamResultForStudent = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const examId = queryParams.get('id');
    const userDataFromCookie = Cookies.get('loggedIn');
    const userId = userDataFromCookie ? JSON.parse(userDataFromCookie).Id : '';

    const [examDetails, setExamDetails] = useState({});
    const [userResponses, setUserResponses] = useState([]);

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                const examResponse = await fetch(`http://localhost:5271/api/Exam/GetExam/${examId}`);
                const examData = await examResponse.json();
                setExamDetails(examData);

                const userResponse = await fetch(`http://localhost:5271/api/Exam/GetStudentExam/${examId}?studentId=${userId}`);
                const userData = await userResponse.json();
                setUserResponses(userData);
            } catch (error) {
                console.error('Error fetching exam data:', error);
            }
        };

        fetchExamData();
    }, [examId, userId]);

    const getAnswerClass = (questionId, answerText) => {
        const userQuestion = userResponses.find(q => q.QuestionId === questionId);
        if (!userQuestion) return '';

        const { Answers: correctAnswers, StudentAnswers: studentAnswers, StudentPoints } = userQuestion;

        if (correctAnswers.includes(answerText)) {
            if (studentAnswers.includes(answerText)) {
                return 'correct';
            } else {
                return 'missed';
            }
        } else if (studentAnswers.includes(answerText)) {
            return 'incorrect';
        } else {
            return '';
        }
    };

    const totalPoints = userResponses.reduce((total, response) => total + (response.StudentPoints || 0), 0);

    return (
        <div className="exam-result-content">
            <h1>Exam Results</h1>
            <h2>Total points: {totalPoints}</h2>
            {examDetails.Questions ? (
                <ul className="exam-result-ul">
                    {(() => {
                        const items = [];
                        for (let i = 0; i < examDetails.Questions.length; i++) {
                            const question = examDetails.Questions[i];
                            const totalPoints = question.Points;
                            const userQuestion = userResponses.find(q => q.QuestionId === question.Id);
                            const studentPoints = userQuestion ? userQuestion.StudentPoints : null;
                            const pointsText = studentPoints !== null ? `(${studentPoints}/${totalPoints} points)` : '';
                            items.push(
                                <li key={i} className="exam-result-item">
                                    <h2>{`Question ${i + 1} ${pointsText}`}</h2>
                                    <p>{question.Text}</p>
                                    <ul className="no-bullets">
                                        {(() => {
                                            const answerItems = [];
                                            for (let j = 0; j < question.Answers.length; j++) {
                                                const answer = question.Answers[j];
                                                answerItems.push(
                                                    <li key={j} className={getAnswerClass(question.Id, answer.Text)}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                readOnly
                                                                checked={userQuestion && userQuestion.StudentAnswers.includes(answer.Text)}
                                                            /> {answer.Text}
                                                        </label>
                                                    </li>
                                                );
                                            }
                                            return answerItems;
                                        })()}
                                    </ul>
                                </li>
                            );
                        }
                        return items;
                    })()}
                </ul>
            ) : (
                <p>Loading exam details...</p>
            )}
        </div>
    );
};

export default ViewExamResultForStudent;

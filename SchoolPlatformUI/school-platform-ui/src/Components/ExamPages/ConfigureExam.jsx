import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './examPages.css';

const ConfigureExam = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const subjectId = queryParams.get('subjectId');
    const examId = queryParams.get('id');
    const navigate = useNavigate();

    const [examDetails, setExamDetails] = useState({
        Title: '',
        Description: '',
        Duration: '',
        StartedOn: '',
        ClosedOn: ''
    });

    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        Text: '',
        Points: '',
        Answers: [{ Text: '', IsCorrect: false }]
    });

    const [showAddQuestion, setShowAddQuestion] = useState(true);
    const [editIndex, setEditIndex] = useState(-1);
    const [editedQuestion, setEditedQuestion] = useState({
        Text: '',
        Points: '',
        Answers: []
    });

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

            setExamDetails({
                Title: examData.Title || '',
                Description: examData.Description || '',
                Duration: examData.Duration || '',
                StartedOn: formatDateForInput(examData.StartedOn) || '',
                ClosedOn: examData.ClosedOn || ''
            });
            setQuestions(examData.Questions || []); // Ensure questions is an array
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

    const handleExamDetailsChange = (e) => {
        const { name, value } = e.target;
        setExamDetails({ ...examDetails, [name]: value });
    };

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setNewQuestion({ ...newQuestion, [name]: value });
    };

    const handleAnswerChange = (index, e) => {
        const { name, value, checked } = e.target;
        const answers = [...newQuestion.Answers];
        if (name === 'Text') {
            answers[index].Text = value;
        } else if (name === 'IsCorrect') {
            answers[index].IsCorrect = checked;
        }
        setNewQuestion({ ...newQuestion, Answers: answers });
    };

    const addAnswer = () => {
        setNewQuestion({
            ...newQuestion,
            Answers: [...newQuestion.Answers, { Text: '', IsCorrect: false }]
        });
    };

    const saveQuestion = () => {
        setQuestions([...questions, newQuestion]);
        setNewQuestion({ Text: '', Points: '', Answers: [{ Text: '', IsCorrect: false }] });
        setShowAddQuestion(false);
    };

    const formatDateTimeForServer = (dateString) => {
        const options = {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: true
        };
        const date = new Date(dateString);
        return date.toLocaleString('en-US', options).replace(',', '');
    };

    const handleSubmitAsDraft = async (e) => {
        e.preventDefault();
        const examData = {
            Id: examId || 0,
            SubjectId: subjectId,
            Title: examDetails.Title,
            Description: examDetails.Description,
            Duration: examDetails.Duration,
            StartedOn: formatDateTimeForServer(examDetails.StartedOn),
            State: 'draft',
            Questions: questions.map((q, index) => ({
                Id: q.Id || index + 1,
                Text: q.Text,
                Points: q.Points,
                Answers: q.Answers.map((a, aIndex) => ({
                    Id: a.Id || aIndex + 1,
                    Text: a.Text,
                    IsCorrect: a.IsCorrect
                }))
            }))
        };

        try {
            const response = await fetch(`http://localhost:5271/api/Exam/InsertExam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Exam configured successfully!');
            navigate(`/course-exams-for-teacher?id=${subjectId}`); // Navigate to the previous page after closing the alert
        } catch (error) {
            console.error('Error configuring exam:', error);
        }
    };

    const handleSubmitAndPublish = async (e) => {
        e.preventDefault();

        const totalPoints = questions.reduce((acc, cur) => acc + parseFloat(cur.Points), 0);
        if (totalPoints !== 9) {
            alert(`The total points should be 9, but now they are ${totalPoints}. Please adjust the points for your questions.`);
            return;
        }

        const now = new Date();
        const examDate = new Date(examDetails.StartedOn);
        if (examDate < now) {
            alert("Exam start date and time cannot be in the past. Please select a future date and time.");
            return;
        }

        const examData = {
            Id: examId || 0, // If it's a new exam, Id will be 0, else it will be the existing examId
            SubjectId: subjectId,
            Title: examDetails.Title,
            Description: examDetails.Description,
            Duration: examDetails.Duration,
            StartedOn: formatDateTimeForServer(examDetails.StartedOn),
            State: 'published',
            Questions: questions.map((q, index) => ({
                Id: q.Id || index + 1, // Use existing question id or assign a temporary one
                Text: q.Text,
                Points: q.Points,
                Answers: q.Answers.map((a, aIndex) => ({
                    Id: a.Id || aIndex + 1, // Use existing answer id or assign a temporary one
                    Text: a.Text,
                    IsCorrect: a.IsCorrect
                }))
            }))
        };

        try {
            const response = await fetch(`http://localhost:5271/api/Exam/InsertExam`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(examData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Exam configured successfully!');
            navigate(`/course-exams-for-teacher?id=${subjectId}`); // Navigate to the previous page after closing the alert
        } catch (error) {
            console.error('Error configuring exam:', error);
        }
    };

    const handleEditQuestion = (index) => {
        setEditIndex(index);
        const questionToEdit = questions[index];
        setEditedQuestion({ ...questionToEdit });
    };

    const handleEditQuestionChange = (e) => {
        const { name, value } = e.target;
        setEditedQuestion({ ...editedQuestion, [name]: value });
    };

    const handleEditAnswerChange = (index, e) => {
        const { name, value, checked } = e.target;
        const answers = [...editedQuestion.Answers];
        if (name === 'Text') {
            answers[index].Text = value;
        } else if (name === 'IsCorrect') {
            answers[index].IsCorrect = checked;
        }
        setEditedQuestion({ ...editedQuestion, Answers: answers });
    };

    const saveEditedQuestion = () => {
        const updatedQuestions = [...questions];
        updatedQuestions[editIndex] = editedQuestion;
        setQuestions(updatedQuestions);
        setEditIndex(-1);
        setEditedQuestion({
            Text: '',
            Points: '',
            Answers: []
        });
    };

    return (
        <div className="exam-content-course">
            <h1 className="title">Configure Exam</h1>
            <form className="exam-form">
                <div className="exam-header">
                    <div className="exam-buttons">
                        <button onClick={handleSubmitAsDraft} className="exam-submit">Save exam as draft</button>
                        <button onClick={handleSubmitAndPublish} className="exam-submit">Publish exam</button>
                    </div>
                    <div className="exam-details">
                        <div className="exam-detail-item">
                            <label>
                                Exam Title:
                                <input
                                    className='exam-detail-item-text'
                                    type="text"
                                    name="Title"
                                    value={examDetails.Title}
                                    onChange={handleExamDetailsChange}
                                    required
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
                                    onChange={handleExamDetailsChange}
                                    required
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
                                    onChange={handleExamDetailsChange}
                                    required
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
                                    onChange={handleExamDetailsChange}
                                    required
                                />
                            </label>
                        </div>
                    </div>
                </div>
                {questions.map((question, qIndex) => (
                    <div key={qIndex} className="exam-question-item">
                        <h2 className='exam-p'>Question {qIndex + 1} ({question.Points} p)</h2>
                        {editIndex === qIndex ? (
                            <div>
                                <label className='exam-p'>
                                    Question:
                                    <input
                                        className="question-text"
                                        type="text"
                                        name="Text"
                                        value={editedQuestion.Text}
                                        onChange={handleEditQuestionChange}
                                        required
                                    />
                                </label>
                                <label className='exam-p'>
                                    Points:
                                    <input
                                        className="question-points"
                                        type="number"
                                        name="Points"
                                        value={editedQuestion.Points}
                                        onChange={handleEditQuestionChange}
                                        required
                                    />
                                </label>
                                {editedQuestion.Answers.map((answer, index) => (
                                    <div key={index} className="exam-answer-item">
                                        <label>
                                            Answer {index + 1}:
                                            <input
                                                className="answer-text"
                                                type="text"
                                                name="Text"
                                                value={answer.Text}
                                                onChange={(e) => handleEditAnswerChange(index, e)}
                                                required
                                            />
                                        </label>
                                        <label>
                                            Correct:
                                            <input
                                                className="exam-answer-checkbox"
                                                type="checkbox"
                                                name="IsCorrect"
                                                checked={answer.IsCorrect}
                                                onChange={(e) => handleEditAnswerChange(index, e)}
                                            />
                                        </label>
                                    </div>
                                ))}
                                <button onClick={saveEditedQuestion} className="exam-submit">Save Question</button>
                            </div>
                        ) : (
                            <div>
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
                                <button onClick={() => handleEditQuestion(qIndex)} className="edit-question-button">Edit Question</button>
                            </div>
                        )}
                    </div>
                ))}
                {showAddQuestion && (
                    <div className="exam-new-question">
                        <h2>Add New Question</h2>
                        <label>
                            Question:
                            <input
                                className="question-text"
                                type="text"
                                name="Text"
                                value={newQuestion.Text}
                                onChange={handleQuestionChange}
                                required
                            />
                        </label>
                        <label>
                            Points:
                            <input
                                className="question-points"
                                type="number"
                                name="Points"
                                value={newQuestion.Points}
                                onChange={handleQuestionChange}
                                required
                            />
                        </label>
                        {newQuestion.Answers.map((answer, index) => (
                            <div key={index} className="exam-answer-item">
                                <label>
                                    Answer {index + 1}:
                                    <input
                                        className="answer-text"
                                        type="text"
                                        name="Text"
                                        value={answer.Text}
                                        onChange={(e) => handleAnswerChange(index, e)}
                                        required
                                    />
                                </label>
                                <label>
                                    Correct:
                                    <input
                                        className="exam-answer-checkbox"
                                        type="checkbox"
                                        name="IsCorrect"
                                        checked={answer.IsCorrect}
                                        onChange={(e) => handleAnswerChange(index, e)}
                                    />
                                </label>
                            </div>
                        ))}
                        <button type="button" className="exam-button" onClick={addAnswer}>+ Answer</button>
                        <button type="button" className="exam-button" onClick={saveQuestion}>Save Question</button>
                    </div>
                )}
                {!showAddQuestion && (
                    <button type="button" className="exam-button" onClick={() => setShowAddQuestion(true)}>Add Another Question</button>
                )}
            </form>
        </div>
    );
};

export default ConfigureExam;

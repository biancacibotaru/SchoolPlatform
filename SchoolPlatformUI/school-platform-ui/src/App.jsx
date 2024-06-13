import './App.css';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import StudentCourses from './Components/StudentPages/StudentCourses';
import TeacherCourses from './Components/TeacherPages/TeacherCourses';
import StudentExams from './Components/StudentPages/StudentExams';
import ConfigureExam from './Components/ExamPages/ConfigureExam';
import StudentGrades from './Components/StudentPages/StudentGrades';
import StudentJoinClass from './Components/StudentPages/StudentJoinClass';
import AdminClassesList from './Components/AdminPages/ClassesList';
import StudentListByClass from './Components/AdminPages/StudentListByClass';
import AdminSubjectsList from './Components/AdminPages/SubjectsList';
import AdminTeachersList from './Components/AdminPages/TeachersList';
import AdminJoinRequestsList from './Components/AdminPages/JoinRequestsList';
import CourseMainPage from './Components/CoursePages/CourseMainPage';
import CourseMainPageForTeacher from './Components/CoursePages/CourseMainPageForTeacher';
import CoursePresentation from './Components/CoursePages/CoursePresentation';
import CoursePresentationForTeacher from './Components/CoursePages/CoursePresentationForTeacher';
import HomeworkSubmissions from './Components/CoursePages/HomeworkSubmissions';
import CourseGrades from './Components/CoursePages/GradePage';
import CourseExams from './Components/CoursePages/CourseExams';
import CourseExamsForTeacher from './Components/CoursePages/CourseExamsForTeacher';
import CourseHomeworksForTeacher from './Components/CoursePages/HomeworksPageForTeacher';
import CourseHomeworks from './Components/CoursePages/HomeworksPage';
import ViewExamForStudent from './Components/ExamPages/ViewExamForStudent';
import ViewExamForTeacher from './Components/ExamPages/ViewExamForTeacher';
import ViewExamResultForStudent from './Components/ExamPages/ViewExamResultForStudent';
import Sidebar from './Components/Sidebar/Sidebar';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

const StudentPages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const AdminPages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const TeacherPages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const CoursePages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const ExamPages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <div className="App">
      <div className="background"></div>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<StudentPages />}>
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/student-grades" element={<StudentGrades />} />
        <Route path="/student-exams" element={<StudentExams />} />
        <Route path="/student-join-class" element={<StudentJoinClass />} />
      </Route>
      <Route element={<AdminPages />}>
        <Route path="/admin-classes-list" element={<AdminClassesList />} />
        <Route path="/student-list-by-class/:id" element={<StudentListByClass />} />
        <Route path="/admin-teachers-list" element={<AdminTeachersList />} />
        <Route path="/admin-subjects-list" element={<AdminSubjectsList />} />
        <Route path="/admin-join-requests-list" element={<AdminJoinRequestsList />} />
      </Route>
      <Route element={<TeacherPages />}>
        <Route path="/teacher-courses-list" element={<TeacherCourses />} />
      </Route>
      <Route element={<CoursePages />}>
      <Route path="/course-main-page" element={<CourseMainPage />} />
      <Route path="/course-main-page-for-teacher" element={<CourseMainPageForTeacher />} />
      <Route path="/course-presentation" element={<CoursePresentation />} />
      <Route path="/course-presentation-for-teacher" element={<CoursePresentationForTeacher />} />
      <Route path="/course-grades" element={<CourseGrades />} />
      <Route path="/course-exams" element={<CourseExams />} />
      <Route path="/course-exams-for-teacher" element={<CourseExamsForTeacher />} />
      <Route path="/course-homeworks-for-teacher" element={<CourseHomeworksForTeacher />} />
      <Route path="/course-homeworks" element={<CourseHomeworks />} />
      <Route path="/view-homework-submissions" element={<HomeworkSubmissions />} />
      </Route>
      <Route element={<ExamPages />}>
        <Route path="/configure-exam" element={<ConfigureExam />} />
        <Route path="/view-exam-for-teacher" element={<ViewExamForTeacher />} />
        <Route path="/view-exam-for-student" element={<ViewExamForStudent />} />
        <Route path="/view-exam-result-for-student" element={<ViewExamResultForStudent />} />
      </Route>
    </Routes>
    </div>
  );
};

export default App;

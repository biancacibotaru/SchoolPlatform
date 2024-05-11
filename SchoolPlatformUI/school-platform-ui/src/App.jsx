import './App.css';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import StudentCourses from './Components/StudentPages/StudentCourses';
import StudentExams from './Components/StudentPages/StudentExams';
import StudentGrades from './Components/StudentPages/StudentGrades';
import Sidebar from './Components/StudentPages/Sidebar';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';// Asigură-te că importul către Sidebar este corect

const StudentPages = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<StudentPages />}>
        <Route path="/student-courses" element={<StudentCourses />} />
        <Route path="/student-grades" element={<StudentGrades />} />
        <Route path="/student-exams" element={<StudentExams />} />
      </Route>
    </Routes>
  );
};

export default App;

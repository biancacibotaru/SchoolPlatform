import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';

const StudentJoinClass = () => {
  const [availableClasses, setAvailableClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('');
  const [existingRequest, setExistingRequest] = useState("");

  useEffect(() => {
    const userDataFromCookie = Cookies.get('loggedIn');
    if (userDataFromCookie) {
      const userData = JSON.parse(userDataFromCookie);
      setUserId(userData.Id);
    }
  }, []);

  useEffect(() => {
    const fetchAvailableClasses = async () => {
      try {
        if (!userId) return;

        const response = await fetch("http://localhost:5271/api/class/getallclasses");
        if (response.ok) {
          const data = await response.json();
          setAvailableClasses(data);
        } else {
          console.error("Error fetching available classes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching available classes:", error);
      }
    };

    fetchAvailableClasses();
  }, [userId]);

  useEffect(() => {
    const fetchExistingRequests = async () => {
      try {
        const response = await fetch(`http://localhost:5271/api/JoinRequest/GetJoinRequestForStudent/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setExistingRequest(data);
        } else {
          console.error("Error fetching existing join requests:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching existing join requests:", error);
      }
    };

    fetchExistingRequests();
  }, [userId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleJoinClass = async () => {
    try {
      const isInCheck = (existingRequest.Status === 'in check');
      if (isInCheck) {
        console.log("There is already a join request in check status.");
        return;
      }

      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("classId", selectedClass);
      formData.append("file", file);

      const response = await fetch("http://localhost:5271/api/JoinRequest/InsertJoinRequest", {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("Class joined successfully!");
        window.location.reload();
      } else {
        console.error("Failed to join class:", response.statusText);
      }
    } catch (error) {
      console.error("Error joining class:", error);
    }
  };


  return (
    <div className="container">
      <h2 className="join-class-title">Join in a Classroom</h2>
      {existingRequest && existingRequest.Status === 'in check' && (
        <h4 className="join-request-status">You have a join request in check status. Please wait.</h4>
      )}
      {existingRequest && existingRequest.Status === 'rejected' && (
        <h4 className="join-request-status">Your join request was rejected. Please contact the administrator.</h4>
      )}
      {(!existingRequest) && (
        <>
          <div className='join-in-class'>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="">Select a classroom</option>
              {availableClasses.map((classItem) => (
                <option key={classItem.Id} value={classItem.Id}>
                  {classItem.Code}
                </option>
              ))}
            </select>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleJoinClass}>Join Class</button>
          </div>
        </>
      )}
    </div>
  );
};


export default StudentJoinClass;

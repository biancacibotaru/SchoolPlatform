import React, { useState, useEffect } from 'react';
import './admin.css';

const JoinRequestsList = () => {
    const [requests, setRequests] = useState([]);

    const fetchJoinRequests = async () => {
        try {
            const response = await fetch('http://localhost:5271/api/JoinRequest/GetJoinRequests');
            if (!response.ok) {
                throw new Error('Failed to fetch requests');
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchJoinRequests();
    }, []);

    const updateJoinRequestStatus = async (id, status) => {
        const formData = new FormData();
        formData.append('status', status);

        try {
            const response = await fetch(`http://localhost:5271/api/JoinRequest/UpdateJoinRequestForStudent/${id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to update request status');
            }

            // Refetch the data after updating the status
            await fetchJoinRequests();
        } catch (error) {
            console.error('Error updating request status:', error);
        }
    };

    return (
        <div className="admin-page">
            <h1 className='title'>Join Requests List</h1>
            <div className="table-container">
                {requests.length === 0 ? (
                    <h2 className='no-join-requests'>No join requests.</h2>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Requester Name</th>
                                <th>Classroom</th>
                                <th>Proof</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{req.Firstname + " " + req.Lastname}</td>
                                    <td>{req.Code}</td>
                                    <td>
                                        <p>
                                            <a className='proof-file' href={`data:${req.Content};base64,${req.Content}`} download={req.FileName}>
                                                 👁️ Proof file
                                            </a>
                                        </p>
                                    </td>
                                    <td><button className='decision-join' onClick={() => updateJoinRequestStatus(req.StudentId, 'accepted')}>Accept</button></td>
                                    <td><button className='decision-join' onClick={() => updateJoinRequestStatus(req.StudentId, 'rejected')}>Reject</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default JoinRequestsList;

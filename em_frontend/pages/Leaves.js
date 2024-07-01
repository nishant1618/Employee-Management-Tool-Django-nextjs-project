import React, { useEffect, useState } from "react";
import axios from "axios";
import LeaveForm from "../components/LeaveForm";

const LeavesPage = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/leave/leaves/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Leave Requests</h1>
      <LeaveForm />
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Your Leave Requests</h2>
        {leaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <ul>
            {leaves.map((leave) => (
              <li key={leave.id} className="mb-4 border rounded p-4">
                <p>
                  <strong>Start Date:</strong> {leave.start_date}
                </p>
                <p>
                  <strong>End Date:</strong> {leave.end_date}
                </p>
                <p>
                  <strong>Reason:</strong> {leave.reason}
                </p>
                <p>
                  <strong>Status:</strong> {leave.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LeavesPage;

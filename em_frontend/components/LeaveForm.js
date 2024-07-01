import React, { useState } from "react";
import axiosInstance from "./axiosInstance";

const LeaveForm = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/employees/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const employeeData = response.data;
      // Use the employeeData as needed
      console.log(employeeData);
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.post(
        "/api/leave/leaves/",
        {
          employee: employeeData.id,
          start_date: startDate,
          end_date: endDate,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      // Reset form fields
      setStartDate("");
      setEndDate("");
      setReason("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4">
        <label
          htmlFor="start-date"
          className="block text-gray-700 font-bold mb-2"
        >
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="end-date"
          className="block text-gray-700 font-bold mb-2"
        >
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="reason" className="block text-gray-700 font-bold mb-2">
          Reason
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default LeaveForm;

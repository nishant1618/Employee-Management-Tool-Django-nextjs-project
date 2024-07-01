import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AssignRole from "./AssignRole";
import axiosInstance from "./axiosInstance";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // New state for selected employee
  const [isEditing, setIsEditing] = useState(false);
  const [showAssignRole, setShowAssignRole] = useState(false);
  const [employeeToAssign, setEmployeeToAssign] = useState(null);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchEmployees();
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(res.data);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // Redirect to login if no token
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = () => {
    setShowForm(true);
    setIsEditing(false); // Set isEditing to false for adding a new employee
    setSelectedEmployee(null);
  };
  const handleEmployeeAdded = () => {
    setShowForm(false);
    fetchEmployees(); // Fetch updated employee list after adding a new employee
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false); // Set isEditing to false for adding a new employee
    setSelectedEmployee(null);
  };
  const handleUpdateEmployee = (employee) => {
    setShowForm(true);
    setIsEditing(true); // Set isEditing to true for updating an employee
    setSelectedEmployee(employee); // Set the selected employee
  };
  const handleDeleteEmployee = async (employee) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await axiosInstance.delete(`/api/employees/${employee.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Employee deleted successfully");
      fetchEmployees(); // Fetch updated employee list after deleting an employee
    } catch (err) {
      console.error(err);
      toast.error("Error deleting employee");
    }
  };
  const handleAssignRole = (employee) => {
    setEmployeeToAssign(employee);
    setShowAssignRole(true);
  };

  const handleCloseAssignRole = () => {
    setShowAssignRole(false);
    setEmployeeToAssign(null);
  };

  return (
    <div>
      <div className="bg-gray-500 flex justify-center flex-col items-end pb-1 min-w-full pr-2">
        <h1 className="text-center text-3xl font-bold mb-4 pt-4 text-white min-w-full ">
          Employees
        </h1>
        {role === "Admin" || role === "Manager" ? (
          <button
            className="flex-wrap flex-grow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddEmployee}
          >
            Add Employee
          </button>
        ) : null}
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-0 sm:px-6 lg:px-8">
            <div className="overflow-hidden ">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full table-auto text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-blue-50 dark:bg-blue-700 dark:text-blue-400">
                    <tr>
                      {/* Table headers for employee details */}
                      <th scope="col" className="pl-2 px-2 py-3 font-sans">
                        First-name
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        Last-name
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        Department
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        Email
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        Role
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        User
                      </th>
                      <th scope="col" className="px-2 py-3 font-sans">
                        Phone number
                      </th>
                      {role === "Admin" || role === "Manager" ? (
                        <th scope="col" className="px-2 py-3 font-sans">
                          Action
                        </th>
                      ) : null}

                      {/* ... and so on for other employee fields */}
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        key={employee.id}
                      >
                        <td className="px-2 py-4 pl-4 whitespace-nowrap">
                          {employee.first_name}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.last_name}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.department.name}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.user.email}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.role.name}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.user.id}
                        </td>
                        <td className="px-2 py-4  whitespace-nowrap">
                          {employee.phone_number}
                        </td>
                        {role === "Admin" || role === "Manager" ? (
                          <td className="border px-4 py-2  whitespace-nowrap">
                            <div className="flex justify-center p-2 space-x-4">
                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleUpdateEmployee(employee)}
                              >
                                Update
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleDeleteEmployee(employee)}
                              >
                                Delete
                              </button>
                              <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                                onClick={() => handleAssignRole(employee)}
                              >
                                Assign Role
                              </button>
                            </div>
                          </td>
                        ) : null}
                        {/* ... and so on for other employee data */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {showAssignRole && (
                  <AssignRole
                    employee={employeeToAssign}
                    onClose={handleCloseAssignRole}
                    isEditing={isEditing}
                    selectedEmployee={selectedEmployee}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4 pl-4">
        {showForm && (
          <EmployeeForm
            onEmployeeAdded={handleEmployeeAdded}
            onClose={handleCloseForm}
            isEditing={isEditing}
            selectedEmployee={selectedEmployee}
          />
        )}
      </div>
    </div>
  );
};

export default EmployeeList;

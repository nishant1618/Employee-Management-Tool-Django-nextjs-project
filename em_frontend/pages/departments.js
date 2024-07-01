import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DepartmentForm from "../components/DepartmentForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../components/axiosInstance";
import { ChevronLeftIcon } from "@heroicons/react/solid";
import DashboardNavbar from "../components/DashboardNavbar";

const DepartmentPage = () => {
  const [departments, setDepartment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null); // New state for selected employee
  const [isEditing, setIsEditing] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchDepartments();
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/"); // Redirect to login if no token
        return;
      }

      const response = await axiosInstance.get("/api/departments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartment(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  const handleAddDepartment = () => {
    setShowForm(true);
    setIsEditing(false); // Set isEditing to false for adding a new employee
    setSelectedDepartment(null);
  };
  const handleDepartmentAdded = () => {
    setShowForm(false);
    fetchDepartments(); // Fetch updated employee list after adding a new employee
  };
  const handleCloseForm = () => {
    setShowForm(false);
    setIsEditing(false); // Set isEditing to false for adding a new employee
    setSelectedDepartment(null);
  };
  const handleUpdateDepartment = (department) => {
    setShowForm(true);
    setIsEditing(true); // Set isEditing to true for updating an employee
    setSelectedDepartment(department); // Set the selected employee
  };
  const handleDeleteDepartment = async (department) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    try {
      await axiosInstance.delete(`/api/departments/${department.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Department deleted successfully");
      fetchDepartments(); // Fetch updated employee list after deleting an employee
    } catch (err) {
      console.error(err);
      toast.error("Error deleting department");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <DashboardNavbar />

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-0 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <Head>
                <title>Employee Management</title>
              </Head>

              <div className="bg-gray-600 flex justify-center flex-col pr-2">
                <h1 className="text-center text-3xl font-bold mb-4 pt-4 text-white w-full">
                  Departments
                </h1>
                <div className="flex justify-between items-center mb-1 pt-1">
                  <button
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleBack}
                  >
                    <ChevronLeftIcon className="h-5 w-5 mr-2" />
                    Back
                  </button>
                  {role === "Admin" || role === "Manager" ? (
                    <button
                      className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={handleAddDepartment}
                    >
                      Add Department
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="relative overflow-x-auto shadow-md sm:rounded-lg"></div>
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-blue-50 dark:bg-blue-700 dark:text-blue-400">
                  <tr>
                    {/* Table headers for employee details */}
                    <th scope="col" className="px-6 py-3 font-sans">
                      Department ID
                    </th>
                    <th scope="col" className="px-6 py-3 font-sans">
                      Department Name
                    </th>

                    <th scope="col" className="px-6 py-4 font-sans">
                      Description
                    </th>
                    {role === "Admin" || role === "Manager" ? (
                      <th scope="col" className="px-8 py-4 font-sans">
                        Action
                      </th>
                    ) : null}
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                      key={department.id}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {department.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {department.description}
                      </td>
                      {role === "Admin" || role === "Manager" ? (
                        <td className="whitespace-nowrap border px-4 py-2 ">
                          <div className="flex justify-center p-4 space-x-4">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                              onClick={() => handleUpdateDepartment(department)}
                            >
                              Update
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                              onClick={() => handleDeleteDepartment(department)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ToastContainer />
          </div>
          <div className="w-1/4 pl-4">
            {showForm && (
              <DepartmentForm
                onDepartmentAdded={handleDepartmentAdded}
                onClose={handleCloseForm}
                isEditing={isEditing}
                selectedDepartment={selectedDepartment}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default DepartmentPage;

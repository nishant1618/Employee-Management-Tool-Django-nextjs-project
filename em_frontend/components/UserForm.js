import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosInstance";

const UserForm = ({ onUserAdded, onClose, isEditing, selectedUser }) => {
  const initialFormData = {
    username: "",
    password: "",
    email: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [role, setRole] = useState("");

  useEffect(() => {
    if (isEditing && selectedUser) {
      setFormData({
        username: selectedUser.username,
        password: selectedUser.password,
        email: selectedUser.email,
      });
    }
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, [isEditing, selectedUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if any value in formData is undefined or null

      if (isEditing) {
        try {
          // PATCH operation for updating an employee
          await axiosInstance.patch(
            `/api/users/${selectedUser.id}/`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          console.log("User updated successfully");
          onUserAdded(); // Call the onEmployeeAdded callback
          setFormData({
            username: "",
            password: "",
            email: "",
          });
          toast.success("User updated successfully");
        } catch (err) {
          console.error(err);
          toast.error("Error updating user");
        }
      } else {
        // POST operation for creating a new user
        try {
          const errors = validateForm(formData);
          if (Object.keys(errors).length > 0) {
            // Display validation errors as toasts
            Object.values(errors).forEach((error) => {
              toast.error(error);
            });
            return;
          }
          await axiosInstance.post("/api/users/", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("User created successfully");
          onUserAdded(); // Call the onEmployeeAdded callback
          setFormData({
            username: "",
            password: "",
            email: "",
          });
          toast.success("User created successfully");
        } catch (err) {
          console.error(err);
          toast.error("Error creating user");
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        "An error occurred while submitting the form. Please try again."
      );
    }
  };
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
    });
  };

  const handleClose = () => {
    resetForm(); // Reset form data
    onClose(); // Call the onClose callback
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.username) {
      errors.name = "Username is required";
    }
    if (!formData.password) {
      errors.name = "Password is required";
    }
    if (!formData.email) {
      errors.name = "Email is required";
    }
    return errors;
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                "Update User"
              </h3>
              <div className="mt-2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="name"
                      >
                        User Name
                      </label>
                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="name"
                        type="text"
                        name="username"
                        placeholder="xyz123"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="pwd"
                      >
                        Password
                      </label>

                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="pwd"
                        type="password"
                        name="password"
                        placeholder="*******"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="xyz@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  {role === "Admin" || role === "Manager" ? (
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        type="submit"
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

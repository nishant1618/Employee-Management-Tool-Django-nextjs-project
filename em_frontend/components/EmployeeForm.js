import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "./axiosInstance";
const EmployeeForm = ({
  onEmployeeAdded,
  onClose,
  isEditing,
  selectedEmployee,
}) => {
  const initialFormData = {
    user: {
      username: "",
      password: "",
      email: "",
    },
    department_id: "",
    role_id: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState("");
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartment] = useState([]);

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
    fetchDepartments();

    if (isEditing && selectedEmployee) {
      setFormData({
        user: {
          username: selectedEmployee.user.username,
          password: selectedEmployee.user.password,
          email: selectedEmployee.user.email,
        },
        department_id: selectedEmployee.department.id,
        role_id: selectedEmployee.role.id,
        first_name: selectedEmployee.first_name,
        last_name: selectedEmployee.last_name,
        phone_number: selectedEmployee.phone_number,
      });
    }
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    console.log(storedRole);
  }, [isEditing, selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      const res = await axiosInstance.get("/api/employees/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEmployees(res.data);

      const token = localStorage.getItem("token");
    } catch (err) {
      console.error(err);
    }
  };
  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/index"); // Redirect to login if no token
        return;
      }

      const response = await axiosInstance.get("/api/departments/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartment(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get("/api/roles/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("user.")) {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          [name.split(".")[1]]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const errors = validateForm(formData);
      if (Object.keys(errors).length > 0) {
        // Display validation errors as toasts
        Object.values(errors).forEach((error) => {
          toast.error(error);
        });
        return;
      }

      if (isEditing) {
        console.log(formData, "this is the form data");
        // PATCH operation for updating an employee
        try {
          const duplicateEmail = employees.some(
            (employee) =>
              employee.user.email === formData.user.email &&
              employee.id !== selectedEmployee.id
          );

          if (duplicateEmail) {
            toast.error(
              "This email is already registered. Please use a different email."
            );
            return;
          }
          const patchData = {
            user: {
              email: formData.user.email,
            },
            department_id: formData.department_id,
            role_id: formData.role_id,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
          };

          if (formData.user.username !== selectedEmployee.user.username) {
            patchData.user = formData.user;
          }

          await axiosInstance.patch(
            `/api/employees/${selectedEmployee.id}/`,
            patchData,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          onEmployeeAdded();
          setFormData({
            user: {
              username: "",
              password: "",
              email: "",
            },
            department_id: "",
            role_id: "",
            first_name: "",
            last_name: "",
            phone_number: "",
          });
          console.log(formData);
          toast.success("Employee updated successfully");
        } catch (err) {
          console.error("Error updating employee:", err);
          handleBackendError(err);
          if (
            err.response &&
            err.response.data &&
            err.response.data.user &&
            err.response.data.user.username
          ) {
            toast.error(err.response.data.user.username[0]);
          } else {
            console.error("Error updating employee:", err);
          }
        }
      } else {
        try {
          const duplicateEmail = employees.some(
            (employee) => employee.user.email === formData.user.email
          );

          if (duplicateEmail) {
            toast.error(
              "This email is already registered. Please use a different email."
            );
            return;
          }

          await axiosInstance.post("/api/employees/", formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          console.log("Employee created successfully");
          onEmployeeAdded(); // Call the onEmployeeAdded callback
          setFormData({
            user: {
              username: "",
              password: "",
              email: "",
            },
            department_id: "",
            role_id: "",
            first_name: "",
            last_name: "",
            phone_number: "",
          });
          toast.success("Employee created successfully");
        } catch (err) {
          console.error("Error creating employee:", err);
          handleBackendError(err);
        }
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        "An error occurred while submitting the form.Enter correct details and Please try again."
      );
    }
  };
  const resetForm = () => {
    setFormData({
      user: {
        username: "",
        password: "",
        email: "",
      },
      department_id: "",
      role_id: "",
      first_name: "",
      last_name: "",
      phone_number: "",
    });
  };

  const handleClose = () => {
    resetForm(); // Reset form data
    onClose(); // Call the onClose callback
  };

  const handleBackendError = (err) => {
    if (err.response && err.response.data) {
      const errorData = err.response.data;

      // Customize handling of known errors
      if (errorData.user && errorData.user.username) {
        toast.error(`Username error: ${errorData.user.username[0]}`);
      }
      if (errorData.user && errorData.user.email) {
        toast.error(`Email error: ${errorData.user.email[0]}`);
      }
      if (errorData.department_id) {
        toast.error(`Department error: ${errorData.department_id[0]}`);
      }
      if (errorData.role_id) {
        toast.error(`Role error: ${errorData.role_id[0]}`);
      }
      if (errorData.phone_number) {
        toast.error(`Phone number error: ${errorData.phone_number[0]}`);
      }
    } else {
      console.error("An unexpected error occurred:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const validateForm = (formData) => {
    const errors = {};

    if (!formData.first_name) {
      errors.name = "First name is required";
    }
    if (!formData.last_name) {
      errors.name = "Last name is required";
    }

    if (!formData.user.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.user.email)) {
      errors.email = "Invalid email address";
    }

    if (!formData.role_id) {
      errors.role = "Role is required";
    }

    if (!formData.department_id) {
      errors.department = "Department is required";
    }
    if (!formData.phone_number) {
      errors.role = "Phone number is required";
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
                {isEditing ? "Update Employee" : "Add Employee"}
              </h3>

              <div className="mt-2">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="user"
                      >
                        User Name
                      </label>
                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="user"
                        type="text"
                        name="user.username"
                        placeholder="example123"
                        value={formData.user.username}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="password"
                        type="password"
                        name="user.password"
                        placeholder="xxxxxxxxxxx"
                        value={formData.user.password}
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
                        name="user.email"
                        placeholder="xyz@example.com"
                        value={formData.user.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="dept"
                      >
                        Department
                      </label>
                      <select
                        className="px-1 py-1 mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="dept"
                        name="department_id"
                        value={formData.department_id}
                        onChange={handleChange}
                      >
                        <option value="">Select a department</option>
                        {departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="role"
                      >
                        Role
                      </label>

                      <select
                        className="px-1 py-1 mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="role"
                        name="role_id"
                        onChange={handleChange}
                        value={formData.role_id}
                      >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="name"
                      >
                        First Name
                      </label>

                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="name"
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="lname"
                      >
                        Last Name
                      </label>

                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="lname"
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700"
                        htmlFor="phone"
                      >
                        Phone Number
                      </label>

                      <input
                        className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        id="phone"
                        type="tel"
                        name="phone_number"
                        placeholder="+91-xxxxxxxxxx"
                        value={formData.phone_number}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Add other form fields */}
                  {role === "Admin" || role === "Manager" ? (
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                        type="submit"
                      >
                        {isEditing ? "Update" : "Submit"}
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

export default EmployeeForm;

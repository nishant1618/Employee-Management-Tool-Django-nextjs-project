// pages/login.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../components/axiosInstance";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/token/", {
        username,
        password,
      });
      const token = response.data.access;
      const { access, refresh, role } = response.data;
      // Store the token in localStorage or state
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (response.status === 200) {
        localStorage.setItem("isLogIn", "true");

        router.push("/dashboard");
        const isLoggedIn = localStorage.getItem("isLogIn");
        console.log(isLoggedIn);
      }
      //console.log(token);
    } catch (error) {
      toast.error(`Wrong Username/password!! Please try again.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000); // Adjust the delay time as needed
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">
          Welcome!!
        </h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className="border border-gray-400 p-2 w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="border border-gray-400 p-2 w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default LoginPage;

import EmployeeList from "../components/EmployeeList";
import "react-toastify/dist/ReactToastify.css";
import DashboardNavbar from "../components/DashboardNavbar";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
    const isLoggedIn = localStorage.getItem("isLogIn") === "true";
    console.log(isLoggedIn);
    if (isLoggedIn) {
      // Show the login successful toast
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset the login state
      localStorage.removeItem("isLogIn");
    }
  }, [router]);

  return (
    <div>
      <DashboardNavbar />
      <div className="bg-gray-600 flex justify-center align-center ">
        <h1 className="text-center text-3xl font-bold mb-4 pt-4 text-white	">
          Employee Management Dashboard
        </h1>
      </div>
      <EmployeeList />
      <ToastContainer />
    </div>
  );
};

export default Dashboard;

// DashboardNavbar.js
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const DashboardNavbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav(!showNav);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);
  const router = useRouter();
  const [role, setRole] = useState("");

  const currentRoute = router.pathname;

  const handleLogout = () => {
    // Remove the JWT token from local storage
    if (!confirm("Are you sure you want to Logout?")) return;
    localStorage.removeItem("token");

    // Redirect to the login page
    router.push("/");
  };
  return (
    <nav className="bg-gray-800">
      <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 pl-2">
              <span className="text-white font-bold">Hyscaler</span>
            </div>
          </div>
          <div className="hidden md:block p-2">
            <div className="ml-4 flex items-center md:ml-6">
              {currentRoute !== "/dashboard" && (
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              {(currentRoute !== "/users" && role === "Admin") ||
              role === "Manager" ? (
                <Link
                  href="/users"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Users
                </Link>
              ) : null}
              {currentRoute !== "/roles" && (
                <Link
                  href="/roles"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Roles
                </Link>
              )}
              {currentRoute !== "/departments" && (
                <Link
                  href="/departments"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Departments
                </Link>
              )}
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleNav}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <FaBars className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showNav && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/users"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Users
            </Link>
            <Link
              href="/roles"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Roles
            </Link>
            <Link
              href="/departments"
              className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Departments
            </Link>
            <button
              className="text-red-300 hover:bg-red-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;

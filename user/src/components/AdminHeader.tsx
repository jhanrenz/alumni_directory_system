import { useState } from "react";
import {
  Info, Menu, X, User, LogOut,
  ChevronDown, UserCheck, CalendarCheck,
  LayoutDashboard, Users
} from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import logo from "../assets/psulogo.png";
import { useLogoutAdmin } from "../hooks/auth/adminAuth";
import { useCurrentUser } from "../hooks/auth/userAuth";

const apiUrl = import.meta.env.VITE_BASE_APP_URL?.replace("/api", "") ?? "";

const AdminHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogoutAdmin();
  const { data: currentUser } = useCurrentUser();

  const handleLogout = () => {
    logout(undefined, { onSuccess: () => navigate("/admin/login") });
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-gray-200">
        <nav className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src={logo} alt="PSU Logo" className="h-8 sm:h-10" />
            <span className="text-lg sm:text-xl font-semibold text-gray-800">
              PSU-AC
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            <ul className="flex items-center gap-4 lg:gap-6 text-gray-600 font-medium">

              <li>
                <Link to="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
              </li>

              <li>
                <Link to="/admin/alumni/users" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <Users size={18} /> Alumni
                </Link>
              </li>

              <li>
                <Link to="/admin/users" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <UserCheck size={18} /> Requests
                </Link>
              </li>

              <li>
                <Link to="/admin/courses" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <Info size={18} /> Courses
                </Link>
              </li>

              <li>
                <Link to="/admin/events" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100">
                  <CalendarCheck size={18} /> Events
                </Link>
              </li>

            </ul>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-2 rounded-full hover:bg-gray-100"
              >
                {/* Avatar */}
                {currentUser?.image ? (
                  <img
                    src={`${apiUrl}/storage/${currentUser.image}`}
                    className="w-9 h-9 rounded-full object-cover border"
                    alt="Admin"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200">
                    <User size={16} />
                  </div>
                )}

                <ChevronDown size={16} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-2 sm:right-0 mt-2 w-52 bg-white border rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-medium truncate">
                      {currentUser?.email}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut size={16} />
                    {isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="bg-white border rounded-xl shadow-md mt-3 overflow-hidden max-h-[80vh] overflow-y-auto">

              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100">
                Dashboard
              </Link>

              <Link to="/admin/alumni/users" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100">
                Alumni Directory
              </Link>

              <Link to="/admin/users" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100">
                Requests
              </Link>

              <Link to="/admin/courses" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100">
                Courses
              </Link>

              <Link to="/admin/events" onClick={() => setIsOpen(false)} className="block px-4 py-3 hover:bg-gray-100">
                Events
              </Link>

              <div className="flex items-center gap-3 px-4 py-3 border-t bg-gray-50">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-sm truncate">
                  {currentUser?.email}
                </span>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>

            </div>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-[80px] sm:pt-[90px]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminHeader;
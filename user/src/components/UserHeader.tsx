import { useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  CalendarCheck,
  UserRoundSearch,
} from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import logo from "../assets/psulogo.png";
import { useLogoutUser, useCurrentUser } from "../hooks/auth/userAuth";

const apiUrl =
  import.meta.env.VITE_BASE_APP_URL?.replace("/api", "") ?? "";

const UserHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { mutate: logout, isPending } = useLogoutUser();
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => navigate("/login"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur bg-white/80 border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="PSU Logo" className="h-9 sm:h-10" />
            <span className="text-lg sm:text-xl font-semibold text-gray-800 tracking-tight">
              PSU-AC
            </span>
          </Link>

          {/* RIGHT: Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">

            {/* Events */}

            <Link
              to="/alumni"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <UserRoundSearch size={18} /> Alumni
            </Link>

            <Link
              to="/events"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <CalendarCheck size={18} /> Events
            </Link>


            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition"
              >
                {currentUser?.image ? (
                  <img
                    src={`${apiUrl}/storage/${currentUser.image}`}
                    className="w-9 h-9 rounded-full object-cover border"
                    alt="User"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        "https://via.placeholder.com/100")
                    }
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-500">
                    <User size={16} />
                  </div>
                )}

                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  
                  <div className="px-4 py-3 border-b bg-gray-50">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {currentUser?.email || "Loading..."}
                    </p>
                    <p className="text-xs text-gray-500">Logged in</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                  >
                    <LogOut size={16} />
                    {isPending ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </nav>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden px-4 pb-4">
            <div className="bg-white border rounded-xl shadow-md mt-3 overflow-hidden">

          
              <Link
                to="/alumni"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
              >
                <UserRoundSearch size={18} /> Alumni
              </Link>

              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-100"
              >
                <CalendarCheck size={18} /> Events
              </Link>

              {/* User Info */}
              <div className="flex items-center gap-3 px-4 py-3 border-t bg-gray-50">
                {currentUser?.image ? (
                  <img
                    src={`${apiUrl}/storage/${currentUser.image}`}
                    className="w-9 h-9 rounded-full object-cover"
                    alt="User"
                  />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200">
                    <User size={16} />
                  </div>
                )}
                <span className="text-sm text-gray-700 truncate">
                  {currentUser?.email}
                </span>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                disabled={isPending}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-red-50 hover:text-red-600 transition"
              >
                <LogOut size={18} />
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default UserHeader;
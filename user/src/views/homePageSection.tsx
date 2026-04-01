import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";

const HomePageSection = () => {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center text-white min-h-screen"
    >
      {/* Centered container */}
      <div className="relative w-full max-w-4xl px-6 py-16 text-center">

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Pangasinan State University - Asingan Campus
        </h1>

        <h2 className="text-lg md:text-2xl font-semibold mb-8 text-gray-300">
          "PSUNIAN's Alumni Directory"
        </h2>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-md font-medium transition"
          >
            <LogIn className="w-5 h-5" /> Login
          </Link>

          <Link
            to="/register"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black rounded-md font-medium transition"
          >
            <UserPlus className="w-5 h-5" /> Register
          </Link>

        </div>
      </div>
    </section>
  );
};

export default HomePageSection;
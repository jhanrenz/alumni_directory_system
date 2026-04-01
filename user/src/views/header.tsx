import { useState } from "react";
import { Home, Info, Phone, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from '../assets/psulogo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 left-0 w-full z-50 flex justify-center px-4">
      <nav className="w-full max-w-6xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl px-6 py-3 flex justify-between items-center text-white">
        
        {/* Logo + Text */}
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="PSU Logo" className="h-10 md:h-12" />
          <span className="text-white text-lg md:text-2xl font-semibold tracking-wide">
            PSU-AC
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          <li>
            <a href="#home" className="flex items-center gap-2 hover:text-blue-400 transition">
              <Home size={18} /> Home
            </a>
          </li>
          <li>
            <a href="#about" className="flex items-center gap-2 hover:text-blue-400 transition">
              <Info size={18} /> About
            </a>
          </li>
          <li>
            <a href="#footer" className="flex items-center gap-2 hover:text-blue-400 transition">
              <Phone size={18} /> Contact
            </a>
          </li>

          {/* CTA Button */}
          <li>
            <Link 
              to="/login"
              className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition shadow-md flex items-center gap-2"
            >
              <Home size={16} /> Get Started
            </Link>
          </li>
        </ul>

        {/* Mobile Button */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 w-full px-4 md:hidden">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg py-6 flex flex-col items-center gap-6 text-white">
            
            <a href="#home" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Home size={18} /> Home
            </a>

            <a href="#about" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Info size={18} /> About
            </a>

            <a href="#footer" onClick={() => setIsOpen(false)} className="flex items-center gap-2 hover:text-blue-400 transition">
              <Phone size={18} /> Contact
            </a>

            <Link
              to="/login"
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <Home size={16} /> Get Started
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
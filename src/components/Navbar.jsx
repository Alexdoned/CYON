import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock, Camera } from "lucide-react";
import logo from "/cyonlogo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src={logo} alt="CYON Logo" className="w-10 h-10" />
            <span className="font-bold text-lg hidden sm:inline">CYON</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="hover:text-green-200 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="hover:text-green-200 transition-colors duration-200 flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Events
            </Link>
            <Link
              to="/register"
              className="bg-white text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-green-100 transition-colors duration-200"
            >
              Register
            </Link>
            <Link
              to="/payment"
              className="hover:text-green-200 transition-colors duration-200"
            >
              Payment
            </Link>
            <Link
              to="/admin/login"
              className="flex items-center gap-2 text-green-200 hover:text-white transition-colors duration-200 text-sm font-medium"
            >
              <Lock className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-green-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/events"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              <Camera className="w-4 h-4" />
              Events
            </Link>
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 bg-white text-green-800 rounded-md font-semibold hover:bg-green-100 transition-colors duration-200"
            >
              Register
            </Link>
            <Link
              to="/payment"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Payment
            </Link>
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-green-200 hover:text-white hover:bg-green-700 rounded-md transition-colors duration-200"
            >
              <Lock className="w-4 h-4" />
              Admin Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

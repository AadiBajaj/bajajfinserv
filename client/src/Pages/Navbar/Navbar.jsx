import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import UserMenu from "./UserMenu";

const Navbar = ({ handleLoginPopup, user, setUser }) => {
  const location = useLocation();
  const isUpdateProfilePage = location.pathname === '/update-profile';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className={`navbar ${isUpdateProfilePage ? 'transparent-nav' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/">
          <div className="logo">
            <img src="./assets/logo.gif" alt="Logo" className="logo-image" />
            <span>साहस Shakti</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/exercises" onClick={() => setIsMenuOpen(false)}>Exercises</Link></li>
          {/* <li><Link to="/leaderboard" onClick={() => setIsMenuOpen(false)}>LeaderBoard</Link></li> */}
          <li><Link to="/contactUs" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>

          
        </ul>

        {/* Right Section */}
        <div className="nav-right">
          {user ? (
            <UserMenu user={user} setUser={setUser} />
          ) : (
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 transition-all duration-300"
              onClick={handleLoginPopup}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

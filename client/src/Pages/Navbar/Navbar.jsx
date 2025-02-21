import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import UserMenu from "./UserMenu";
import { getProfile } from "../../services/profileService";

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
            <img src="./assets/paws4home_logo.png" alt="Logo" className="logo-image" />
            <span>Paws4Home</span>
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <i className={`fas fa-${isMenuOpen ? 'times' : 'bars'}`}></i>
        </button>

        {/* Navigation Links */}
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/adopt" onClick={() => setIsMenuOpen(false)}>Adopt</Link></li>
          <li><Link to="/rehome" onClick={() => setIsMenuOpen(false)}>Rehome</Link></li>
          <li><Link to="/pet-store" onClick={() => setIsMenuOpen(false)}>Store</Link></li>
          <li><Link to="/about" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/care-guide" onClick={() => setIsMenuOpen(false)}>Care Guide</Link></li>

          
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

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { getProfile } from '../../services/profileService';

const UserMenu = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const [mail, setmail] = useState("");

  const loadUserData = async () => {
    try{
      const response = await getProfile();
      if (response.success && response.user) {
        const user = response.user;
        setmail(user.email || "");
      }
    }catch(err){
      console.log("Something went wrong");
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    loadUserData();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };
  const handleAdmin = () => {
    navigate('/admin-panel');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="user-menu-button"
      >
        <FaUser />
        <span>{user.name}</span>
        <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="menu-item" onClick={handleProfile}>
            <FaUser />
            <span>Profile</span>
          </div>
            <div className="menu-divider"></div>

            {
              mail == "admin@gmail.com" ? <>
              <div className="menu-item" onClick={handleAdmin}>
            <FaUser />
            <span>Admin Panel</span>
          </div>
          <div className="menu-divider"></div></>: ""
          }
          <div className="menu-item" onClick={handleLogout}>
            <FaSignOutAlt />
            <span>Logout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;

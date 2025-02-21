import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Pages/Navbar/Navbar";
import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPopup from "./Pages/LoginSignUp/loginPopUp";
import UpdateProfile from "./Pages/UpdateProfile/UpdateProfile";
import ExercisePage from "./Pages/ExercisePage/ExercisePage";


const App = () => {
  const [loginPopup, setLoginPopup] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const toggleLoginPopup = () => {
    setLoginPopup(!loginPopup);
  };

  const handleLoginSuccess = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoginPopup(false);
  };

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar handleLoginPopup={toggleLoginPopup} user={user} setUser={setUser} />
      <LoginPopup loginPopup={loginPopup} handleLoginPopup={toggleLoginPopup} onLoginSuccess={handleLoginSuccess} />

      <div className={loginPopup ? "blur-sm bg-black/30" : ""}>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path="/profile" element={<UpdateProfile />} />
            <Route path="/exercises" element={<ExercisePage />} />


          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;

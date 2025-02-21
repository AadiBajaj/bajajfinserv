// import React from "react";
// import { motion } from "framer-motion";

// export default function LandingPage() {
//   return (
//     <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center">
//       {/* Hero Section */}
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//         className="text-center"
//       >
//         <h1 className="text-6xl font-extrabold uppercase tracking-widest">
//           Flex It Out
//         </h1>
//         <p className="text-lg text-gray-400 mt-4">
//           Get stronger, fitter, and healthier with us!
//         </p>

//         {/* Call to Action Buttons */}
//         <div className="mt-8 flex gap-6">
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 transition"
//           >
//             Get Started
//           </motion.button>

//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//             className="px-6 py-3 border border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-black transition"
//           >
//             Learn More
//           </motion.button>
//         </div>
//       </motion.div>

//       {/* Hero Image */}
//       <motion.img
//         src="https://th.bing.com/th/id/R.d3642ee216e4e64a0117f143d400439a?rik=Vhsb72afp7CjLA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-B20YvaObj2o%2fUazMM-Noz6I%2fAAAAAAAAAl0%2f0mA0K5RQO_A%2fs1600%2fbodybuilder-762858.jpg&ehk=S8ZPOXip%2bXBsfV4zYrWTM939QZ0f1YIwlsfdZKLtWwM%3d&risl=&pid=ImgRaw&r=0"
//         alt="Fitness"
//         className="w-80 mt-8 rounded-lg shadow-xl"
//         initial={{ opacity: 0, scale: 0.8 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 1 }}
//       />
//     </div>
//   );
// }
import React from "react";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-text">
          <h1>🏋‍♂ AI-Powered Fitness Tracking</h1>
          <p>Enhance your workouts with real-time AI feedback & smart motion tracking.</p>
          <div className="hero-buttons">
            <a href="exercises"><button className="cta-button primary">Start Workout</button></a>
            <a href="contactus"><button className="cta-button secondary">Contact Us</button></a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://i.ytimg.com/vi/CN_RsGkRScM/maxresdefault.jpg" alt="AI Fitness" />
        </div>
      </header>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>📌 How It Works</h2>
        <div className="steps-container">
          <div className="step">
            {/* <img src="https://cdn-icons-png.flaticon.com/512/2956/2956691.png" alt="Camera Assistance" /> */}
            <h3>🎥 Camera Assistance</h3>
            <p>Enable your camera to track body movements with AI.</p>
          </div>
          <div className="step">
            {/* <img src="https://cdn-icons-png.flaticon.com/512/875/875696.png" alt="AI Activity Recognition" /> */}
            <h3>🤖 AI Activity Recognition</h3>
            <p>Smart AI detects exercise forms and suggests improvements.</p>
          </div>
          <div className="step">
            {/* <img src="https://cdn-icons-png.flaticon.com/512/2089/2089386.png" alt="Workout Counter" /> */}
            <h3>🔢 Workout Counter</h3>
            <p>Automatically count reps, track performance, and see results.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>🚀 Why Choose AI Fitness?</h2>
        <p className="features-subtext">Track your movements with precision, get real-time feedback, and challenge yourself daily.</p>
        <div className="feature-grid ">
          <div className="feature">
            <img src="https://indatalabs.com/wp-content/uploads/2022/03/activity-recognition-sports.jpeg" alt="Tracking" />
            <h3>🎥 Real-Time Tracking</h3>
            <p>Advanced AI-powered motion detection ensures accurate form correction.</p>
          </div>
          
          <div className="feature">
            <img src="https://static.vecteezy.com/system/resources/previews/024/407/665/non_2x/leaderboard-flat-icon-design-illustration-sports-and-games-symbol-on-white-background-eps-10-file-vector.jpg" alt="Leaderboard" />
            <h3>🏆 Compete & Win Rewards</h3>
            <p>Join global leaderboards, challenge friends, and win exciting rewards.</p>
          </div>
          
          <div className="feature">
            <img src="https://i.pinimg.com/736x/99/a5/40/99a54051fffcec34aa7069d01d5807cf.jpg" alt="Auto Rep Counting" />
            <h3>📊 Auto Rep Counting</h3>
            <p>AI automatically counts squats, push-ups, and more to track progress.</p>
          </div>
        </div>
      </section>

      {/* Exercise CTA Button */}
      <section className="community">
        <a href="exercises" className="cta-button large">🚀 Start Your Workout Now!</a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 AI Fitness. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
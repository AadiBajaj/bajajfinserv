import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Lottie from "lottie-react";
import animationData from "../../assets/exercise.json";

const exercises = [
  { name: "bicep", icon: "🏋️" },
  { name: "shoulderpress", icon: "🏋️" },
  { name: "pushup", icon: "🏋️" },
  { name: "squat", icon: "🏋️" },
];

export default function ExercisePage() {
  const openExerciseWindow = async (exerciseName) => {
    try {
      const apiUrl = `http://localhost:5000/${exerciseName.toLowerCase().replace(/\s+/g, "-")}`;
      const response = await axios.post(apiUrl, { exercise: exerciseName });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  return (
    <div
      className="h-screen w-full text-white flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(135deg, #12123b, #1f1f5b)" }}
    >
      {/* Fixed Heading */}
      <div className="w-full flex justify-center items-center linear-gradient(135deg, #12123b, #1f1f5b) py-6 fixed top-[110px] z-10">
        <h1 className="text-5xl tracking-widest">CHOOSE AN EXERCISE</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-grow items-center justify-center gap-12 mt-20">
        {/* Exercises Grid */}
        <div className="grid grid-cols-2 gap-8">
          {exercises.map((exercise, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-white text-black p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-36 h-36"
            >
              <span className="text-4xl">{exercise.icon}</span>
              <p className="mt-2 font-semibold">{exercise.name}</p>
              <a
                href={`http://localhost:5000/${exercise.name.toLowerCase().replace(/\s+/g, "-")}`}
                target="_blank"
              >
                <button className="mt-2 px-4 py-1 bg-violet-600 text-white rounded-lg text-sm">
                  Start
                </button>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Right: Bodybuilder Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-64 h-64"
        >
          <Lottie animationData={animationData} loop autoPlay />
        </motion.div>
      </div>
    </div>
  );
}

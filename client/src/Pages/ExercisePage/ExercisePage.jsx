import React from "react";
import { motion } from "framer-motion";

const exercises = [
  { name: "Squats", icon: "🏋️" },
  { name: "Shoulder Press", icon: "🏋️" },
  { name: "Hand Curls", icon: "🏋️" },
  { name: "Lunges-Left", icon: "🏋️" },
  { name: "Push-ups", icon: "🏋️" },
  { name: "Sit-ups", icon: "🏋️" },
];

export default function ExercisePage() {
  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
      {/* Fixed Heading (Centered & Properly Spaced) */}
      <div className="w-full flex justify-center items-center bg-black py-6 fixed top-[80px] z-10">
        <h1 className="text-5xl font-extrabold uppercase tracking-widest">
          CHOOSE AN EXERCISE
        </h1>
      </div>

      {/* Main Content: Grid and Image */}
      <div className="flex flex-grow items-center justify-center gap-12 mt-20">
        {/* Exercises Grid */}
        <div className="grid grid-cols-3 gap-8">
          {exercises.map((exercise, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="bg-red-500 text-black p-6 rounded-lg shadow-lg flex flex-col items-center justify-center w-36 h-36"
            >
              <span className="text-4xl">{exercise.icon}</span>
              <p className="mt-2 font-semibold">{exercise.name}</p>
            </motion.div>
          ))}
        </div>

        {/* Right: Bodybuilder Image */}
        <motion.img
          src="https://th.bing.com/th/id/R.d3642ee216e4e64a0117f143d400439a?rik=Vhsb72afp7CjLA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-B20YvaObj2o%2fUazMM-Noz6I%2fAAAAAAAAAl0%2f0mA0K5RQO_A%2fs1600%2fbodybuilder-762858.jpg&ehk=S8ZPOXip%2bXBsfV4zYrWTM939QZ0f1YIwlsfdZKLtWwM%3d&risl=&pid=ImgRaw&r=0"
          alt="Bodybuilder"
          className="w-64 h-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  );
}

import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-purple-100 text-blue-300 flex flex-col items-center justify-center gap-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-xl"
      >
        <h1 className="text-6xl font-extrabold uppercase tracking-widest">
          Flex It Out
        </h1>
        <p className="text-lg text-yellow-900 mt-4">
          Get stronger, fitter, and healthier with us!
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex justify-center gap-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 bg-red-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-red-700 transition"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-6 py-3 border border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-black transition"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>

      {/* Video Section */}
      <motion.video
        className="w-80 mx-auto rounded-lg shadow-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        controls
      >
        <source src="https://cdn.pixabay.com/video/2023/10/20/185802-876514091_large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>
    </div>
  );
}

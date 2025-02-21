import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = ({ handleSignIn, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      toast.success("Login successful!");
      onLoginSuccess();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md my-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Enter your email"
          className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-gray-700 my-auto">Password</label>
        <div className="mt-1 relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className="h-5 w-5 text-white-400" />
            ) : (
              <FaEye className="h-5 w-5 text-white-400" />
            )}
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-1.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Logging in..." : "Log in"}
        </motion.button>


        <p className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleSignIn}
            className="font-medium text-white-600 hover:text-white-500 focus:outline-none focus:underline transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
    </div>
  );
};

export default Login;
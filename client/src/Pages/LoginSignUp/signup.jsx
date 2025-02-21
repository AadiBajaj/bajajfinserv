import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Signup = ({ handleSignIn, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "India",
    state: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success("Registration successful!");
      onLoginSuccess();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      {[
        { label: "Name", name: "name", type: "text", placeholder: "Enter your name", required: true },
        { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
        { label: "Password", name: "password", type: showPassword ? "text" : "password", placeholder: "Enter your password", required: true, icon: true },
        { label: "Confirm Password", name: "confirmPassword", type: showPassword ? "text" : "password", placeholder: "Confirm your password", required: true, icon: true },
        { label: "Country", name: "country", type: "text", placeholder: "Enter your country", required: true, value: "India", disabled: true },
        { label: "State", name: "state", type: "text", placeholder: "Enter your state", required: true },
        { label: "ZIP Code", name: "zipCode", type: "text", placeholder: "Enter your ZIP code", required: true },
      ].map((field, index) => (
        <motion.div
          key={field.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <div className="mt-1 relative">
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
              disabled={field.disabled}
              placeholder={field.placeholder}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
            />
            {field.icon && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="h-5 w-5 text-white-400" /> : <FaEye className="h-5 w-5 text-white-400" />}
              </button>
            )}
          </div>
        </motion.div>
      ))}

      <div className="space-y-4">
        <motion.button
          type="submit"
          className="w-full bg-blue-600 text-white py-1.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Signing up..." : "Sign up"}
        </motion.button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSignIn}
            className="font-medium text-white-600 hover:text-white-500"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default Signup;
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import axios from "axios";  

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name must be at least 3 characters long"],
      maxlength: [25, "Maxlength can be 25"],
      match: [/^[A-Z][a-z]*\s[A-Z][a-z]*$/, "Name must have first and last names starting with uppercase letters and only first alphabhet should be uppercase"]
    },
    
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        "Please enter a valid email address"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      validate: {
        validator: function(v) {
          // Only validate password if it's being modified
          if (!this.isModified('password')) return true;
          return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$/.test(v);
        },
        message: "Password must contain at least one uppercase letter, one number, and one special character (including dots)"
      }
    },    
    phone: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty phone number
          return /^[6-9]\d{9}$/.test(v);
        },
        message: props => `${props.value} is not a valid Indian phone number. It should be 10 digits starting with 6-9`
      },
    },
    country: {
      type: String,
      default: "India",
    },
    state: {
      type: String,
      validate: {
        validator: async function(value) {
          if (!value || !this.zipCode) return true;
          return await this.validateState(value);
        },
        message: "Invalid state for the given pincode"
      }
    },
    zipCode: {
      type: String,
      validate: {
        validator: function(v) {
          if (!v) return true; // Allow empty zipCode
          return /^\d{6}$/.test(v);
        },
        message: "Pincode must be 6 digits"
      }
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.validateState = async function(value) {
  try {
    const response = await axios.get(`https://api.postalpincode.in/pincode/${this.zipCode}`);
    if (response.data[0].Status === "Success") {
      const postOffices = response.data[0].PostOffice;
      const states = [...new Set(postOffices.map(po => po.State))];
      return states.includes(value);
    }
    return false;
  } catch (error) {
    console.error("Error validating state:", error);
    return false;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
// import express from 'express';
// import dotenv from 'dotenv';
// import connectDB from './config/db.js';
// import userRoutes from './Routes/user.routes.js';
// import { errorHandler } from './Middlewares/errorHandler.js';
// import { handleError } from './utils/error.js';
// import cors from "cors";

// // Load environment variables
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();

// app.use(express.json());


// const corsOptions = {
//   origin: "*", 
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// };

// app.use(cors(corsOptions));

// // Log all incoming requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });

// // Routes
// app.use("/api/users", userRoutes);

// // Error handling middleware
// app.use(handleError); // Handle general errors
// app.use(errorHandler);

// // Start server
// const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './Routes/user.routes.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import { handleError } from './utils/error.js';
import cors from "cors";
import nodemailer from "nodemailer";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
};

app.use(cors(corsOptions));

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail
    pass: process.env.EMAIL_PASS, // App password from Google
  },
});

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER, // Your receiving email
    subject: `New Contact Us Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Email sending failed.", error });
  }
});

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(handleError); // Handle general errors
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
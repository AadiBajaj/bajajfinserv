import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './Routes/user.routes.js';
import { errorHandler } from './Middlewares/errorHandler.js';
import { handleError } from './utils/error.js';
import cors from "cors";

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

// Routes
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(handleError); // Handle general errors
app.use(errorHandler);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

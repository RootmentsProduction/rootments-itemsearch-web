const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // Your auth routes

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed frontend origins — update as per your deployment URLs
const allowedOrigins = [
  'http://localhost:5173',            // local frontend dev port
  'https://rootments-itemsearch-web.vercel.app/',  
  // add other allowed origins if needed
];

// CORS middleware configuration
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true  // if your frontend sends cookies or auth headers
}));

// Middleware to parse JSON body requests
app.use(express.json());

// Your API routes
app.use('/api/auth', authRoutes);

// You can add other routes here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

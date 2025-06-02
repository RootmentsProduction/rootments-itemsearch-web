const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // adjust path if needed

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Allowed frontend origins (without trailing slashes)
const allowedOrigins = [
  'http://localhost:5173',
  'https://rootments-itemsearch-web.vercel.app'
];

// ✅ CORS middleware configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy does not allow access from origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ✅ Debug logging (optional)
app.use((req, res, next) => {
  console.log('Incoming request from:', req.headers.origin || 'no origin');
  next();
});

// ✅ Middleware to parse JSON body
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Health check route (optional but useful)
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;



// ✅ List of allowed origins (no trailing slashes)
const allowedOrigins = [
  'https://rootments-itemsearch-web.vercel.app',
  'https://rootments-itemsearch-web.onrender.com',
  'http://localhost:5173',
  'http://localhost:5174',
  'https://itemsearch.rootments.live'
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow Postman, curl
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for: ${origin}`), false);
  },
  credentials: true
}));

// ✅ Parse JSON request body
app.use(express.json());

// ✅ Log request origins (optional for debugging)
app.use((req, res, next) => {
  console.log(`Incoming request from: ${req.headers.origin || 'no origin'}`);
  next();
});

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

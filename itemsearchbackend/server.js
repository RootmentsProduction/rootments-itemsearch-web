const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Correct allowed origins — no trailing slashes
const allowedOrigins = [
  'https://rootments-itemsearch-web.vercel.app'
];

// ✅ CORS middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS blocked: ${origin} is not allowed`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ✅ Parse JSON body
app.use(express.json());

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Optional test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working');
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

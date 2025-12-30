const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();



// ✅ List of allowed origins (no trailing slashes)
const allowedOrigins = [
  'https://rootments-itemsearch-web.vercel.app',
  'https://rootments-itemsearch-web.onrender.com',
  'https://itemsearch-1.onrender.com',  
  'https://itemsearch.vercel.app',            // ◀️ removed leading space
  'https://itemsearch.rootments.live',
  'http://localhost:5173',
  'http://localhost:5174',
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log(`🌐 CORS check for origin: ${origin}`);
    if (!origin) {
      console.log('✅ Allowing request with no origin (Postman, curl)');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for: ${origin}`);
      return callback(null, true);
    }
    console.error(`❌ CORS blocked for: ${origin}`);
    return callback(new Error(`CORS blocked for: ${origin}`), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// ✅ Parse JSON request body
app.use(express.json());

// ✅ Log request origins (optional for debugging)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} from: ${req.headers.origin || 'no origin'}`);
  next();
});

// ✅ Auth routes
app.use('/api/auth', authRoutes);

// ✅ Item routes
app.use('/api', itemRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  // Handle CORS errors specially
  if (err.message && err.message.includes('CORS')) {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    return res.status(403).json({
      status: 'error',
      message: err.message || 'CORS policy violation'
    });
  }
  
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth'); // ✅ must export a router
// const itemRoutes = require('./routes/item'); // ✅ only if item.js exists

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
// app.use('/api/item', itemRoutes); // ✅ only if you have item.js route

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

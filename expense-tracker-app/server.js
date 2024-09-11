const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config(); // Load .env variables

const app = express();
const port = process.env.PORT || 5000; // Default to 5000 if PORT is not set

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Routes
const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api', expenseRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

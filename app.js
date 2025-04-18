const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const jokeRoutes = require('./routes/jokeRoutes');

app.use(cors()); // Allow React frontend to access the backend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/jokebook', jokeRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

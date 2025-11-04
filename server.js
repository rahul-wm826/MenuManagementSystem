const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const express = require('express');
const { connectDB } = require('./db/db');
const dotenv = require("dotenv");
const cors = require('cors');

const app = express();
const port = 3000;

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

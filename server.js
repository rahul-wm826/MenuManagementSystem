const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const proposalRoutes = require('./routes/proposal.routes');
const dishRoutes = require('./routes/dish.routes');
const clientRoutes = require('./routes/client.routes');
const eventRoutes = require('./routes/event.routes');
const eventFunctionRoutes = require('./routes/eventFunction.routes');
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
app.use('/api/dishes', dishRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/eventfunctions', eventFunctionRoutes); // For /api/functions/:id
app.use('/api/proposals', proposalRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

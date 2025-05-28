const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
app.use(cors());  

const webhookRoutes = require('./routes/webhooks');

const leadRoutes = require('./routes/leadroutes');      // CRUD
const leadAIRoutes = require('./routes/leadairoutes');  // AI scoring

app.use(express.json());

app.use('/api/leads', leadRoutes);
app.use('/api/webhooks', webhookRoutes);

app.use('/api/aileads', leadAIRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

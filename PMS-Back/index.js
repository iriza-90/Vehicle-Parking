require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); 

const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {  swaggerSpec } = require('./swagger');



const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.send('🚀 Parking Management API is Live');
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server & sync DB
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }) // auto-migrate on start
  .then(() => {
    console.log(' Database connected and synced');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error syncing DB:', err.message);
  });

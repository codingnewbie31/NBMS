require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const productRoutes = require('./routes/productRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const productionBatchRoutes = require('./routes/productionBatchRoutes');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json()); // allows server to read JSON request bodies


app.use('/api/auth', authRoutes);
app.get('/api/protected-test', authMiddleware, (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});
app.use('/api/products', productRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/production-batches', productionBatchRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('NBMS API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
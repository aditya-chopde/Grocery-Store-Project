const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const { connectDb } = require("./utils/connect");
require('dotenv').config();

const app = express();
const PORT = 5000;

// ✅ Enable CORS — allow frontend at localhost:3000
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// app.options('*', cors());

// ✅ Parse incoming JSON
app.use(bodyParser.json());
app.use(express.json()); // Needed to parse JSON body

// ✅ Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: false }));

// ✅ Import and use routes
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/myOrders');

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// ✅ Connect to MongoDB
connectDb("mongodb://localhost:27017/grocery-store").then(() => {
    console.log("✅ Database Connected");
}).catch((err) => {
    console.error("❌ Database Connection Error: " + err.message);
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server Started at PORT: ${PORT}`);
});

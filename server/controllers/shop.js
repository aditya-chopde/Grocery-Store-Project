const Shop = require("../models/shop");
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your-secret-key';
const bcrypt = require('bcryptjs');

// Shop Signup Controller
exports.signup = async (req, res) => {
  const { shopName, email, password, location } = req.body;
  console.log(req.body);

  try {
    const shopExists = await Shop.findOne({ email });
    if (shopExists) return res.status(400).json({ message: 'Shop already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);

    // Split the "lat,lng" string into numbers
    const [latitude, longitude] = location.split(',').map(Number);
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Invalid location format' });
    }

    const shop = await Shop.create({
      shopName,
      email,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
      },
    });

    const token = jwt.sign({ shopId: shop._id }, secret, { expiresIn: '1h' });

    res.status(201).json({
      data: {
        message: 'Shop registered successfully',
        shopId: shop._id,
        token,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Shop Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const shop = await Shop.findOne({ email });
    if (!shop) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, shop.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ shopId: shop._id }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1h",
    });

    res.status(200).json({
      data: {
        message: "Login successful",
        shopId: shop._id,
        shop,
        token,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


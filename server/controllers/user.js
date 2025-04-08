const User = require("../models/user");
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your-secret-key'; 

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user._id,
      user,
      token 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login Controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({ 
      message: 'Login successful', 
      userId: user._id,
      user,
      token 
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

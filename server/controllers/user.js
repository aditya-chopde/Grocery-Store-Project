const User = require("../models/user");
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const secret = process.env.JWT_SECRET || 'your-secret-key';

// Configure nodemailer transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codingez7@gmail.com', // your email address
    pass: 'mvoh tszg pgek eufb', // your email password or app password
  },
});

// Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({ name, email, password, emailVerified: false, verificationToken });

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Verify your email address',
      html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email Sent Successfully")

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.status(201).json({
      data: {
        message: 'User registered successfully. Please check your email to verify your account.',
        userId: user._id,
        user,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Email verification controller
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.send("Invalid or expired verification token. Please try signing up again.");
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.send("Email verified successfully! You can now log in to your account.");
  } catch (err) {
    return res.send("Server error. Please try again later.");
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

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email before logging in.' });
    }

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.status(200).json({
      data: {
        message: 'Login successful',
        userId: user._id,
        user,
        emailVerified: user.emailVerified,
        token
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

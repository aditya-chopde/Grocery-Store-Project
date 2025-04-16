const Shop = require("../models/shop");
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'your-secret-key';
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter (example using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'codingez7@gmail.com', // your email address
    pass: 'mvoh tszg pgek eufb', // your email password or app password
  },
});

// Update your existing signup controller to include email verification token generation and email sending
exports.signup = async (req, res) => {
  const { shopName, email, password, location } = req.body;

  try {
    const shopExists = await Shop.findOne({ email });
    if (shopExists) return res.status(400).json({ message: 'Shop already exists' });

    const [latitude, longitude] = location.split(',').map(Number);
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Invalid location format' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const shop = await Shop.create({
      shopName,
      email,
      password, // plain password
      emailVerified: false,
      verificationToken,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });

    const verificationUrl = `${req.protocol}://${req.get('host')}/api/shop/verify-email/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: shop.email,
      subject: 'Verify your shop email address',
      html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");

    const token = jwt.sign({ shopId: shop._id }, secret, { expiresIn: '1h' });

    res.status(201).json({
      data: {
        message: 'Shop registered successfully. Please check your email to verify your account.',
        shopId: shop._id,
        token,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Add a new controller to handle email verification link clicks
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const shop = await Shop.findOne({ verificationToken: token });
    if (!shop) {
      return res.send("Invalid or expired verification token. Please try signing up again.");
    }

    shop.emailVerified = true;
    shop.verificationToken = undefined;
    await shop.save();

    return res.send("Email verified successfully! You can now log in to your shop account.");
  } catch (err) {
    return res.send("Server error. Please try again later.");
  }
};

// Update your login controller to prevent login if email is not verified
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if multiple shops exist with same email
    const shops = await Shop.find({ email });
    console.log("Matching shops with this email:", shops.length);

    if (shops.length > 1) {
      return res.status(400).json({ message: "Multiple accounts found with the same email. Please contact support." });
    }

    const shop = shops[0];

    if (!shop) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Log actual emailVerified value and type
    console.log("emailVerified:", shop.emailVerified, "Type:", typeof shop.emailVerified);

    // Ensure it's a boolean and verified
    if (shop.emailVerified !== true) {
      return res.status(403).json({ message: "Email not verified. Please verify your email before logging in." });
    }

    // Use the comparePassword method from schema
    const isMatch = await shop.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ shopId: shop._id }, secret, { expiresIn: "1h" });

    res.status(200).json({
      data: {
        message: "Login successful",
        shopId: shop._id,
        shop,
        token,
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



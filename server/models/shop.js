const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const shopSchema = new mongoose.Schema({
  shopName: String,
  email: { type: String, unique: true, required: true },
  password: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
});

shopSchema.index({ location: '2dsphere' });

// Hash password before saving
shopSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
shopSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;

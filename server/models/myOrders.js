const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true,
    trim: true
  },
  lastName: { 
    type: String, 
    required: true,
    trim: true
  },
  address: { 
    type: String, 
    required: true,
    trim: true
  },
  city: { 
    type: String, 
    required: true,
    trim: true
  },
  state: { 
    type: String, 
    required: true,
    trim: true
  },
  zipCode: { 
    type: String, 
    required: true,
    trim: true
  }
});

const myOrdersSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    trim: true,
    lowercase: true
  },
    products: [orderItemSchema],
    shops: [{
      type: String,
      required: true
    }],
  totalPrice: { 
    type: Number, 
    required: true,
    min: 0
  },
  shippingAddress: shippingAddressSchema,
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['card', 'paypal', 'apple'],
    default: 'card'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  orderDate: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true } 
});

// Add virtual for formatted order date
myOrdersSchema.virtual('formattedDate').get(function() {
  return this.orderDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const MyOrders = mongoose.model('MyOrders', myOrdersSchema);

module.exports = MyOrders;

import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  rating: { type: Number },
  reviews: { type: Number },
  image: { type: String },
  category: { type: String },
  description: { type: String },
  quantity: { type: Number, required: true, default: 1 }
}, { _id: false });

const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);

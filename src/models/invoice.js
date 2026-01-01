import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  sellerName: {
    type: String,
    required: true
  },
  sellerAddress: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  items: [
    {
      description: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true, min: [0.01, 'Price must be greater than zero']}
    }  
  ],
  finalPrice: {
    type: Number,
    required: true
  },
  terms: {
    type: String
  },
  invoiceDescription: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled'],
    default: 'draft'
  },
  paymentDate: {
    type: String, // '2025-01-10'
  }
});

export default mongoose.model('invoice', invoiceSchema);

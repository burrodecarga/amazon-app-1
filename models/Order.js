import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    orderItems: [
      {
        name: { type: String, required: false },
        quantity: { type: Number, required: false },
        image: { type: String, required: false },
        price: { type: Number, required: false },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: false },
      address: { type: String, required: false },
      city: { type: String, required: false },
      postalCode: { type: String, required: false },
      country: { type: String, required: false },
      location: {
        lat: String,
        lng: String,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: { type: String, required: false },
    paymentResult: { id: String, status: String, email_address: String },
    itemsPrice: { type: Number, required: false },
    shippingPrice: { type: Number, required: false },
    taxPrice: { type: Number, required: false },
    totalPrice: { type: Number, required: false },
    isPaid: { type: Boolean, required: false, default: false },
    isDelivered: { type: Boolean, required: false, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;

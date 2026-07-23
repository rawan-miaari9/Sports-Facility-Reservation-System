import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: string; // mongoose.Types.ObjectId;
  courtId: mongoose.Types.ObjectId;
  bookingDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
}

const BookingSchema: Schema = new Schema({
  userId: { type: String, required: true }, // { type: Schema.Types.ObjectId, ref: 'User', required: true },
  courtId: { type: Schema.Types.ObjectId, ref: 'Court', required: true },
  bookingDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
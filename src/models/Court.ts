import mongoose, { Schema, Document } from 'mongoose';

export interface ICourt extends Document {
  name: string;
  sportType: string;
  description: string;
  pricePerHour: number;
  capacity: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
}

const CourtSchema: Schema = new Schema({
  name: { type: String, required: true },
  sportType: { type: String, required: true },
  description: { type: String },
  pricePerHour: { type: Number, required: true },
  capacity: { type: Number, required: true },
  images: { type: [String] },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Court || mongoose.model<ICourt>('Court', CourtSchema);
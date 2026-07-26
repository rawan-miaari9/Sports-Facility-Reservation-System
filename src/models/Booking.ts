import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBooking extends Document {
  facilityId: mongoose.Types.ObjectId;

  bookingType: "registered" | "guest";

  userId?: mongoose.Types.ObjectId;

  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;

  date: string;
  timeSlot: string;

  price: number;

  paymentMethod: "Card" | "Cash";

  equipment: string[];

  status: "Pending" | "Confirmed" | "Cancelled";

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema(
  {
    facilityId: {
      type: Schema.Types.ObjectId,
      ref: "Facility",
      required: true,
    },

    bookingType: {
      type: String,
      enum: ["registered", "guest"],
      default: "registered",
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    guestName: String,
    guestPhone: String,
    guestEmail: String,

    date: {
      type: String,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Card", "Cash"],
      required: true,
    },

    equipment: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Booking =
  mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
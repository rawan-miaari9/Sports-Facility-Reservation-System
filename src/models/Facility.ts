import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  type: string; 
  description: string;
  image: string;
  location: string;
  isIndoor: boolean;
  pricePerHour: number;
  capacity: number;
  status: 'Available' | 'Maintenance' | 'Closed';
  features: string[];
  createdAt: Date;
  updatedAt: Date;
}

const FacilitySchema: Schema = new Schema<IFacility>(
  {
    name: { 
      type: String, 
      required: [true, 'Facility name is required'], 
      trim: true 
    },
    type: { 
      type: String, 
      required: [true, 'Facility type is required'], 
      trim: true 
    },
    description: { 
      type: String, 
      required: [true, 'Description is required'], 
      trim: true 
    },
    image: { 
      type: String, 
      required: [true, 'Image URL is required'] 
    },
    location: { 
      type: String, 
      required: [true, 'Location is required'], 
      trim: true 
    },
    isIndoor: { 
      type: Boolean, 
      default: false 
    },
    pricePerHour: { 
      type: Number, 
      required: [true, 'Price per hour is required'],
      min: [0, 'Price cannot be negative'] 
    },
    capacity: { 
      type: Number, 
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1 person'] 
    },
    status: { 
      type: String, 
      enum: ['Available', 'Maintenance', 'Closed'], 
      default: 'Available' 
    },
    features: {
      type: [String],
      default: []
    }
  },
  { 
    timestamps: true 
  }
);

export const FacilityModel: Model<IFacility> =
  mongoose.models.Facility || mongoose.model<IFacility>('Facility', FacilitySchema);
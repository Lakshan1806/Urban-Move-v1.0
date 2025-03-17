import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    pickupLocation: {
      type: String,
      required: [true, 'Pickup location is required'],
      trim: true,
    },
    dropoffLocation: {
      type: String,
      required: [true, 'Drop-off location is required'],
      trim: true,
    },
    pickupTime: {
      type: Date,
      required: [true, 'Pickup time is required'],
    },
    dropoffTime: {
      type: Date,
      required: [true, 'Drop-off time is required'],
      validate: {
        validator: function(value) {
          // Ensure drop-off time is after pickup time
          return this.pickupTime < value;
        },
        message: 'Drop-off time must be after pickup time',
      },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model( "Rental", rentalSchema);
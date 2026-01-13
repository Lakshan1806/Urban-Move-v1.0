// models/LiveTrackingModel.js
import mongoose from 'mongoose';

const liveTrackingSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DriverRide',
    required: true,
    index: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  locations: [{
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: String,
    status: {
      type: String,
      enum: ['to_pickup', 'to_dropoff'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    accuracy: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // Automatically delete after 24 hours
  }
}, {
  timestamps: true
});

const LiveTracking = mongoose.model('LiveTracking', liveTrackingSchema);

export default LiveTracking;
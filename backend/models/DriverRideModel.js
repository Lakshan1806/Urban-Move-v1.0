// models/DriverRideModel.js
import mongoose from 'mongoose';

const driverRideSchema = new mongoose.Schema({
  rideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
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
  pickup: {
    type: String,
    required: true
  },
  dropoff: {
    type: String,
    required: true
  },
  startLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  endLocation: {
    lat: Number,
    lng: Number,
    address: String
  },
  driverLocationUpdates: [{
    lat: Number,
    lng: Number,
    accuracy: Number,
    timestamp: { type: Date, default: Date.now },
    address: String
  }],
  distance: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  fare: {
    type: Number,
    required: true,
    min: 0
  },
  driverEarnings: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled'],
    default: 'requested',
    required: true
  },
  cancellationReason: String,
  cancelledBy: {
    type: String,
    enum: ['driver', 'user', 'system']
  },
  scheduledTime: Date,
  actualPickupTime: Date,
  actualDropoffTime: Date,
  route: [{
    lat: Number,
    lng: Number
  }],
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

driverRideSchema.index({ rideId: 1 });
driverRideSchema.index({ driverId: 1 });
driverRideSchema.index({ userId: 1 });
driverRideSchema.index({ status: 1 });
driverRideSchema.index({ createdAt: 1 });

const DriverRide = mongoose.model('DriverRide', driverRideSchema);

export default DriverRide;
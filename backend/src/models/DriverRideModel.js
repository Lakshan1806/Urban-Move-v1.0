import mongoose from 'mongoose';

const driverRideSchema = new mongoose.Schema({
  rideId: {
    type: String,
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
    timestamp: Date,
    address: String
  }],
  distance: String,
  duration: String,
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
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  route: [{
    lat: Number,
    lng: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DriverRide = mongoose.model('DriverRide', driverRideSchema);

export default DriverRide;
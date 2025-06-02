import { Schema, model } from 'mongoose';

const rideSchema = new Schema({
  passengerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'Driver'
  },
  pickupLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  dropoffLocation: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  driverLocation: {
    coordinates: {
      lat: Number,
      lng: Number
    },
    timestamp: Date
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested'
  },
  fare: {
    type: Number,
    min: 0
  },
  distance: Number,
  duration: Number,
  route: Object,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

rideSchema.index({ passengerId: 1 });
rideSchema.index({ driverId: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });

export default model('Ride', rideSchema);
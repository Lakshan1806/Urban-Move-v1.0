import mongoose from 'mongoose';

const DriverAcceptanceSchema = new mongoose.Schema({
  rideId: {
    type: String,
    required: true,
    unique: true
  },
  driverId: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    required: true
  },
  currentLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String }
  },
  pickupLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ['accepted', 'arrived', 'started', 'completed'],
    default: 'accepted'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

DriverAcceptanceSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const DriverAcceptance = mongoose.model('DriverAcceptance', DriverAcceptanceSchema);
export default DriverAcceptance;

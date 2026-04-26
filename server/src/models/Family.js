import mongoose from 'mongoose';

const childSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: Number,
    school: String,
    interests: [String],
    allergies: [String],
    pickupWindow: String
  },
  { _id: true }
);

const parentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    phone: String,
    preferences: {
      planningCadence: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
      dinnerTime: { type: String, default: '18:15' },
      maxDriveMinutes: { type: Number, default: 45 }
    }
  },
  { _id: false }
);

const familySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    homeBase: { type: String, required: true },
    parents: [parentSchema],
    children: [childSchema],
    connectedCalendars: [String],
    connectedSportsApps: [String]
  },
  { timestamps: true }
);

export const Family = mongoose.model('Family', familySchema);

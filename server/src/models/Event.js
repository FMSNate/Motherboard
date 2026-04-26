import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family' },
    source: { type: String, default: 'manual' },
    childName: String,
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['school', 'practice', 'game', 'meal', 'carpool', 'date-night', 'care', 'errand'],
      default: 'care'
    },
    startsAt: { type: Date, required: true },
    endsAt: Date,
    location: String,
    notes: String,
    priority: { type: Number, default: 2 }
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);

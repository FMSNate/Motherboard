import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family' },
    category: { type: String, enum: ['date-night', 'personal', 'family'], default: 'date-night' },
    title: { type: String, required: true },
    commitment: String,
    targetDate: Date,
    status: { type: String, enum: ['planned', 'scheduled', 'done'], default: 'planned' }
  },
  { timestamps: true }
);

export const Goal = mongoose.model('Goal', goalSchema);

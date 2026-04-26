import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema(
  {
    familyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Family' },
    date: { type: Date, required: true },
    meal: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    title: { type: String, required: true },
    prepMinutes: Number,
    ingredients: [String],
    allergyNotes: [String],
    providerSuggestion: {
      provider: String,
      action: String,
      estimatedCost: Number
    }
  },
  { timestamps: true }
);

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema);

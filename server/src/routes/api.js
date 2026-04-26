import express from 'express';
import mongoose from 'mongoose';
import { Family } from '../models/Family.js';
import { Event } from '../models/Event.js';
import { Goal } from '../models/Goal.js';
import { MealPlan } from '../models/MealPlan.js';
import { demoEvents, demoFamily, demoGoals, demoMeals } from '../data/demoData.js';
import { buildPlan } from '../services/planner.js';
import { buildProviderActions, getIntegrationHealth } from '../services/integrations.js';

export const apiRouter = express.Router();

apiRouter.get('/health', (req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

apiRouter.get('/family', async (req, res, next) => {
  try {
    const family = await getFamily();
    res.json(family);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/planner', async (req, res, next) => {
  try {
    const cadence = req.query.cadence === 'weekly' ? 'weekly' : 'daily';
    const data = await getPlannerData();
    res.json(buildPlan({ ...data, cadence }));
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/integrations', (req, res) => {
  res.json(getIntegrationHealth());
});

apiRouter.get('/provider-actions', async (req, res, next) => {
  try {
    const { meals } = await getPlannerData();
    res.json(buildProviderActions(meals));
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/events', async (req, res, next) => {
  try {
    if (!mongoose.connection.readyState) {
      return res.status(503).json({ message: 'MongoDB is not connected. Add MONGODB_URI to create events.' });
    }

    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
});

async function getFamily() {
  if (!mongoose.connection.readyState) return demoFamily;
  const family = await Family.findOne().lean();
  return family || demoFamily;
}

async function getPlannerData() {
  if (!mongoose.connection.readyState) {
    return {
      family: demoFamily,
      events: demoEvents,
      meals: demoMeals,
      goals: demoGoals
    };
  }

  const family = await Family.findOne().lean();
  if (!family) {
    return {
      family: demoFamily,
      events: demoEvents,
      meals: demoMeals,
      goals: demoGoals
    };
  }

  const [events, meals, goals] = await Promise.all([
    Event.find({ familyId: family._id }).lean(),
    MealPlan.find({ familyId: family._id }).lean(),
    Goal.find({ familyId: family._id }).lean()
  ]);

  return {
    family,
    events: events.length ? events : demoEvents,
    meals: meals.length ? meals : demoMeals,
    goals: goals.length ? goals : demoGoals
  };
}

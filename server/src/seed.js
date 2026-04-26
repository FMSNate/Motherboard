import { connectDb } from './config/db.js';
import { Family } from './models/Family.js';
import { Event } from './models/Event.js';
import { Goal } from './models/Goal.js';
import { MealPlan } from './models/MealPlan.js';
import { demoEvents, demoFamily, demoGoals, demoMeals } from './data/demoData.js';

const connected = await connectDb();

if (!connected) {
  console.error('Set MONGODB_URI before seeding.');
  process.exit(1);
}

await Promise.all([Family.deleteMany({}), Event.deleteMany({}), MealPlan.deleteMany({}), Goal.deleteMany({})]);

const family = await Family.create({
  name: demoFamily.name,
  homeBase: demoFamily.homeBase,
  parents: demoFamily.parents,
  children: demoFamily.children,
  connectedCalendars: demoFamily.connectedCalendars,
  connectedSportsApps: demoFamily.connectedSportsApps
});

await Event.insertMany(demoEvents.map(({ id, ...event }) => ({ ...event, familyId: family._id })));
await MealPlan.insertMany(demoMeals.map(({ id, ...meal }) => ({ ...meal, familyId: family._id })));
await Goal.insertMany(demoGoals.map(({ id, ...goal }) => ({ ...goal, familyId: family._id })));

console.info('Seeded Motherboard Assistant demo family.');
process.exit(0);

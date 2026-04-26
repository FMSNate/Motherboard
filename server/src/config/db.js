import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDb() {
  if (!env.mongoUri) {
    console.info('MONGODB_URI not set; serving demo data without persistence.');
    return false;
  }

  await mongoose.connect(env.mongoUri);
  console.info('Connected to MongoDB.');
  return true;
}

# Motherboard Assistant

A full MERN stack starter for an everyday family operations assistant. It coordinates childcare, meals, grocery and delivery provider workflows, carpools, sports calendars, and date-night goals.

## Features

- Daily and weekly planning modes for mothers coordinating 2-10 children
- Family, child, event, meal, carpool, and goal data models
- Sports integration adapters for TeamSnap, All Ball, GameChanger, BIYA, SportsEngine, LeagueApps, Stack Team App, BAND, sportsYou, and PlayMetrics
- Calendar adapters for iCal feeds, Google Calendar, and Microsoft Calendar
- Food and commerce adapter stubs for Walmart+, Instacart, DoorDash, and Uber Eats
- Route departure planning with traffic buffer support
- React prototype with planner, nanny, chef, carpool, sports, integration setup, grocery, delivery, and date-night surfaces
- Render hosting blueprint plus Dockerfile for container deployment

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The client runs at `http://localhost:5173` and the API runs at `http://localhost:5001`.

## Data

The app works without MongoDB by serving rich demo data from the API. Add `MONGODB_URI` to persist families and planner data in MongoDB.

Seed MongoDB after configuring `.env`:

```bash
npm run seed
```

## Hosting

### Render

1. Create a MongoDB Atlas cluster.
2. Create a Render web service from this repository.
3. Use `render.yaml` or set:
   - `NODE_ENV=production`
   - `MONGODB_URI`
   - `CLIENT_ORIGIN=https://mothrboard.ai`
   - provider API credentials as needed
4. Render runs `npm install && npm run build`, then `npm start`.

The Blueprint is configured for `mothrboard.ai` and `www.mothrboard.ai`. See `DEPLOYMENT_DOMAIN.md` for the DNS steps.

### Docker

```bash
docker build -t motherboard-assistant .
docker run -p 5001:5001 --env-file .env motherboard-assistant
```

## Integration Notes

Most grocery, delivery, sports, and calendar systems require OAuth apps, partner access, or paid API agreements. This codebase includes provider adapters with health checks and normalized data contracts so credentials can be added without rewriting the product.

The prototype currently presents setup cards for TeamSnap, All Ball, GameChanger, BIYA, iCal feeds, Google Calendar, Microsoft Calendar, SportsEngine, LeagueApps, Stack Team App, BAND, sportsYou, PlayMetrics, Walmart+, Instacart, DoorDash, Uber Eats, and routing.

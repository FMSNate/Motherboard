# Architecture

## Product Intent

Motherboard Assistant is built around one question: what does the family need to do next, and who or what system can make that easier?

The app consolidates calendars, youth sports schedules, grocery carts, delivery options, childcare notes, carpool timing, and relationship goals into a daily or weekly operating plan.

## MERN Layers

- MongoDB: family profile, children, events, meal plans, goals, and provider connection state
- Express: integration health, planner generation, provider actions, and event creation APIs
- React: operational dashboard for plan review and action
- Node: deployment runtime serving both API and built client

## Integration Contracts

The current code normalizes all external systems into a small set of internal objects:

- Calendar events: title, type, start/end, child, location, source
- Sports events: practice/game, child, location, arrival needs, source app
- Meal actions: meal, ingredients, allergy notes, provider suggestion
- Route actions: passenger, destination, departure time, drive time, confidence
- Goals: category, commitment, target date, status

Provider credentials are read from environment variables. A provider reports `ready` only when required keys are present.

## Real API Work Remaining

To go from demo-capable to production-connected, add provider clients under `server/src/services`:

- Google/Microsoft OAuth flows for calendars
- TeamSnap and GameChanger OAuth imports
- All Ball and BIYA API clients when credentials or documentation are available
- Walmart+ and Instacart cart creation APIs
- DoorDash and Uber Eats delivery quote/order APIs
- Google Maps or Mapbox route duration calls

The frontend is already designed to surface partial connection state, so one provider can be activated at a time.

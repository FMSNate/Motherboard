import { env } from '../config/env.js';

const providerLabels = {
  googleCalendar: 'Google Calendar',
  microsoftCalendar: 'Microsoft Calendar',
  iCal: 'iCal Feeds',
  teamSnap: 'TeamSnap',
  gameChanger: 'GameChanger',
  allBall: 'All Ball',
  biya: 'BIYA',
  sportsEngine: 'SportsEngine',
  leagueApps: 'LeagueApps',
  stackTeamApp: 'Stack Team App',
  band: 'BAND',
  sportsYou: 'sportsYou',
  playMetrics: 'PlayMetrics',
  walmart: 'Walmart+',
  instacart: 'Instacart',
  doordash: 'DoorDash',
  uberEats: 'Uber Eats',
  maps: 'Maps Routing'
};

export function getIntegrationHealth() {
  return Object.entries(providerLabels).map(([key, label]) => ({
    key,
    label,
    connected: Boolean(env.providers[key]),
    status: env.providers[key] ? 'ready' : 'needs credentials',
    capability: describeCapability(key)
  }));
}

export function describeCapability(key) {
  const capabilities = {
    googleCalendar: 'Imports family calendars, school deadlines, care blocks, and reminders.',
    microsoftCalendar: 'Imports Outlook events and shared family calendars.',
    iCal: 'Subscribes to school, camp, club, and league .ics calendar feeds.',
    teamSnap: 'Normalizes rosters, practices, games, field locations, and arrival times.',
    gameChanger: 'Normalizes games, practices, scorekeeping needs, and team messages.',
    allBall: 'Imports local club schedules when API access is enabled.',
    biya: 'Imports BIYA events and team communication when API access is enabled.',
    sportsEngine: 'Imports team schedules and league messages from SportsEngine.',
    leagueApps: 'Imports club registrations, team schedules, and facility locations.',
    stackTeamApp: 'Imports team calendars and parent communications.',
    band: 'Imports team group events, announcements, and RSVP reminders.',
    sportsYou: 'Imports coach posts, calendar changes, and team reminders.',
    playMetrics: 'Imports soccer club schedules, assignments, and field updates.',
    walmart: 'Builds grocery carts for staples and allergy-safe pantry replenishment.',
    instacart: 'Builds fresh grocery carts around weekly meal prep.',
    doordash: 'Schedules restaurant delivery for pinch points and sitter nights.',
    uberEats: 'Schedules meal delivery when cooking windows collapse.',
    maps: 'Computes drive times, departure windows, and route conflict warnings.'
  };
  return capabilities[key] || 'Provider adapter';
}

export function buildProviderActions(meals) {
  return meals.map((meal) => ({
    provider: meal.providerSuggestion.provider,
    action: meal.providerSuggestion.action,
    items: meal.ingredients,
    estimatedCost: meal.providerSuggestion.estimatedCost,
    readyForCheckout: false
  }));
}

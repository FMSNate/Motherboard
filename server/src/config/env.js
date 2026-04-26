import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5001),
  mongoUri: process.env.MONGODB_URI || '',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  providers: {
    googleCalendar: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    microsoftCalendar: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
    iCal: true,
    teamSnap: Boolean(process.env.TEAMSNAP_CLIENT_ID && process.env.TEAMSNAP_CLIENT_SECRET),
    gameChanger: Boolean(process.env.GAMECHANGER_CLIENT_ID && process.env.GAMECHANGER_CLIENT_SECRET),
    allBall: Boolean(process.env.ALLBALL_API_KEY),
    biya: Boolean(process.env.BIYA_API_KEY),
    sportsEngine: Boolean(process.env.SPORTSENGINE_API_KEY),
    leagueApps: Boolean(process.env.LEAGUEAPPS_API_KEY),
    stackTeamApp: Boolean(process.env.STACK_TEAM_APP_API_KEY),
    band: Boolean(process.env.BAND_API_KEY),
    sportsYou: Boolean(process.env.SPORTSYOU_API_KEY),
    playMetrics: Boolean(process.env.PLAYMETRICS_API_KEY),
    walmart: Boolean(process.env.WALMART_API_KEY),
    instacart: Boolean(process.env.INSTACART_API_KEY),
    doordash: Boolean(process.env.DOORDASH_DEVELOPER_ID && process.env.DOORDASH_KEY_ID),
    uberEats: Boolean(process.env.UBER_EATS_CLIENT_ID && process.env.UBER_EATS_CLIENT_SECRET),
    maps: Boolean(process.env.GOOGLE_MAPS_API_KEY || process.env.MAPBOX_ACCESS_TOKEN)
  }
};

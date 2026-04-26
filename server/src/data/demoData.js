const today = new Date();
const at = (days, hour, minute = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const demoFamily = {
  id: 'demo-family',
  name: 'The Parker Home Team',
  homeBase: 'Cherry Creek, Denver, CO',
  parents: [
    {
      name: 'Maya',
      role: 'Mom',
      preferences: {
        planningCadence: 'weekly',
        dinnerTime: '18:15',
        maxDriveMinutes: 45
      }
    }
  ],
  children: [
    { name: 'Avery', age: 12, school: 'Hill Campus', interests: ['soccer', 'choir'], allergies: ['peanuts'], pickupWindow: '15:15-15:35' },
    { name: 'Nora', age: 9, school: 'Steck Elementary', interests: ['softball', 'art'], allergies: [], pickupWindow: '14:55-15:15' },
    { name: 'Miles', age: 6, school: 'Steck Elementary', interests: ['swim'], allergies: ['sesame'], pickupWindow: '14:55-15:15' }
  ],
  connectedCalendars: ['Google Calendar'],
  connectedSportsApps: ['TeamSnap', 'GameChanger']
};

export const demoEvents = [
  { id: 'evt-1', source: 'google', childName: 'Avery', title: 'Math quiz prep', type: 'school', startsAt: at(0, 16, 15), endsAt: at(0, 16, 45), location: 'Home', priority: 2 },
  { id: 'evt-2', source: 'teamsnap', childName: 'Avery', title: 'Soccer practice', type: 'practice', startsAt: at(0, 17, 30), endsAt: at(0, 18, 45), location: 'Lowry Sports Complex', priority: 1 },
  { id: 'evt-3', source: 'gamechanger', childName: 'Nora', title: 'Softball game', type: 'game', startsAt: at(1, 17, 0), endsAt: at(1, 18, 30), location: 'Congress Park Field', priority: 1 },
  { id: 'evt-4', source: 'manual', childName: 'Miles', title: 'Swim lesson', type: 'practice', startsAt: at(2, 16, 0), endsAt: at(2, 16, 45), location: 'JCC Pool', priority: 2 },
  { id: 'evt-5', source: 'manual', title: 'Friday date night', type: 'date-night', startsAt: at(5, 19, 0), endsAt: at(5, 21, 30), location: 'Guard and Grace', priority: 1 }
];

export const demoMeals = [
  {
    id: 'meal-1',
    date: at(0, 18, 15),
    meal: 'dinner',
    title: 'Sheet-pan chicken fajitas',
    prepMinutes: 22,
    ingredients: ['chicken thighs', 'bell peppers', 'tortillas', 'avocado', 'lime'],
    allergyNotes: ['peanut-free', 'sesame-free'],
    providerSuggestion: { provider: 'Instacart', action: 'Add missing produce and tortillas', estimatedCost: 31 }
  },
  {
    id: 'meal-2',
    date: at(1, 18, 15),
    meal: 'dinner',
    title: 'Game-night turkey chili',
    prepMinutes: 15,
    ingredients: ['ground turkey', 'beans', 'tomatoes', 'cheddar', 'cornbread'],
    allergyNotes: ['pack in thermos for Nora'],
    providerSuggestion: { provider: 'Walmart+', action: 'Schedule pantry restock', estimatedCost: 44 }
  },
  {
    id: 'meal-3',
    date: at(5, 18, 0),
    meal: 'dinner',
    title: 'Kids pizza and fruit board',
    prepMinutes: 5,
    ingredients: ['pizza', 'berries', 'cucumber', 'milk'],
    allergyNotes: ['confirm sesame-free crust'],
    providerSuggestion: { provider: 'DoorDash', action: 'Pre-order before date night', estimatedCost: 38 }
  }
];

export const demoGoals = [
  {
    id: 'goal-1',
    category: 'date-night',
    title: 'Phones-away dinner',
    commitment: 'Book sitter by Wednesday, reserve Friday dinner, and keep one shared topic list.',
    targetDate: at(5, 19),
    status: 'scheduled'
  },
  {
    id: 'goal-2',
    category: 'family',
    title: 'Sunday reset',
    commitment: 'Approve the week, grocery cart, rides, uniforms, and permission slips by 6 PM.',
    targetDate: at(6, 18),
    status: 'planned'
  }
];

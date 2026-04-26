const minutesBetween = (start, end) => Math.round((new Date(end) - new Date(start)) / 60000);

export function buildPlan({ family, events, meals, goals, cadence = 'daily' }) {
  const sortedEvents = [...events].sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  const focusWindowDays = cadence === 'weekly' ? 7 : 1;
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + focusWindowDays);

  const visibleEvents = sortedEvents.filter((event) => new Date(event.startsAt) <= horizon);
  const careBlocks = buildCareBlocks(family, visibleEvents);
  const routePlan = buildRoutePlan(family, visibleEvents);
  const risks = buildRisks(visibleEvents, meals);

  return {
    cadence,
    headline: cadence === 'weekly' ? 'This week is drivable with two tight dinner windows.' : 'Today needs early dinner prep and a firm soccer departure.',
    generatedAt: new Date().toISOString(),
    family: {
      name: family.name,
      childrenCount: family.children.length,
      homeBase: family.homeBase
    },
    priorities: [
      'Protect school pickup windows before adding errands.',
      'Batch dinner prep before first sports departure.',
      'Confirm sitter and date-night reservation before Wednesday evening.'
    ],
    schedule: visibleEvents,
    meals,
    careBlocks,
    routePlan,
    goals,
    risks
  };
}

function buildCareBlocks(family, events) {
  return family.children.map((child) => {
    const childEvents = events.filter((event) => event.childName === child.name);
    const nextEvent = childEvents[0];

    return {
      child: child.name,
      pickupWindow: child.pickupWindow,
      nextNeed: nextEvent ? `${nextEvent.title} at ${formatTime(nextEvent.startsAt)}` : 'Open afternoon',
      nannyNote: child.allergies.length
        ? `Avoid ${child.allergies.join(', ')} and pack labeled snack.`
        : 'No allergy restrictions listed.'
    };
  });
}

function buildRoutePlan(family, events) {
  return events
    .filter((event) => ['practice', 'game', 'date-night'].includes(event.type))
    .map((event) => {
      const driveMinutes = event.type === 'date-night' ? 18 : event.location.includes('Lowry') ? 24 : 16;
      const bufferMinutes = event.type === 'game' ? 20 : 12;
      const departAt = new Date(new Date(event.startsAt).getTime() - (driveMinutes + bufferMinutes) * 60000);

      return {
        title: event.title,
        passenger: event.childName || 'Parents',
        from: family.homeBase,
        to: event.location,
        startsAt: event.startsAt,
        departAt: departAt.toISOString(),
        driveMinutes,
        bufferMinutes,
        confidence: 'estimated until Maps API is connected'
      };
    });
}

function buildRisks(events, meals) {
  const risks = [];
  const dinnerMeals = meals.filter((meal) => meal.meal === 'dinner');

  for (const meal of dinnerMeals) {
    const mealTime = new Date(meal.date);
    const nearbySports = events.filter((event) => {
      const diff = Math.abs(minutesBetween(event.startsAt, mealTime));
      return ['practice', 'game'].includes(event.type) && diff < 90;
    });

    if (nearbySports.length) {
      risks.push({
        severity: 'medium',
        title: `${meal.title} overlaps sports flow`,
        recommendation: `Prep ${meal.prepMinutes} minutes before pickup or switch provider order to ${meal.providerSuggestion.provider}.`
      });
    }
  }

  if (!risks.length) {
    risks.push({
      severity: 'low',
      title: 'No major conflicts detected',
      recommendation: 'Keep the current plan and review tomorrow morning.'
    });
  }

  return risks;
}

function formatTime(dateString) {
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(dateString));
}

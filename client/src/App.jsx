import { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  CalendarCheck,
  CheckCircle2,
  Car,
  ChefHat,
  Clock,
  Copy,
  Dumbbell,
  ExternalLink,
  Heart,
  House,
  Loader2,
  LockKeyhole,
  MapPin,
  MessageSquareText,
  PlugZap,
  Route,
  Settings2,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
  Utensils
} from 'lucide-react';

const integrationGroups = [
  {
    id: 'sports',
    title: 'Sports + Team Apps',
    icon: Dumbbell,
    keys: ['teamSnap', 'allBall', 'gameChanger', 'biya', 'sportsEngine', 'leagueApps', 'stackTeamApp', 'band', 'sportsYou', 'playMetrics']
  },
  {
    id: 'calendar',
    title: 'Calendars',
    icon: CalendarCheck,
    keys: ['iCal', 'googleCalendar', 'microsoftCalendar']
  },
  {
    id: 'food',
    title: 'Groceries + Delivery',
    icon: Store,
    keys: ['walmart', 'instacart', 'doordash', 'uberEats']
  },
  {
    id: 'routing',
    title: 'Routing',
    icon: Route,
    keys: ['maps']
  }
];

const api = {
  async get(path) {
    const response = await fetch(`/api${path}`);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  }
};

export default function App() {
  const [cadence, setCadence] = useState('weekly');
  const [plan, setPlan] = useState(null);
  const [integrations, setIntegrations] = useState([]);
  const [providerActions, setProviderActions] = useState([]);
  const [view, setView] = useState('today');
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [localConnections, setLocalConnections] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      api.get(`/planner?cadence=${cadence}`),
      api.get('/integrations'),
      api.get('/provider-actions')
    ])
      .then(([nextPlan, nextIntegrations, nextProviderActions]) => {
        if (!active) return;
        setPlan(nextPlan);
        setIntegrations(nextIntegrations);
        setProviderActions(nextProviderActions);
        setError('');
      })
      .catch((nextError) => {
        if (!active) return;
        setError(nextError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [cadence]);

  const connectedCount = useMemo(
    () => integrations.filter((integration) => integration.connected || localConnections[integration.key]).length,
    [integrations, localConnections]
  );

  const interactiveIntegrations = useMemo(
    () => integrations.map((integration) => ({
      ...integration,
      connected: integration.connected || Boolean(localConnections[integration.key]),
      status: integration.connected || localConnections[integration.key] ? 'ready' : integration.status
    })),
    [integrations, localConnections]
  );

  if (loading && !plan) {
    return (
      <main className="app loading-state">
        <Loader2 className="spin" size={32} />
        <p>Building the family command plan...</p>
      </main>
    );
  }

  if (error && !plan) {
    return (
      <main className="app loading-state">
        <ShieldCheck size={32} />
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="app">
      <nav className="top-nav" aria-label="Prototype views">
        <div className="brand-mark">
          <House size={20} />
          <span>Motherboard</span>
        </div>
        <div className="view-tabs">
          {[
            ['today', 'Today'],
            ['week', 'Week'],
            ['integrations', 'Integrations'],
            ['meals', 'Meals'],
            ['rides', 'Rides']
          ].map(([id, label]) => (
            <button className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <section className="hero-band">
        <div className="hero-copy">
          <div className="eyebrow">
            <Sparkles size={16} />
            Motherboard Assistant
          </div>
          <h1>{plan.headline}</h1>
          <p>
            A nanny, chef, carpool dispatcher, sports-calendar wrangler, and date-night accountability partner for {plan.family.name}.
          </p>
        </div>

        <div className="plan-switch" aria-label="Plan cadence">
          <button className={cadence === 'daily' ? 'active' : ''} onClick={() => setCadence('daily')}>
            Daily
          </button>
          <button className={cadence === 'weekly' ? 'active' : ''} onClick={() => setCadence('weekly')}>
            Weekly
          </button>
        </div>
      </section>

      <section className="metric-grid" aria-label="Family overview">
        <Metric icon={Users} label="Children coordinated" value={plan.family.childrenCount} />
        <Metric icon={CalendarCheck} label="Events in plan" value={plan.schedule.length} />
        <Metric icon={ShoppingCart} label="Provider actions" value={providerActions.length} />
        <Metric icon={ShieldCheck} label="Connected systems" value={`${connectedCount}/${interactiveIntegrations.length}`} />
      </section>

      {view === 'integrations' ? (
        <IntegrationsView integrations={interactiveIntegrations} onSelect={setSelectedIntegration} />
      ) : view === 'meals' ? (
        <MealsView meals={plan.meals} providerActions={providerActions} />
      ) : view === 'rides' ? (
        <RidesView routes={plan.routePlan} />
      ) : (
        <section className="workspace-grid">
          <PlannerPanel plan={view === 'today' ? { ...plan, schedule: plan.schedule.slice(0, 2) } : plan} />
          <NannyPanel careBlocks={plan.careBlocks} />
          <ChefPanel meals={plan.meals} providerActions={providerActions} />
          <CarpoolPanel routes={plan.routePlan} />
          <SportsPanel integrations={interactiveIntegrations} schedule={plan.schedule} />
          <DateNightPanel goals={plan.goals} />
        </section>
      )}

      {selectedIntegration ? (
        <IntegrationDrawer
          integration={selectedIntegration}
          onClose={() => setSelectedIntegration(null)}
          onConnect={(key) => {
            setLocalConnections((current) => ({ ...current, [key]: true }));
            setSelectedIntegration(null);
          }}
        />
      ) : null}
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <article className="metric">
      <Icon size={20} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function PlannerPanel({ plan }) {
  return (
    <section className="panel panel-large">
      <PanelHeader icon={CalendarCheck} title="Command Plan" />
      <div className="priority-list">
        {plan.priorities.map((priority) => (
          <div className="priority" key={priority}>
            <ShieldCheck size={16} />
            <span>{priority}</span>
          </div>
        ))}
      </div>
      <div className="timeline">
        {plan.schedule.map((event) => (
          <article className="timeline-item" key={event.id || `${event.title}-${event.startsAt}`}>
            <time>{formatDateTime(event.startsAt)}</time>
            <div>
              <strong>{event.title}</strong>
              <span>{event.childName || 'Family'} · {event.location}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function NannyPanel({ careBlocks }) {
  return (
    <section className="panel">
      <PanelHeader icon={Baby} title="Nanny Mode" />
      <div className="stack">
        {careBlocks.map((block) => (
          <article className="mini-card" key={block.child}>
            <strong>{block.child}</strong>
            <span>{block.nextNeed}</span>
            <small>{block.nannyNote}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function ChefPanel({ meals, providerActions }) {
  return (
    <section className="panel">
      <PanelHeader icon={ChefHat} title="Chef + Carts" />
      <div className="stack">
        {meals.map((meal) => (
          <article className="mini-card" key={meal.id || meal.title}>
            <strong>{meal.title}</strong>
            <span>{meal.prepMinutes} min prep · {meal.allergyNotes.join(', ')}</span>
            <small>{meal.providerSuggestion.provider}: {meal.providerSuggestion.action}</small>
          </article>
        ))}
      </div>
      <div className="provider-row">
        {providerActions.map((action) => (
          <button key={`${action.provider}-${action.action}`}>{action.provider}</button>
        ))}
      </div>
    </section>
  );
}

function CarpoolPanel({ routes }) {
  return (
    <section className="panel panel-large">
      <PanelHeader icon={Route} title="Carpool Expert" />
      <div className="route-list">
        {routes.map((route) => (
          <article className="route-card" key={`${route.title}-${route.startsAt}`}>
            <div className="route-time">
              <Clock size={16} />
              <strong>Leave {formatTime(route.departAt)}</strong>
            </div>
            <div>
              <h3>{route.title}</h3>
              <p>{route.passenger} · {route.driveMinutes} min drive + {route.bufferMinutes} min buffer</p>
            </div>
            <div className="route-place">
              <MapPin size={16} />
              <span>{route.to}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SportsPanel({ integrations, schedule }) {
  const sportsIntegrations = integrations.filter((integration) =>
    integrationGroups[0].keys.includes(integration.key)
  );
  const sportsEvents = schedule.filter((event) => ['practice', 'game'].includes(event.type));

  return (
    <section className="panel">
      <PanelHeader icon={Car} title="Sports Sync" />
      <div className="integration-list">
        {sportsIntegrations.map((integration) => (
          <div className="integration" key={integration.key}>
            <span className={integration.connected ? 'dot live' : 'dot'} />
            <div>
              <strong>{integration.label}</strong>
              <small>{integration.status}</small>
            </div>
          </div>
        ))}
      </div>
      <p className="quiet">{sportsEvents.length} practices and games normalized into the current plan.</p>
    </section>
  );
}

function IntegrationsView({ integrations, onSelect }) {
  return (
    <section className="prototype-surface">
      {integrationGroups.map((group) => {
        const groupIntegrations = integrations.filter((integration) => group.keys.includes(integration.key));
        return (
          <article className="integration-panel" key={group.id}>
            <PanelHeader icon={group.icon} title={group.title} />
            <div className="integration-grid">
              {groupIntegrations.map((integration) => (
                <button className="integration-card" key={integration.key} onClick={() => onSelect(integration)}>
                  <div className="integration-title">
                    <span className={integration.connected ? 'dot live' : 'dot'} />
                    <strong>{integration.label}</strong>
                  </div>
                  <p>{integration.capability}</p>
                  <span className={integration.connected ? 'connected-button card-action' : 'card-action'}>
                    {integration.connected ? <CheckCircle2 size={15} /> : <PlugZap size={15} />}
                    {integration.connected ? 'Connected' : 'Connect'}
                  </span>
                </button>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}

function IntegrationDrawer({ integration, onClose, onConnect }) {
  const isCalendar = ['iCal', 'googleCalendar', 'microsoftCalendar'].includes(integration.key);
  const isFood = ['walmart', 'instacart', 'doordash', 'uberEats'].includes(integration.key);
  const helperText = integration.connected
    ? 'This provider is available to the planner. You can still review the setup details.'
    : 'Use this prototype flow to mark the provider connected locally. Production will swap this for OAuth or API-key setup.';

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside className="integration-drawer" role="dialog" aria-modal="true" aria-label={`${integration.label} setup`} onClick={(event) => event.stopPropagation()}>
        <header className="drawer-header">
          <div>
            <span className={integration.connected ? 'drawer-status live' : 'drawer-status'}>{integration.status}</span>
            <h2>{integration.label}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close setup">×</button>
        </header>

        <p className="drawer-copy">{helperText}</p>

        <div className="setup-steps">
          <SetupStep icon={LockKeyhole} title="Authorize" text={isCalendar ? 'Connect calendar access or paste a private iCal feed.' : 'Use provider OAuth or a server-side API credential.'} />
          <SetupStep icon={Settings2} title="Map Data" text={isFood ? 'Map meals to carts, delivery windows, and family allergy rules.' : 'Map teams, children, locations, reminders, and arrival buffers.'} />
          <SetupStep icon={MessageSquareText} title="Review" text="Preview imported events before they are added to the family plan." />
        </div>

        <label className="field-label" htmlFor="integration-note">Prototype credential or feed</label>
        <div className="mock-field">
          <Copy size={16} />
          <input id="integration-note" placeholder={isCalendar ? 'Paste .ics feed URL or OAuth account label' : 'Paste API key label or account nickname'} />
        </div>

        <div className="drawer-actions">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={() => onConnect(integration.key)}>
            <ExternalLink size={16} />
            {integration.connected ? 'Save Setup' : 'Connect in Prototype'}
          </button>
        </div>
      </aside>
    </div>
  );
}

function SetupStep({ icon: Icon, title, text }) {
  return (
    <article className="setup-step">
      <Icon size={17} />
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </article>
  );
}

function MealsView({ meals, providerActions }) {
  return (
    <section className="prototype-surface two-column">
      <article className="integration-panel">
        <PanelHeader icon={Utensils} title="Recipe Planner" />
        <div className="meal-board">
          {meals.map((meal) => (
            <div className="meal-card" key={meal.id || meal.title}>
              <span>{formatDate(meal.date)}</span>
              <h3>{meal.title}</h3>
              <p>{meal.ingredients.join(', ')}</p>
              <small>{meal.allergyNotes.join(', ')}</small>
            </div>
          ))}
        </div>
      </article>
      <article className="integration-panel">
        <PanelHeader icon={ShoppingCart} title="Cart + Delivery Queue" />
        <div className="stack">
          {providerActions.map((action) => (
            <div className="checkout-card" key={`${action.provider}-${action.action}`}>
              <div>
                <strong>{action.provider}</strong>
                <span>{action.action}</span>
              </div>
              <button>Review ${action.estimatedCost}</button>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function RidesView({ routes }) {
  return (
    <section className="prototype-surface">
      <article className="integration-panel">
        <PanelHeader icon={Route} title="Departure Board" />
        <div className="departure-board">
          {routes.map((route) => (
            <div className="departure-card" key={`${route.title}-${route.startsAt}`}>
              <strong>{formatTime(route.departAt)}</strong>
              <div>
                <h3>{route.title}</h3>
                <p>{route.passenger} to {route.to}</p>
              </div>
              <span>{route.confidence}</span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

function DateNightPanel({ goals }) {
  const dateGoals = goals.filter((goal) => goal.category === 'date-night');

  return (
    <section className="panel">
      <PanelHeader icon={Heart} title="Date Night Duty" />
      <div className="stack">
        {dateGoals.map((goal) => (
          <article className="mini-card accent" key={goal.id || goal.title}>
            <strong>{goal.title}</strong>
            <span>{goal.commitment}</span>
            <small>{goal.status} · target {formatDate(goal.targetDate)}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function PanelHeader({ icon: Icon, title }) {
  return (
    <header className="panel-header">
      <Icon size={20} />
      <h2>{title}</h2>
    </header>
  );
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(date));
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

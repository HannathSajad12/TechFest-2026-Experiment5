# TechFest 2026 Portal — React SPA (Experiment 3)

A React Single Page Application rebuilding the TechFest 2026 Portal with
reusable components, props, state, hooks, React Router, the Context API,
and a live API call.

## Setup

This project was hand-assembled (no `node_modules` included — install
before running):

```bash
npm install
npm run dev
```

Then open the address printed in the terminal (usually
http://localhost:5173).

## Project structure

```
techfest2026-react/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── events.js
    ├── context/
    │   └── ThemeContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   ├── EventCard.jsx
    │   └── EventList.jsx
    └── pages/
        ├── Home.jsx
        ├── Events.jsx
        ├── Registration.jsx
        ├── Gallery.jsx
        ├── Contact.jsx
        └── NotFound.jsx
```

## Requirement → implementation map

| # | Requirement | Implemented in |
|---|---|---|
| 1 | Reusable components | components/Navbar.jsx, EventCard.jsx, EventList.jsx |
| 2 | Separate pages (Home/Events/Registration/Gallery/Contact) | pages/*.jsx |
| 3 | Navigation without reload | react-router-dom Routes + Link in App.jsx, Navbar.jsx |
| 4 | Event info from an array of objects | data/events.js + EventList.jsx |
| 5 | Registration form, controlled components | pages/Registration.jsx |
| 6 | Fetch from public API, loading/error states | pages/Home.jsx (useEffect + fetch) |
| 7 | Theme switch from any page | context/ThemeContext.jsx + App.jsx + Navbar.jsx |
| 8 | Event cards with filter/search | pages/Events.jsx |
| 9 | State management throughout | useState in EventCard, Events, Registration; Context for theme |
| 10 | Recommended project structure | folder layout above |

## Testing checklist

- Reload Home — see "Loading..." briefly before announcement titles appear.
- DevTools → Network → Offline, reload Home — red error message appears.
- Click every Navbar link — no reload/white flash.
- Search "web" on Events — only Web Dev Workshop remains.
- Select "Technical" category — Coding Contest & Robotics Challenge remain.
- Click Register repeatedly on a card until seats hit 0 — button becomes SOLD OUT.
- Submit Registration form empty — three validation errors appear.
- Submit Registration form correctly — "Thank you" message replaces the form.
- Toggle theme on Home, navigate to other pages — dark mode persists.
- Visit `/doesnotexist` — 404 page appears with a link back Home.

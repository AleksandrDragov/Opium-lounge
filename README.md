# Opium Lounge

Full-stack MVP for a premium lounge bar: landing page, menu, interactive venue map, booking flow, authentication and customer profile.

## Run locally

1. Copy `server/.env.example` to `server/.env` and replace `JWT_SECRET` with a long random value.
2. Run `npm install`.
3. Run `npm run setup` to initialize the database and demo data.
4. Run `npm run dev` for development, or `npm start` for the production build.

In development, the client is at `http://localhost:3000` and the API at `http://localhost:4000`. `npm start` builds both apps and serves the complete site at `http://localhost:4000`.

Other commands: `npm run dev:client`, `npm run dev:server`, `npm run start:dev`, `npm run start:prod`, `npm run build`, `npm run typecheck`, `npm run test:smoke`. The smoke test expects the API to be running and seeded.

For HTTPS deployment, set `COOKIE_SECURE=true`, update `CLIENT_URL` and replace the development secret. The bundled SQLite setup is intended for local MVP use; moving to PostgreSQL requires changing the Prisma datasource and running a migration.

Demo account after seeding: `demo@opium.local` / `Opium123!`.

The venue images are original AI-generated concept visuals, not photos of a real establishment. Menu prices, floor plan and reservations are demo data. Replace them and add verified contact details before launch.

The interface uses i18next/react-i18next with Czech as the default language. Visitors can switch between Czech, English, Ukrainian and Russian in the header; their choice is saved in local storage. Translation files are in `client/src/i18n/locales/`. New interface text should be added to all four files under the same key.

## GitHub Pages preview

The workflow in `.github/workflows/pages.yml` builds the Webpack frontend and deploys it to GitHub Pages on pushes to `main`. In the repository settings, select **Pages → Build and deployment → GitHub Actions**. The Pages build uses hash-based routes so links and refreshes work under the repository URL. To test it locally, run `PAGES_BASE_PATH=/Opium-lounge/ npm run build -w client`.

GitHub Pages serves static files only. The Pages version is a preview: menu and venue map can be browsed with demo data, but accounts and bookings need the Node.js API hosted separately. The local `npm start` build remains full-stack.

## Stack

- React, TypeScript, React Router, TanStack Query, i18next/react-i18next
- Webpack 5, SCSS
- Node.js, Express, Prisma, SQLite
- JWT in an HTTP-only cookie and bcrypt password hashing

## Frontend structure

Components and pages follow the same folder-per-component pattern as `building-project`, using TypeScript and SCSS:

```text
client/src/
├── app/                       # Authentication context and hooks
├── assets/                    # Logo and venue images
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.scss
│   ├── LanguageSwitcher/
│   ├── Footer/
│   ├── Hero/
│   ├── About/
│   ├── Advantages/
│   ├── VipRooms/
│   ├── Gallery/
│   ├── Contacts/
│   ├── MenuCard/
│   ├── FloorPlan/
│   ├── TableSpot/
│   ├── BookingPanel/
│   └── …                     # Each visual component has its own .tsx and .scss
├── pages/
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   └── HomePage.scss
│   ├── MenuPage/
│   ├── BookingPage/
│   ├── AuthPage/
│   ├── ProfilePage/
│   └── NotFoundPage/
├── data/                      # Demo menu and tables used while API data loads
├── i18n/                      # Configuration and all four translation files
├── services/                  # Typed API client
├── styles/
│   ├── _variables.scss        # Shared colors
│   ├── _mixins.scss           # Shared typography mixins; no emitted CSS
│   ├── _base.scss             # Reset, typography and layout utilities
│   ├── _buttons.scss          # Shared button and link styles
│   ├── _forms.scss            # Shared form and validation styles
│   └── main.scss              # Global styles, loaded once by index.tsx
├── index.tsx                  # Providers and lazy-loaded routes
└── types.ts                   # Shared domain types
```

Import a component's stylesheet directly in its `.tsx` file, for example `import './Header.scss'`. Keep its responsive rules in the same SCSS file. Import shared tokens with `@use '../../styles/variables' as *` and mixins with `@use '../../styles/mixins' as *`; these imports do not duplicate global CSS. Component and page imports use explicit paths such as `../../components/Header/Header`.

Pages compose visual components and own API queries, mutations and page state. Shared visual components receive typed props; the authentication context and API helpers do not need styles because they render no layout. The existing Node.js backend and JavaScript Webpack configuration remain in their respective directories.

# ClientFlow CRM

[![CI](https://github.com/emioj89/clientflow-crm/actions/workflows/ci.yml/badge.svg)](https://github.com/emioj89/clientflow-crm/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/emioj89/clientflow-crm/actions/workflows/deploy.yml/badge.svg)](https://github.com/emioj89/clientflow-crm/actions/workflows/deploy.yml)

A modern CRM for freelancers and small businesses built with React, TypeScript and Supabase, featuring authentication, persistent CRUD operations and row-level data security.

## Live Demo

[https://emioj89.github.io/clientflow-crm/](https://emioj89.github.io/clientflow-crm/)

*(Note: The live demo link will be accessible once the deployment workflow completes on main branch).*

## Features

- **Email/Password Authentication**: User account registration, login, and session persistence via Supabase Auth.
- **Protected Routes**: Secure client-side routing protecting private CRM dashboards and directory pages.
- **Persistent Supabase Database**: Complete PostgreSQL database integration for commercial contact storage.
- **Contact & Lead CRUD**: Full Create, Read, Update, and Delete operations for leads and clients.
- **Search**: Case-insensitive text search matching contact names, companies, or email addresses.
- **Type Filters**: Filter contacts by commercial classification (`All`, `Lead`, `Client`).
- **Status Filters**: Filter pipeline stages (`All`, `New`, `Contacted`, `Qualified`, `Won`, `Lost`).
- **Multiple Sorting Options**: Order directory listings by Newest, Oldest, Name A-Z, Value High-Low, and Value Low-High.
- **Dashboard KPIs**: Metric overview tracking Total Contacts, Leads, Clients, Qualified Leads, Won Opportunities, and Pipeline Value.
- **Pipeline Value**: Real-time aggregation of potential deal revenue across non-lost opportunities.
- **Recent Contacts**: Instant overview of the latest commercial leads added to the system.
- **Responsive Design**: Mobile-friendly layout adapting desktop data tables into card views on mobile viewports.
- **Loading / Error / Empty / Retry States**: Actionable user feedback and graceful error boundaries.
- **Row Level Security (RLS)**: Enforced database-level security policies isolating records per user.
- **User Data Isolation**: Guaranteed data privacy where authenticated users can only view and modify their own records.

## Tech Stack

- **React 19**
- **TypeScript**
- **Vite**
- **React Router (HashRouter)**
- **Supabase Auth**
- **PostgreSQL**
- **Supabase Row Level Security (RLS)**
- **CSS3** (Custom Properties & Flexbox/Grid)
- **Vitest**
- **GitHub Actions**

## Architecture

The codebase adheres to a modular, layer-separated architecture:

```text
src/
├── components/   # UI components (auth, layout, contacts, state views)
├── context/      # Global state providers (AuthContext)
├── hooks/        # Custom React hooks (useAuth, useContacts)
├── lib/          # External integrations (Supabase client initializer)
├── pages/        # Route page views (Login, Register, Dashboard, Contacts, Details, Form)
├── services/     # API service layer handling database calls (contactsService)
├── types/        # TypeScript domain models and interface definitions
└── utils/        # Pure helper functions (filters, stats calculation, formatters)
supabase/
├── schema.sql    # Idempotent database schema, triggers, index, and RLS policies
└── README.md     # Backend setup documentation
```

## Security

- **Publishable Key Only in Frontend**: Uses `VITE_SUPABASE_PUBLISHABLE_KEY` in client environments. Publishable keys are safe for public bundling when combined with RLS.
- **No Service Role Key**: Secret/admin service role keys are never used in frontend code or repository files.
- **Row Level Security**: Table access is enforced at PostgreSQL level using `auth.uid()`.
- **User Data Isolation**: Queries automatically check `(select auth.uid()) = user_id`.
- **Anonymous Table Access Revoked**: All table privileges (`SELECT`, `INSERT`, `UPDATE`, `DELETE`) are explicitly revoked from the `anon` role (`revoke all on table public.contacts from anon;`).
- **Authenticated Explicit Grants**: Explicit permissions are granted exclusively to the `authenticated` role.

## Database

The main table `public.contacts` stores all commercial records with strict constraints:

- `id`: `uuid` primary key.
- `user_id`: `uuid` foreign key referencing `auth.users(id)` with `ON DELETE CASCADE`.
- `name`: `text` required contact name.
- `company`: `text` optional company name.
- `email`: `text` optional email address.
- `phone`: `text` optional phone number.
- `type`: `text` restricted to `'lead'` or `'client'`.
- `status`: `text` restricted to `'new'`, `'contacted'`, `'qualified'`, `'won'`, or `'lost'`.
- `estimated_value`: `numeric` deal value (`>= 0`, default `0`).
- `notes`: `text` optional deal history and notes.
- `created_at` / `updated_at`: `timestamptz` automatically managed timestamps.

Includes a performance index on `user_id` (`contacts_user_id_idx`).

## Local Setup

```bash
git clone https://github.com/emioj89/clientflow-crm.git
cd clientflow-crm
npm install
cp .env.example .env.local
```

Configure your `.env.local` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Run the development server:

```bash
npm run dev
```

## Supabase Setup

1. Create a project at [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Paste the contents of `supabase/schema.sql` and click **Run**.
4. Go to **Project Settings** -> **API**.
5. Copy your **Project URL** and **Publishable Key**.
6. Save them in `.env.local`.

## Available Scripts

- `npm run dev`: Launch local Vite development server with HMR.
- `npm run build`: Type-check using `tsc` and produce production build in `dist/`.
- `npm run lint`: Run Oxlint static code analyzer.
- `npm run test`: Run unit test suite with Vitest.
- `npm run preview`: Serve production build locally for preview.

## Testing

Unit testing is powered by **Vitest**.

- **21 unit tests** currently pass.
- Coverage includes:
  - **Filters**: Text search by name, company, email; case insensitivity; type and status dropdown filtering; combined filters.
  - **Sorting**: Newest, oldest, name A-Z, value high-to-low, value low-to-high.
  - **Stats & KPIs**: Total contacts, leads, clients, qualified leads (`type === 'lead'` AND `status === 'qualified'`), won opportunities, and pipeline value (`status !== 'lost'`).
  - **Formatters**: Currency USD formatting and date parsing.

## Row Level Security

Each authenticated user can only access, create, update, or delete their own contacts. Security policies in `supabase/schema.sql` enforce `(select auth.uid()) = user_id` for every query.

## Deployment

Automated deployment is configured via **GitHub Actions** (`.github/workflows/deploy.yml`) to **GitHub Pages**. Builds run with Vite base path `/clientflow-crm/` and production environment secrets.

## Author

**Emiliano Ostellino**

GitHub: [https://github.com/emioj89](https://github.com/emioj89)

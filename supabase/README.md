# Supabase Database Setup Guide

Follow these steps to set up the backend database for ClientFlow CRM:

1. Create a project at [Supabase](https://supabase.com).
2. Navigate to the **SQL Editor** in your Supabase project dashboard.
3. Open `supabase/schema.sql` from this repository, copy its contents, paste them into the SQL Editor, and click **Run**.
4. Go to **Project Settings** -> **API** in Supabase.
5. Copy your **Project URL** and **publishable key** (or anon key).
6. Create a `.env.local` file in the root of your project:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
   ```
7. Restart your development server (`npm run dev`).

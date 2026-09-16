-- Supabase Schema for ClientFlow CRM

-- Create updated_at automatic trigger function
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create contacts table
create table if not exists public.contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  company text,
  email text,
  phone text,
  type text not null check (type in ('lead', 'client')),
  status text not null check (status in ('new', 'contacted', 'qualified', 'won', 'lost')),
  estimated_value numeric not null default 0 check (estimated_value >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for optimizing query performance on user_id
create index if not exists contacts_user_id_idx
  on public.contacts (user_id);

-- Trigger for updating updated_at on contacts update
drop trigger if exists set_contacts_updated_at on public.contacts;
create trigger set_contacts_updated_at
  before update on public.contacts
  for each row
  execute function public.handle_updated_at();

-- Enable Row Level Security (RLS)
alter table public.contacts enable row level security;

-- Table Grants: Revoke all privileges from anon, grant explicit CRUD to authenticated
revoke all on table public.contacts from anon;
grant select, insert, update, delete on table public.contacts to authenticated;

-- RLS Policies (Idempotent policy creation using drop policy if exists)

-- SELECT policy: authenticated users can only view their own contacts
drop policy if exists "Users can view their own contacts" on public.contacts;
create policy "Users can view their own contacts"
  on public.contacts
  for select
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- INSERT policy: authenticated users can only insert contacts with their own user_id
drop policy if exists "Users can create their own contacts" on public.contacts;
create policy "Users can create their own contacts"
  on public.contacts
  for insert
  to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- UPDATE policy: authenticated users can only update their own contacts
drop policy if exists "Users can update their own contacts" on public.contacts;
create policy "Users can update their own contacts"
  on public.contacts
  for update
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  )
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

-- DELETE policy: authenticated users can only delete their own contacts
drop policy if exists "Users can delete their own contacts" on public.contacts;
create policy "Users can delete their own contacts"
  on public.contacts
  for delete
  to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
  );

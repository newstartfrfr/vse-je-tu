create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('contact', 'product', 'tour', 'partnership')),
  page text,
  source text,
  name text,
  email text,
  phone text,
  organization text,
  budget text,
  preferred_date text,
  message text,
  cart jsonb,
  status text not null default 'new',
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.newsletter_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.inquiries enable row level security;
alter table public.newsletter_signups enable row level security;

drop policy if exists "Allow public insert on inquiries" on public.inquiries;
create policy "Allow public insert on inquiries"
on public.inquiries
for insert
to anon
with check (true);

drop policy if exists "Allow public insert on newsletter_signups" on public.newsletter_signups;
create policy "Allow public insert on newsletter_signups"
on public.newsletter_signups
for insert
to anon
with check (true);

drop policy if exists "No public select inquiries" on public.inquiries;
create policy "No public select inquiries"
on public.inquiries
for select
to anon
using (false);

drop policy if exists "No public select newsletter_signups" on public.newsletter_signups;
create policy "No public select newsletter_signups"
on public.newsletter_signups
for select
to anon
using (false);

comment on table public.inquiries is 'Leads, product requests, tour requests and collaboration contact form entries.';
comment on table public.newsletter_signups is 'Simple newsletter signups from the website.';
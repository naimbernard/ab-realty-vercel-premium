create table if not exists public.properties (
  id text primary key,
  title text not null,
  badge text,
  location text,
  price text,
  summary text,
  highlights text,
  area text,
  image text,
  whatsapp text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.properties enable row level security;

create policy "public read properties" on public.properties
for select using (true);

-- For a production build, use Supabase Auth and restrict insert/update/delete to authenticated admin users.
-- During setup only, you may temporarily create permissive policies for testing, then tighten them.

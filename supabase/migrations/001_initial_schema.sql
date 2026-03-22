-- Cloud-LB initial schema + RLS
-- Run in Supabase SQL Editor or via CLI after creating project.
--
-- After first signup, promote your operator account:
--   update public.profiles set role = 'admin' where id = 'YOUR_USER_UUID';

create extension if not exists "uuid-ossp";

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  primary key (organization_id, user_id)
);

create table public.bots (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots (id) on delete cascade,
  content text not null default '',
  embedding jsonb,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  bot_id uuid not null references public.bots (id) on delete cascade,
  user_message text not null,
  bot_response text not null default '',
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  plan text not null default 'basic',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  unique (organization_id)
);

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  key_hash text not null,
  label text,
  created_at timestamptz not null default now()
);

create index idx_org_members_user on public.organization_members (user_id);
create index idx_bots_org on public.bots (organization_id);
create index idx_documents_bot on public.documents (bot_id);
create index idx_messages_bot on public.messages (bot_id);

-- Helper: is current user admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- Helper: orgs the user belongs to
create or replace function public.user_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select om.organization_id
  from public.organization_members om
  where om.user_id = auth.uid();
$$;

-- Auto profile + default org on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  org_id uuid;
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'user'
  );

  insert into public.organizations (name, owner_id)
  values ('My clinic', new.id)
  returning id into org_id;

  insert into public.organization_members (organization_id, user_id, role)
  values (org_id, new.id, 'owner');

  insert into public.subscriptions (organization_id, plan, status)
  values (org_id, 'basic', 'active');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.bots enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.subscriptions enable row level security;
alter table public.api_keys enable row level security;

-- profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  using (id = auth.uid() or public.is_admin());

-- organizations
create policy "orgs_select_member_or_admin"
  on public.organizations for select
  using (
    public.is_admin()
    or owner_id = auth.uid()
    or id in (select public.user_org_ids())
  );

create policy "orgs_update_owner_or_admin"
  on public.organizations for update
  using (public.is_admin() or owner_id = auth.uid());

create policy "orgs_insert_admin_only"
  on public.organizations for insert
  with check (public.is_admin());

-- organization_members
create policy "org_members_select"
  on public.organization_members for select
  using (
    public.is_admin()
    or user_id = auth.uid()
    or organization_id in (select public.user_org_ids())
  );

create policy "org_members_write_admin"
  on public.organization_members for insert
  with check (public.is_admin());

create policy "org_members_update_admin"
  on public.organization_members for update
  using (public.is_admin());

create policy "org_members_delete_admin"
  on public.organization_members for delete
  using (public.is_admin());

-- bots
create policy "bots_select"
  on public.bots for select
  using (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

create policy "bots_insert"
  on public.bots for insert
  with check (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

create policy "bots_update"
  on public.bots for update
  using (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

create policy "bots_delete"
  on public.bots for delete
  using (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

-- documents
create policy "documents_all"
  on public.documents for all
  using (
    public.is_admin()
    or bot_id in (
      select b.id from public.bots b
      where b.organization_id in (select public.user_org_ids())
    )
  )
  with check (
    public.is_admin()
    or bot_id in (
      select b.id from public.bots b
      where b.organization_id in (select public.user_org_ids())
    )
  );

-- messages
create policy "messages_all"
  on public.messages for all
  using (
    public.is_admin()
    or bot_id in (
      select b.id from public.bots b
      where b.organization_id in (select public.user_org_ids())
    )
  )
  with check (
    public.is_admin()
    or bot_id in (
      select b.id from public.bots b
      where b.organization_id in (select public.user_org_ids())
    )
  );

-- subscriptions
create policy "subs_select"
  on public.subscriptions for select
  using (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

create policy "subs_write_admin"
  on public.subscriptions for insert
  with check (public.is_admin());

create policy "subs_update_admin"
  on public.subscriptions for update
  using (public.is_admin());

-- api_keys
create policy "api_keys_all"
  on public.api_keys for all
  using (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  )
  with check (
    public.is_admin()
    or organization_id in (select public.user_org_ids())
  );

-- Vaultly — vault items schema
-- Provisions the `vault_items` table backing the dashboard CRUD flows.
-- Run in the Supabase SQL editor, or via `supabase db push`.
--
-- Design notes (aligned with Supabase Postgres best practices):
--   * uuid PK via gen_random_uuid() — ids are exposed to the client/API.
--   * user_id FK -> auth.users with ON DELETE CASCADE, indexed.
--   * Soft delete via `deleted_at` powers the Trash section (restore = clear).
--   * text + CHECK instead of native enums — trivial to extend, no migration
--     pain when a category/type/icon is added.
--   * RLS is the security boundary: every statement is scoped to auth.uid().
--   * `updated_at` kept fresh by a BEFORE UPDATE trigger.

-- gen_random_uuid() is built into Postgres 13+ (Supabase ships 15/17), so no
-- pgcrypto extension is required for the primary key default.
create table if not exists public.vault_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid()
              references auth.users (id) on delete cascade,

  type        text not null default 'login'
              constraint vault_items_type_check
              check (type in ('login', 'note', 'card')),
  name        text not null,
  website     text,
  username    text,
  category    text not null default 'Personal'
              constraint vault_items_category_check
              check (category in ('Work', 'Personal', 'Entertainment', 'Shopping', 'Social')),
  tags        text[] not null default '{}',
  favorite    boolean not null default false,

  -- Secrets. For a production vault these should be encrypted client-side
  -- before they ever reach the database; they are stored as-is for this flow.
  password    text,
  notes       text,

  icon_key    text not null default 'generic'
              constraint vault_items_icon_key_check
              check (icon_key in ('github', 'google', 'notion', 'spotify', 'netflix', 'amazon', 'x', 'linkedin', 'generic')),

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- The dashboard always reads "one user's items, split by trashed / not".
-- This composite index leads with the FK/RLS column, so it also satisfies the
-- "index your foreign keys" rule and makes the ON DELETE CASCADE fast.
create index if not exists vault_items_user_deleted_idx
  on public.vault_items (user_id, deleted_at);

-- Keep updated_at accurate on every write without trusting the client clock.
-- Only content edits bump the timestamp: favoriting, trashing/restoring, and
-- tag removal change rows too, but are not "updates" the user tracks, so they
-- must not reshuffle the "Recently Updated" ordering.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  if new.type      is distinct from old.type
     or new.name      is distinct from old.name
     or new.website   is distinct from old.website
     or new.username  is distinct from old.username
     or new.category  is distinct from old.category
     or new.tags      is distinct from old.tags
     or new.password  is distinct from old.password
     or new.notes     is distinct from old.notes then
    new.updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists vault_items_set_updated_at on public.vault_items;
create trigger vault_items_set_updated_at
  before update on public.vault_items
  for each row execute function public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────
alter table public.vault_items enable row level security;

-- (select auth.uid()) is wrapped so the JWT lookup is cached per-statement
-- instead of re-evaluated for every row. Policies are scoped `to authenticated`
-- (the deprecated auth.role() pattern is avoided), and the ownership predicate
-- is what actually prevents cross-user access (BOLA/IDOR).

drop policy if exists "vault_items_select_own" on public.vault_items;
create policy "vault_items_select_own" on public.vault_items
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "vault_items_insert_own" on public.vault_items;
create policy "vault_items_insert_own" on public.vault_items
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

-- UPDATE needs both USING (which rows you may target) and WITH CHECK (what you
-- may write), otherwise a user could reassign their row to another user_id.
drop policy if exists "vault_items_update_own" on public.vault_items;
create policy "vault_items_update_own" on public.vault_items
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "vault_items_delete_own" on public.vault_items;
create policy "vault_items_delete_own" on public.vault_items
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- ── API grants ────────────────────────────────────────────────────────────
-- Some project configurations do not auto-grant new tables to the Data API
-- roles. Anonymous access is intentionally NOT granted — a vault is private.
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.vault_items to authenticated;

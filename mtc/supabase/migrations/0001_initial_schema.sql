-- Users
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  display_name text,
  created_at timestamptz default now()
);

-- AI Ecosystems
create table public.ai_ecosystems (
  id text primary key,
  name text not null,
  role text,
  systems text,
  default_agents text,
  modalities text,
  gateway_options text,
  governance_notes text,
  openrouter_model_string text,
  display_color text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- Departments
create table public.departments (
  id text primary key,
  tier int not null,
  tier_name text,
  name text not null,
  scope text,
  description text,
  display_order int default 0,
  created_at timestamptz default now()
);

-- Masters
create table public.masters (
  id text primary key,
  department_id text references public.departments(id) on delete cascade,
  name text not null,
  affiliation text,
  authority text,
  bio text,
  default_gateway text references public.ai_ecosystems(id),
  display_order int default 0,
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  status text default 'active',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Project Execution Contracts
create table public.project_contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  contract_data jsonb not null,
  version int default 1,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Project Memory
create table public.project_memories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  topic text,
  content text not null,
  created_at timestamptz default now()
);

-- Conductor Executions
create table public.executions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  user_id uuid references public.profiles(id) on delete cascade,
  brief text not null,
  pattern_id text not null,
  task_type text,
  squad_master_ids text[],
  gateway_assignments jsonb default '{}',
  components jsonb default '{}',
  status text default 'pending',
  results jsonb default '[]',
  synthesis_output text,
  approval_required boolean default false,
  approval_status text,
  approval_notes text,
  total_tokens int default 0,
  total_cost_usd numeric(10,6) default 0,
  started_at timestamptz default now(),
  completed_at timestamptz
);

-- Audit Log
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  execution_id uuid references public.executions(id) on delete set null,
  timestamp timestamptz default now(),
  action text not null,
  target text,
  risk_class text,
  status text,
  details jsonb default '{}',
  cost_usd numeric(10,6) default 0
);
create index audit_log_user_time on public.audit_log (user_id, timestamp desc);
create index audit_log_project_time on public.audit_log (project_id, timestamp desc);

-- Connectors
create table public.connectors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  category text not null,
  provider text,
  name text not null,
  url text,
  auth_type text,
  auth_config jsonb default '{}',
  risk_class text default 'medium',
  status text default 'configured',
  capabilities jsonb default '[]',
  metadata jsonb default '{}',
  created_at timestamptz default now(),
  last_used_at timestamptz
);

-- Watchers
create table public.watchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  name text not null,
  trigger_description text not null,
  action_description text not null,
  schedule_cron text,
  schedule_human text,
  status text default 'configured',
  last_run_at timestamptz,
  last_run_status text,
  next_run_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Watcher Runs
create table public.watcher_runs (
  id uuid primary key default gen_random_uuid(),
  watcher_id uuid references public.watchers(id) on delete cascade,
  started_at timestamptz default now(),
  completed_at timestamptz,
  status text,
  output jsonb,
  error_message text
);

-- Output Bundles
create table public.output_bundles (
  id text primary key,
  name text not null,
  description text,
  components jsonb not null,
  display_order int default 0
);

-- Workflows
create table public.workflows (
  id text primary key,
  name text not null,
  description text,
  steps jsonb not null,
  display_order int default 0
);

-- Execution Patterns
create table public.execution_patterns (
  id text primary key,
  name text not null,
  icon text,
  description text,
  use_case text,
  display_order int default 0
);

-- Risk Classes
create table public.risk_classes (
  id text primary key,
  name text not null,
  color text,
  bg_color text,
  examples text,
  approval_default text,
  display_order int default 0
);

-- Automation Platforms
create table public.automation_platforms (
  id text primary key,
  name text not null,
  deployable text,
  auth_type text,
  best_for text,
  url text,
  integration_style text,
  display_order int default 0
);

-- Horizon Templates
create table public.horizon_templates (
  id text primary key,
  name text not null,
  description text,
  capabilities jsonb,
  category text,
  auth_type text,
  display_order int default 0
);

-- Composio Toolkits Cache
create table public.composio_toolkits (
  slug text primary key,
  name text not null,
  category text,
  description text,
  auth_type text,
  is_popular boolean default false,
  last_synced_at timestamptz default now()
);

-- User's enabled Composio toolkits
create table public.user_composio_toolkits (
  user_id uuid references public.profiles(id) on delete cascade,
  toolkit_slug text references public.composio_toolkits(slug) on delete cascade,
  enabled_at timestamptz default now(),
  primary key (user_id, toolkit_slug)
);

-- Custom MCP Servers
create table public.custom_mcp_servers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  tools jsonb not null,
  generated_code text,
  github_repo_url text,
  horizon_deployment_url text,
  status text default 'draft',
  created_at timestamptz default now()
);

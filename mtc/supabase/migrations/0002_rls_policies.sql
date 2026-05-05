-- Enable RLS on all user-scoped tables
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_contracts enable row level security;
alter table public.project_memories enable row level security;
alter table public.executions enable row level security;
alter table public.audit_log enable row level security;
alter table public.connectors enable row level security;
alter table public.watchers enable row level security;
alter table public.watcher_runs enable row level security;
alter table public.user_composio_toolkits enable row level security;
alter table public.custom_mcp_servers enable row level security;

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Projects
create policy "Users can CRUD own projects" on public.projects for all using (auth.uid() = user_id);

-- Project Contracts
create policy "Users can CRUD own contracts" on public.project_contracts for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

-- Project Memories
create policy "Users can CRUD own memories" on public.project_memories for all
  using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));

-- Executions
create policy "Users can CRUD own executions" on public.executions for all using (auth.uid() = user_id);

-- Audit Log
create policy "Users can view own audit log" on public.audit_log for select using (auth.uid() = user_id);
create policy "Users can insert own audit log" on public.audit_log for insert with check (auth.uid() = user_id);

-- Connectors
create policy "Users can CRUD own connectors" on public.connectors for all using (auth.uid() = user_id);

-- Watchers
create policy "Users can CRUD own watchers" on public.watchers for all using (auth.uid() = user_id);

-- Watcher Runs
create policy "Users can view own watcher runs" on public.watcher_runs for select
  using (exists (select 1 from public.watchers w where w.id = watcher_id and w.user_id = auth.uid()));

-- User Composio Toolkits
create policy "Users can CRUD own composio toolkits" on public.user_composio_toolkits for all using (auth.uid() = user_id);

-- Custom MCP Servers
create policy "Users can CRUD own mcp servers" on public.custom_mcp_servers for all using (auth.uid() = user_id);

-- Public read-only tables (no RLS needed — these are global reference data)
-- ai_ecosystems, departments, masters, execution_patterns, risk_classes,
-- automation_platforms, horizon_templates, output_bundles, workflows,
-- composio_toolkits are all public reference data readable by all authenticated users.

create policy "Authenticated users can read ecosystems" on public.ai_ecosystems for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read departments" on public.departments for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read masters" on public.masters for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read patterns" on public.execution_patterns for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read risk classes" on public.risk_classes for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read automation platforms" on public.automation_platforms for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read horizon templates" on public.horizon_templates for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read composio toolkits" on public.composio_toolkits for select using (auth.role() = 'authenticated');

alter table public.ai_ecosystems enable row level security;
alter table public.departments enable row level security;
alter table public.masters enable row level security;
alter table public.execution_patterns enable row level security;
alter table public.risk_classes enable row level security;
alter table public.automation_platforms enable row level security;
alter table public.horizon_templates enable row level security;
alter table public.composio_toolkits enable row level security;

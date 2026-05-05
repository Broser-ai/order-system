-- Execution Patterns
insert into public.execution_patterns (id, name, icon, description, use_case, display_order) values
('single_best_model', 'Single Best Model', '⚡', 'Score all gateways for the task, pick the top-ranked model, call once.', 'Fast, cost-efficient tasks where one strong model suffices.', 1),
('primary_plus_fallback', 'Primary + Fallback', '🔄', 'Try the primary gateway; on error or timeout, fall back to the next-ranked model.', 'Reliability-critical tasks where uptime matters.', 2),
('parallel_expert_mode', 'Parallel Expert Mode', '👥', 'All squad masters call their assigned gateway simultaneously via Promise.all.', 'Multi-perspective analysis, diverse expertise needed quickly.', 3),
('debate_red_team_mode', 'Debate / Red Team', '⚔️', 'One model argues FOR, another AGAINST; a judge model synthesizes a verdict.', 'Strategic decisions, risk analysis, stress-testing ideas.', 4),
('specialist_handoff', 'Specialist Handoff', '🔗', 'Sequential chain: output of model A becomes input of model B, then C.', 'Complex multi-stage tasks: research → draft → refine → format.', 5),
('cheap_batch_mode', 'Cheap Batch Mode', '💰', 'Same brief sent to 5 cheap models (DeepSeek, Qwen, Groq, Together, OpenRouter auto).', 'High-volume, low-cost generation; best-of-N selection.', 6),
('human_approval_checkpoint', 'Human Approval Checkpoint', '🛑', 'Phase 1 runs and pauses; user approves before Phase 2 executes.', 'High-risk actions: deploys, sends, payments, legal submissions.', 7),
('synthesis_after_parallel', 'Synthesis After Parallel', '🧬', 'Run all squad masters in parallel, then call a synthesis model on all outputs.', 'Research reports, strategy documents, comprehensive analysis.', 8);

-- Risk Classes
insert into public.risk_classes (id, name, color, bg_color, examples, approval_default, display_order) values
('low', 'Low Risk', '#16a34a', '#dcfce7', 'Read-only docs, web search, data retrieval, summarization, draft generation to clipboard', 'auto_allow', 1),
('medium', 'Medium Risk', '#d97706', '#fef3c7', 'Sandbox writes, draft emails (not sent), staging deploys, CRM updates in test env', 'approve_first_run', 2),
('high', 'High Risk', '#dc2626', '#fee2e2', 'Production deploys, customer-facing emails, CRM production writes, API calls with side effects', 'approve_every_run', 3),
('critical', 'Critical Risk', '#7c3aed', '#ede9fe', 'Payments, legal submissions, regulated filings, data deletion, infrastructure changes', 'approve_plus_second_reviewer', 4);

-- Automation Platforms
insert into public.automation_platforms (id, name, deployable, auth_type, best_for, url, integration_style, display_order) values
('n8n', 'n8n', 'self-hosted or n8n.cloud', 'webhook_secret', 'Complex multi-step workflows, EU data residency, open-source', 'https://n8n.io', 'webhook_trigger', 1),
('make', 'Make (formerly Integromat)', 'cloud', 'webhook_secret', 'Visual workflow builder, 1000+ app integrations, moderate complexity', 'https://make.com', 'webhook_trigger', 2),
('zapier', 'Zapier', 'cloud', 'webhook_secret', 'Simplest setup, largest app ecosystem, non-technical users', 'https://zapier.com', 'webhook_trigger', 3),
('pipedream', 'Pipedream', 'cloud', 'api_key', 'Developer-first, code + no-code hybrid, event streaming', 'https://pipedream.com', 'webhook_trigger', 4);

-- Horizon Templates
insert into public.horizon_templates (id, name, description, capabilities, category, auth_type, display_order) values
('weather-server', 'Weather Server', 'Get current weather and forecasts for any location', '["get_weather", "get_forecast", "get_alerts"]', 'data', 'none', 1),
('web-scraper', 'Web Scraper', 'Extract structured data from any website', '["scrape_url", "extract_text", "extract_links", "screenshot"]', 'data', 'api_key', 2),
('database-connector', 'Database Connector', 'Read and write to PostgreSQL, MySQL, or SQLite databases', '["query_db", "insert_record", "update_record", "delete_record", "list_tables"]', 'integration', 'connection_string', 3),
('email-sender', 'Email Sender', 'Send transactional and bulk emails via SMTP or SendGrid', '["send_email", "send_bulk", "get_template", "track_open"]', 'communication', 'api_key', 4),
('file-manager', 'File Manager', 'Read, write, and transform files (PDF, CSV, JSON, XLSX)', '["read_file", "write_file", "convert_format", "merge_files", "split_pdf"]', 'utility', 'none', 5),
('crm-connector', 'CRM Connector', 'Sync with Salesforce, HubSpot, or Pipedrive CRM systems', '["get_contact", "create_contact", "update_contact", "list_deals", "create_deal"]', 'integration', 'oauth', 6),
('slack-notifier', 'Slack Notifier', 'Send messages and notifications to Slack channels', '["send_message", "send_dm", "create_channel", "upload_file"]', 'communication', 'oauth', 7),
('calendar-manager', 'Calendar Manager', 'Manage Google Calendar or Outlook events and availability', '["list_events", "create_event", "update_event", "check_availability", "find_slot"]', 'productivity', 'oauth', 8),
('code-executor', 'Code Executor', 'Run Python, JavaScript, or shell commands in a sandbox', '["run_python", "run_javascript", "run_shell", "install_package"]', 'utility', 'api_key', 9),
('search-aggregator', 'Search Aggregator', 'Search across Google, Bing, Tavily, and academic sources', '["web_search", "academic_search", "news_search", "image_search"]', 'data', 'api_key', 10);

-- Seed composio toolkits (popular ones as bootstrap)
insert into public.composio_toolkits (slug, name, category, description, auth_type, is_popular) values
('github', 'GitHub', 'development', 'Manage repos, issues, PRs, and code', 'oauth', true),
('slack', 'Slack', 'communication', 'Send messages and manage Slack workspaces', 'oauth', true),
('gmail', 'Gmail', 'communication', 'Send and manage emails via Gmail', 'oauth', true),
('google-drive', 'Google Drive', 'storage', 'Read and write files in Google Drive', 'oauth', true),
('notion', 'Notion', 'productivity', 'Manage Notion pages, databases, and blocks', 'oauth', true),
('salesforce', 'Salesforce', 'crm', 'CRM contacts, leads, opportunities, and reports', 'oauth', true),
('hubspot', 'HubSpot', 'crm', 'Marketing, sales, and CRM automation', 'oauth', true),
('jira', 'Jira', 'project-management', 'Create and manage Jira issues and projects', 'oauth', true),
('linear', 'Linear', 'project-management', 'Issue tracking and project management', 'oauth', true),
('airtable', 'Airtable', 'database', 'Read and write Airtable bases and records', 'api_key', true),
('stripe', 'Stripe', 'payments', 'Payments, subscriptions, and billing', 'api_key', true),
('twilio', 'Twilio', 'communication', 'SMS, calls, and messaging APIs', 'api_key', false),
('sendgrid', 'SendGrid', 'email', 'Transactional and marketing email sending', 'api_key', false),
('mailchimp', 'Mailchimp', 'email', 'Email marketing and audience management', 'oauth', false),
('shopify', 'Shopify', 'ecommerce', 'Manage products, orders, and customers', 'oauth', false),
('google-sheets', 'Google Sheets', 'productivity', 'Read and write spreadsheet data', 'oauth', true),
('calendar', 'Google Calendar', 'productivity', 'Manage calendar events and availability', 'oauth', true),
('trello', 'Trello', 'project-management', 'Boards, lists, and cards management', 'oauth', false),
('asana', 'Asana', 'project-management', 'Tasks and project tracking', 'oauth', false),
('monday', 'Monday.com', 'project-management', 'Work OS and project management', 'oauth', false),
('zendesk', 'Zendesk', 'support', 'Customer support tickets and help desk', 'oauth', false),
('intercom', 'Intercom', 'support', 'Customer messaging and support automation', 'oauth', false),
('discord', 'Discord', 'communication', 'Send messages and manage Discord servers', 'oauth', false),
('twitter', 'Twitter/X', 'social', 'Post tweets and manage Twitter presence', 'oauth', false),
('linkedin', 'LinkedIn', 'social', 'Post and manage LinkedIn content', 'oauth', false),
('dropbox', 'Dropbox', 'storage', 'File storage and sharing', 'oauth', false),
('box', 'Box', 'storage', 'Enterprise file storage and collaboration', 'oauth', false),
('zoom', 'Zoom', 'communication', 'Schedule and manage video meetings', 'oauth', false),
('microsoft-teams', 'Microsoft Teams', 'communication', 'Team messaging and meeting management', 'oauth', false),
('outlook', 'Outlook', 'email', 'Microsoft email and calendar management', 'oauth', false),
('quickbooks', 'QuickBooks', 'finance', 'Accounting and invoice management', 'oauth', false),
('xero', 'Xero', 'finance', 'Cloud accounting and bookkeeping', 'oauth', false),
('docusign', 'DocuSign', 'legal', 'Electronic signatures and contract management', 'oauth', false),
('clickup', 'ClickUp', 'project-management', 'All-in-one project management platform', 'oauth', false),
('figma', 'Figma', 'design', 'Design file access and comment management', 'oauth', false),
('webflow', 'Webflow', 'cms', 'CMS and website management', 'oauth', false),
('wordpress', 'WordPress', 'cms', 'Post and page management', 'api_key', false),
('contentful', 'Contentful', 'cms', 'Headless CMS content management', 'api_key', false),
('segment', 'Segment', 'analytics', 'Customer data platform and analytics', 'api_key', false),
('mixpanel', 'Mixpanel', 'analytics', 'Product analytics and event tracking', 'api_key', false),
('amplitude', 'Amplitude', 'analytics', 'Digital analytics platform', 'api_key', false),
('datadog', 'Datadog', 'monitoring', 'Infrastructure and application monitoring', 'api_key', false),
('pagerduty', 'PagerDuty', 'monitoring', 'Incident response and alerting', 'api_key', false),
('aws', 'AWS', 'cloud', 'Amazon Web Services infrastructure management', 'api_key', false),
('gcp', 'Google Cloud', 'cloud', 'Google Cloud Platform services', 'oauth', false),
('azure', 'Microsoft Azure', 'cloud', 'Azure cloud services and resources', 'oauth', false),
('supabase', 'Supabase', 'database', 'PostgreSQL database and auth management', 'api_key', false),
('mongodb', 'MongoDB Atlas', 'database', 'NoSQL database management', 'api_key', false),
('redis', 'Redis', 'database', 'In-memory cache and data structure store', 'api_key', false),
('vercel', 'Vercel', 'deployment', 'Deploy and manage Vercel projects', 'api_key', false),
('netlify', 'Netlify', 'deployment', 'Deploy and manage Netlify sites', 'api_key', false),
('docker', 'Docker Hub', 'development', 'Container image management', 'api_key', false),
('kubernetes', 'Kubernetes', 'infrastructure', 'Container orchestration management', 'api_key', false),
('terraform', 'Terraform Cloud', 'infrastructure', 'Infrastructure as code management', 'api_key', false);

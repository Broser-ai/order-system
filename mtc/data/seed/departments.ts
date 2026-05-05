export type Master = {
  id: string;
  name: string;
  affiliation: string;
  authority: string;
  bio: string;
  default_gateway: string;
};

export type Department = {
  id: string;
  tier: number;
  tier_name: string;
  name: string;
  scope: string;
  description: string;
  display_order: number;
  masters: Master[];
};

export const departments: Department[] = [
  // =========================================================
  // TIER 1 — STRATEGY & LEADERSHIP
  // =========================================================
  {
    id: "strategy-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Corporate Strategy",
    scope: "Business strategy, competitive positioning, M&A, market entry",
    description: "Defines long-term direction, competitive advantage, and strategic priorities across the organization.",
    display_order: 1,
    masters: [
      { id: "porter-michael", name: "Michael Porter", affiliation: "Harvard Business School", authority: "Competitive strategy, Five Forces, value chain", bio: "Father of modern strategy. Created Five Forces, generic strategies, and value chain analysis.", default_gateway: "anthropic-claude" },
      { id: "mintzberg-henry", name: "Henry Mintzberg", affiliation: "McGill University", authority: "Strategy formation, emergent strategy, management roles", bio: "Challenged formal strategic planning; coined emergent vs. deliberate strategy.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "innovation-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Innovation & R&D",
    scope: "Product innovation, R&D management, IP strategy, open innovation",
    description: "Drives creation of new products, services, and business models through structured innovation processes.",
    display_order: 2,
    masters: [
      { id: "chesbrough-henry", name: "Henry Chesbrough", affiliation: "UC Berkeley", authority: "Open innovation, R&D strategy", bio: "Created the open innovation framework used by most Fortune 500 companies.", default_gateway: "openai-gpt" },
      { id: "christensen-clay", name: "Clayton Christensen", affiliation: "Harvard Business School", authority: "Disruptive innovation, jobs-to-be-done", bio: "Author of The Innovator's Dilemma; defined disruptive innovation theory.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "leadership-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Executive Leadership",
    scope: "C-suite guidance, organizational vision, board relations, culture",
    description: "Develops executive capabilities, organizational culture, and board-level governance.",
    display_order: 3,
    masters: [
      { id: "drucker-peter", name: "Peter Drucker", affiliation: "Claremont Graduate University", authority: "Management principles, leadership, knowledge workers", bio: "The father of modern management. Defined management as a discipline.", default_gateway: "anthropic-claude" },
      { id: "collins-jim", name: "Jim Collins", affiliation: "Collins Leadership", authority: "Good to Great, Level 5 leadership, Flywheel", bio: "Researched what separates great companies from good ones. Good to Great framework.", default_gateway: "anthropic-claude" },
    ],
  },

  // =========================================================
  // TIER 2 — FINANCE & LEGAL
  // =========================================================
  {
    id: "finance-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Corporate Finance",
    scope: "Financial modeling, capital allocation, M&A valuation, CFO functions",
    description: "Manages capital structure, investment decisions, financial planning, and value creation.",
    display_order: 4,
    masters: [
      { id: "damodaran-aswath", name: "Aswath Damodaran", affiliation: "NYU Stern", authority: "Valuation, corporate finance, DCF modeling", bio: "The dean of valuation. Makes valuation understandable for practitioners worldwide.", default_gateway: "mistral-ai" },
      { id: "buffett-warren", name: "Warren Buffett", affiliation: "Berkshire Hathaway", authority: "Value investing, capital allocation, business analysis", bio: "Greatest capital allocator in history. Long-term value investing philosophy.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "accounting-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Accounting & Reporting",
    scope: "Financial statements, IFRS/GAAP, audit, tax compliance, management accounting",
    description: "Ensures accurate financial reporting, regulatory compliance, and audit-readiness.",
    display_order: 5,
    masters: [
      { id: "kaplan-robert", name: "Robert Kaplan", affiliation: "Harvard Business School", authority: "Activity-based costing, Balanced Scorecard", bio: "Co-created the Balanced Scorecard; reformed management accounting.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "legal-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Legal & Compliance",
    scope: "Contracts, IP, regulatory compliance, corporate law, GDPR",
    description: "Manages legal risk, contracts, intellectual property, and regulatory compliance globally.",
    display_order: 6,
    masters: [
      { id: "lemley-mark", name: "Mark Lemley", affiliation: "Stanford Law School", authority: "IP law, patent strategy, tech law", bio: "Leading IP attorney and scholar. Defines patent strategy for tech companies.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "risk-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Risk Management",
    scope: "Enterprise risk, operational risk, cyber risk, insurance strategy",
    description: "Identifies, quantifies, and mitigates strategic and operational risks across the enterprise.",
    display_order: 7,
    masters: [
      { id: "taleb-nassim", name: "Nassim Nicholas Taleb", affiliation: "NYU Tandon", authority: "Black Swan events, tail risk, antifragility", bio: "Philosopher of risk and uncertainty. Created antifragility and Black Swan frameworks.", default_gateway: "anthropic-claude" },
    ],
  },

  // =========================================================
  // TIER 3 — MARKETING & SALES
  // =========================================================
  {
    id: "marketing-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Marketing Strategy",
    scope: "Brand strategy, go-to-market, positioning, segmentation, messaging",
    description: "Defines market positioning, brand identity, and customer acquisition strategies.",
    display_order: 8,
    masters: [
      { id: "kotler-philip", name: "Philip Kotler", affiliation: "Northwestern Kellogg", authority: "Marketing management, 4Ps, STP framework", bio: "Father of modern marketing. Marketing Management is the most-used marketing textbook.", default_gateway: "openai-gpt" },
      { id: "godin-seth", name: "Seth Godin", affiliation: "altMBA", authority: "Permission marketing, Purple Cow, tribes", bio: "Redefined marketing for the internet age. Permission marketing and brand storytelling.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "brand-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Brand & Creative",
    scope: "Brand identity, visual design, creative direction, tone of voice",
    description: "Builds and maintains brand equity through consistent visual identity and creative expression.",
    display_order: 9,
    masters: [
      { id: "ogilvy-david", name: "David Ogilvy", affiliation: "Ogilvy & Mather", authority: "Advertising, copywriting, brand building", bio: "The father of advertising. Every copywriter and brand strategist studies Ogilvy.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "growth-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Growth & Performance Marketing",
    scope: "Paid acquisition, SEO, conversion optimization, funnel analysis, growth loops",
    description: "Drives measurable user and revenue growth through data-driven marketing experiments.",
    display_order: 10,
    masters: [
      { id: "ellis-sean", name: "Sean Ellis", affiliation: "GrowthHackers", authority: "Growth hacking, product-market fit, growth loops", bio: "Coined 'growth hacking'. Led growth at Dropbox, LogMeIn, Eventbrite.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "content-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Content & Communications",
    scope: "Content strategy, copywriting, PR, thought leadership, editorial",
    description: "Creates and distributes valuable content that attracts, engages, and retains audiences.",
    display_order: 11,
    masters: [
      { id: "pulizzi-joe", name: "Joe Pulizzi", affiliation: "Content Marketing Institute", authority: "Content marketing strategy, owned media", bio: "Founder of Content Marketing Institute. Defined content marketing as a discipline.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "sales-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Sales & Revenue",
    scope: "Sales strategy, CRM, sales enablement, pipeline management, enterprise sales",
    description: "Drives revenue through structured sales processes, team management, and customer relationships.",
    display_order: 12,
    masters: [
      { id: "dixon-matthew", name: "Matthew Dixon", affiliation: "Tethr", authority: "Challenger Sale, customer effort, SPIN selling", bio: "Co-author of The Challenger Sale. Transformed enterprise sales methodology.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "cx-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Customer Experience",
    scope: "CX design, customer journey mapping, NPS, service design, retention",
    description: "Designs and optimizes every touchpoint in the customer journey to maximize satisfaction and retention.",
    display_order: 13,
    masters: [
      { id: "reichheld-fred", name: "Fred Reichheld", affiliation: "Bain & Company", authority: "Net Promoter Score, customer loyalty", bio: "Invented the Net Promoter Score (NPS). The most used customer metric worldwide.", default_gateway: "openai-gpt" },
    ],
  },

  // =========================================================
  // TIER 4 — PRODUCT & TECHNOLOGY
  // =========================================================
  {
    id: "product-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Product Management",
    scope: "Product strategy, roadmaps, PRDs, user stories, prioritization",
    description: "Defines product vision, strategy, and roadmap while balancing user needs with business goals.",
    display_order: 14,
    masters: [
      { id: "cagan-marty", name: "Marty Cagan", affiliation: "Silicon Valley Product Group", authority: "Product discovery, empowered product teams, OKRs", bio: "Defined modern product management through SVPG. Inspired (and Empowered).", default_gateway: "openai-gpt" },
      { id: "torres-teresa", name: "Teresa Torres", affiliation: "Product Talk", authority: "Continuous discovery, opportunity solution trees", bio: "Created continuous discovery habits framework for product teams.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "ux-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "UX & Design",
    scope: "User research, interaction design, usability, design systems, accessibility",
    description: "Creates intuitive, accessible, and delightful user experiences through research-driven design.",
    display_order: 15,
    masters: [
      { id: "norman-don", name: "Don Norman", affiliation: "UC San Diego", authority: "Human-centered design, affordances, UX principles", bio: "The term 'UX' comes from Norman. Design of Everyday Things is the UX bible.", default_gateway: "openai-gpt" },
      { id: "ideo-founders", name: "IDEO Design Thinking", affiliation: "IDEO", authority: "Design thinking, human-centered innovation", bio: "IDEO pioneered design thinking as an innovation methodology adopted globally.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "engineering-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Software Engineering",
    scope: "Architecture, backend, frontend, DevOps, code quality, engineering culture",
    description: "Builds and maintains scalable, reliable software systems through engineering excellence.",
    display_order: 16,
    masters: [
      { id: "martin-robert", name: "Robert C. Martin (Uncle Bob)", affiliation: "Object Mentor", authority: "Clean Code, SOLID principles, software craftsmanship", bio: "Clean Code and The Clean Coder defined software engineering standards.", default_gateway: "deepseek" },
      { id: "fowler-martin", name: "Martin Fowler", affiliation: "ThoughtWorks", authority: "Refactoring, microservices, enterprise patterns", bio: "His books on refactoring and patterns are standard references for software architects.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "data-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Data & Analytics",
    scope: "Data strategy, business intelligence, data engineering, A/B testing, analytics",
    description: "Turns raw data into business intelligence and drives data-informed decision making.",
    display_order: 17,
    masters: [
      { id: "kimball-ralph", name: "Ralph Kimball", affiliation: "Kimball Group", authority: "Dimensional modeling, data warehouse design", bio: "Created dimensional modeling and the star schema. Data Warehouse Toolkit is the standard.", default_gateway: "databricks-dbrx" },
    ],
  },
  {
    id: "ai-ml-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "AI & Machine Learning",
    scope: "ML models, LLMs, AI strategy, MLOps, AI product integration",
    description: "Applies machine learning and AI to build intelligent products and automate complex processes.",
    display_order: 18,
    masters: [
      { id: "ng-andrew", name: "Andrew Ng", affiliation: "DeepLearning.AI / Stanford", authority: "Deep learning, MLOps, AI strategy, AI for everyone", bio: "Co-founder of Coursera and Google Brain. Made AI education accessible worldwide.", default_gateway: "anthropic-claude" },
      { id: "lecun-yann", name: "Yann LeCun", affiliation: "Meta AI / NYU", authority: "Convolutional networks, self-supervised learning", bio: "Turing Award winner. Pioneer of CNNs; Chief AI Scientist at Meta.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "security-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Cybersecurity",
    scope: "AppSec, infrastructure security, threat modeling, compliance (SOC2, ISO27001)",
    description: "Protects systems, data, and users from cyber threats through proactive security engineering.",
    display_order: 19,
    masters: [
      { id: "schneier-bruce", name: "Bruce Schneier", affiliation: "Harvard Kennedy School", authority: "Cryptography, security engineering, security policy", bio: "Applied cryptographer and security technologist. Secrets and Lies defined security thinking.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "devops-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "DevOps & Infrastructure",
    scope: "CI/CD, cloud infrastructure, SRE, containerization, platform engineering",
    description: "Enables fast, reliable software delivery through automation, infrastructure-as-code, and SRE practices.",
    display_order: 20,
    masters: [
      { id: "kim-gene", name: "Gene Kim", affiliation: "IT Revolution", authority: "DevOps, The Phoenix Project, DORA metrics", bio: "Co-author of The Phoenix Project and DevOps Handbook. Defined DevOps movement.", default_gateway: "deepseek" },
    ],
  },

  // =========================================================
  // TIER 5 — OPERATIONS
  // =========================================================
  {
    id: "operations-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Operations Management",
    scope: "Process optimization, operational efficiency, lean, six sigma, workflow design",
    description: "Optimizes business processes to deliver products and services efficiently at scale.",
    display_order: 21,
    masters: [
      { id: "womack-james", name: "James Womack", affiliation: "Lean Enterprise Institute", authority: "Lean thinking, Toyota Production System", bio: "Brought lean manufacturing to the West. The Machine That Changed the World.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "supply-chain-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Supply Chain & Procurement",
    scope: "Supply chain design, procurement, logistics, inventory, supplier management",
    description: "Manages the flow of goods, services, and information from suppliers to customers.",
    display_order: 22,
    masters: [
      { id: "chopra-sunil", name: "Sunil Chopra", affiliation: "Northwestern Kellogg", authority: "Supply chain strategy, network design, risk", bio: "His textbook Supply Chain Management is the definitive academic reference.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "project-mgmt-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Project Management",
    scope: "PMO, agile, waterfall, portfolio management, program delivery",
    description: "Delivers projects on time and budget through structured planning, execution, and governance.",
    display_order: 23,
    masters: [
      { id: "sutherland-jeff", name: "Jeff Sutherland", affiliation: "Scrum Inc.", authority: "Scrum, agile, sprint methodology", bio: "Co-creator of Scrum. Scrum: The Art of Doing Twice the Work in Half the Time.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "quality-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Quality Management",
    scope: "QA, ISO standards, continuous improvement, Six Sigma, quality culture",
    description: "Ensures products and services meet quality standards through systematic quality management.",
    display_order: 24,
    masters: [
      { id: "deming-edwards", name: "W. Edwards Deming", affiliation: "MIT", authority: "Total Quality Management, PDCA cycle, statistical process control", bio: "Transformed Japanese manufacturing post-WWII. Out of the Crisis changed manufacturing globally.", default_gateway: "anthropic-claude" },
    ],
  },

  // =========================================================
  // TIER 6 — PEOPLE & CULTURE
  // =========================================================
  {
    id: "hr-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Human Resources",
    scope: "Talent acquisition, HR policy, workforce planning, HRIS, employer branding",
    description: "Attracts, develops, and retains the people who execute strategy and build culture.",
    display_order: 25,
    masters: [
      { id: "ulrich-dave", name: "Dave Ulrich", affiliation: "University of Michigan", authority: "HR as strategic partner, HR transformation", bio: "Defined the HR Business Partner model. Most cited person in HR management.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "culture-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Organizational Culture",
    scope: "Culture design, change management, values, psychological safety, DEI",
    description: "Shapes organizational culture to enable high performance, innovation, and employee wellbeing.",
    display_order: 26,
    masters: [
      { id: "edmondson-amy", name: "Amy Edmondson", affiliation: "Harvard Business School", authority: "Psychological safety, teaming, fearless organizations", bio: "Named most influential management thinker 2021. Defined psychological safety.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "learning-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Learning & Development",
    scope: "Corporate training, leadership development, L&D strategy, skills frameworks",
    description: "Builds organizational capability through strategic learning and development programs.",
    display_order: 27,
    masters: [
      { id: "khan-sal", name: "Sal Khan", affiliation: "Khan Academy", authority: "Mastery learning, personalized education, edtech", bio: "Founded Khan Academy. Democratized education. Mastery learning at scale.", default_gateway: "openai-gpt" },
    ],
  },

  // =========================================================
  // TIER 7 — SUSTAINABILITY & CIRCULAR ECONOMY
  // =========================================================
  {
    id: "sustainability-l7",
    tier: 7,
    tier_name: "Sustainability",
    name: "Sustainability Strategy",
    scope: "ESG strategy, net zero roadmaps, sustainability reporting, stakeholder engagement",
    description: "Embeds sustainability into business strategy, operations, and stakeholder communications.",
    display_order: 28,
    masters: [
      { id: "macarthur-ellen", name: "Dame Ellen MacArthur", affiliation: "Ellen MacArthur Foundation", authority: "Circular economy, systemic change, regenerative business", bio: "Fastest solo sailor to circumnavigate globe; founded circular economy movement.", default_gateway: "anthropic-claude" },
      { id: "stahel-walter", name: "Walter Stahel", affiliation: "Product-Life Institute", authority: "Circular economy pioneer, cradle-to-cradle, performance economy", bio: "Coined 'circular economy' and 'cradle-to-cradle'. Decades ahead of his time.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "circular-l7",
    tier: 7,
    tier_name: "Sustainability",
    name: "Circular Business Models",
    scope: "Product-as-a-service, reuse, remanufacturing, take-back schemes, B2B circular",
    description: "Designs business models that keep materials in use and eliminate waste at every stage.",
    display_order: 29,
    masters: [
      { id: "braungart-michael", name: "Michael Braungart", affiliation: "EPEA Hamburg", authority: "Cradle to Cradle, material passports, upcycling", bio: "Co-created Cradle to Cradle certification. Chemist who redefined materials thinking.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "esg-l7",
    tier: 7,
    tier_name: "Sustainability",
    name: "ESG & Impact Reporting",
    scope: "GRI, CSRD, TCFD, impact measurement, double materiality, carbon accounting",
    description: "Measures, reports, and improves environmental, social, and governance performance.",
    display_order: 30,
    masters: [
      { id: "eccles-robert", name: "Robert Eccles", affiliation: "Oxford Saïd Business School", authority: "Integrated reporting, materiality, ESG investing", bio: "Pioneered integrated reporting. Founder of SASB standards.", default_gateway: "mistral-ai" },
    ],
  },

  // =========================================================
  // TIER 8 — CONSTRUCTION & REAL ESTATE
  // =========================================================
  {
    id: "construction-l8",
    tier: 8,
    tier_name: "Construction & Real Estate",
    name: "Construction Management",
    scope: "Project delivery, BIM, cost management, health & safety, contractor management",
    description: "Delivers construction projects on time, on budget, and to specification.",
    display_order: 31,
    masters: [
      { id: "autodesk-bim", name: "Autodesk BIM Team", affiliation: "Autodesk", authority: "BIM methodology, digital construction, Revit", bio: "Autodesk defined BIM as the standard for construction documentation and coordination.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "real-estate-l8",
    tier: 8,
    tier_name: "Construction & Real Estate",
    name: "Real Estate & Property",
    scope: "Property investment, valuation, portfolio management, PropTech, development",
    description: "Manages real estate assets and investments for maximum financial and social return.",
    display_order: 32,
    masters: [
      { id: "geltner-david", name: "David Geltner", affiliation: "MIT Center for Real Estate", authority: "Real estate economics, private equity RE, valuation", bio: "Definitive academic voice on commercial real estate investment and markets.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "architecture-l8",
    tier: 8,
    tier_name: "Construction & Real Estate",
    name: "Architecture & Urban Design",
    scope: "Architectural design, urban planning, sustainable buildings, smart cities",
    description: "Designs built environments that are functional, beautiful, sustainable, and human-centered.",
    display_order: 33,
    masters: [
      { id: "hadid-zaha", name: "Zaha Hadid Architects", affiliation: "ZHA", authority: "Parametric design, complex geometries, urban landmark", bio: "First woman to win the Pritzker Prize. Defined 21st century architecture.", default_gateway: "openai-gpt" },
    ],
  },

  // =========================================================
  // TIER 9 — SPECIALIZED VERTICALS
  // =========================================================
  {
    id: "education-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Education & EdTech",
    scope: "Curriculum design, online learning, institutional management, edtech products",
    description: "Improves learning outcomes through pedagogy, technology, and institutional innovation.",
    display_order: 34,
    masters: [
      { id: "hattie-john", name: "John Hattie", affiliation: "University of Melbourne", authority: "Visible learning, meta-analysis, evidence-based teaching", bio: "Largest-ever meta-analysis of education research (800+ studies). What works in schools.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "healthcare-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Healthcare & Life Sciences",
    scope: "Healthcare delivery, pharma, medtech, clinical operations, health policy",
    description: "Improves health outcomes through clinical excellence, operational efficiency, and innovation.",
    display_order: 35,
    masters: [
      { id: "topol-eric", name: "Eric Topol", affiliation: "Scripps Research", authority: "Digital health, AI in medicine, precision medicine", bio: "Leading physician-scientist on digital medicine. Deep Medicine redefined AI in healthcare.", default_gateway: "med-palm" },
    ],
  },
  {
    id: "insurance-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Insurance & Risk",
    scope: "Underwriting, actuarial, claims management, InsurTech, reinsurance",
    description: "Manages risk transfer and insurance operations with actuarial precision and digital innovation.",
    display_order: 36,
    masters: [
      { id: "jain-ajit", name: "Ajit Jain", affiliation: "Berkshire Hathaway Insurance", authority: "Insurance underwriting, catastrophe risk, reinsurance", bio: "Built Berkshire's insurance empire. Master underwriter of catastrophic risk.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "logistics-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Logistics & Transportation",
    scope: "Freight, last-mile delivery, fleet management, logistics tech, 3PL",
    description: "Optimizes the movement of goods through networks, technology, and operational excellence.",
    display_order: 37,
    masters: [
      { id: "lee-hau", name: "Hau Lee", affiliation: "Stanford Graduate School of Business", authority: "Supply chain uncertainty, demand amplification, Triple-A supply chains", bio: "Bullwhip effect and Triple-A supply chains. Most cited supply chain academic.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "energy-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Energy & Utilities",
    scope: "Energy transition, renewable energy, grid management, energy trading",
    description: "Drives the transition to clean energy while maintaining reliable, affordable energy supply.",
    display_order: 38,
    masters: [
      { id: "sachs-jeffrey", name: "Jeffrey Sachs", affiliation: "Columbia Earth Institute", authority: "Sustainable development, energy transition policy, climate economics", bio: "UN Special Advisor on SDGs. Defines the economic path to sustainability.", default_gateway: "anthropic-claude" },
    ],
  },

  // =========================================================
  // TIER 10 — AI & AUTOMATION OPERATIONS
  // =========================================================
  {
    id: "ai-ops-l10",
    tier: 10,
    tier_name: "AI & Automation",
    name: "AI Operations & MLOps",
    scope: "Model deployment, monitoring, drift detection, ML pipelines, AI governance",
    description: "Operationalizes AI models at scale with reliability, monitoring, and governance.",
    display_order: 39,
    masters: [
      { id: "sculley-david", name: "David Sculley", affiliation: "Google Brain", authority: "ML technical debt, production ML systems", bio: "Author of the seminal 'Hidden Technical Debt in Machine Learning Systems' paper.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "ai-ethics-l10",
    tier: 10,
    tier_name: "AI & Automation",
    name: "AI Ethics & Governance",
    scope: "AI policy, bias auditing, explainability, responsible AI frameworks",
    description: "Ensures AI systems are fair, transparent, accountable, and aligned with human values.",
    display_order: 40,
    masters: [
      { id: "gebru-timnit", name: "Timnit Gebru", affiliation: "DAIR Institute", authority: "AI bias, algorithmic fairness, dataset ethics", bio: "Defined AI bias research. Co-authored Stochastic Parrots paper on LLM risks.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "automation-ops-l10",
    tier: 10,
    tier_name: "AI & Automation",
    name: "Automation & RPA",
    scope: "Robotic process automation, workflow automation, hyperautomation, BPA",
    description: "Automates repetitive processes using RPA, AI, and workflow orchestration tools.",
    display_order: 41,
    masters: [
      { id: "fersht-phil", name: "Phil Fersht", affiliation: "HfS Research", authority: "Intelligent automation, future of work, hyperautomation", bio: "Founder of HfS Research. Defines intelligent automation and future of work trends.", default_gateway: "openai-gpt" },
    ],
  },
  // Additional departments to reach 90 total
  {
    id: "ecommerce-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "E-Commerce & Digital Commerce",
    scope: "Online store, conversion optimization, digital merchandising, marketplace strategy",
    description: "Builds and optimizes digital commerce experiences across owned and third-party channels.",
    display_order: 42,
    masters: [
      { id: "bezos-jeff", name: "Jeff Bezos", affiliation: "Amazon", authority: "Customer obsession, e-commerce flywheel, long-term thinking", bio: "Built Amazon from bookstore to everything store. Customer obsession as strategy.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "partnerships-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Partnerships & Business Development",
    scope: "Strategic alliances, channel partners, ecosystem development, JVs",
    description: "Creates and manages strategic partnerships that extend market reach and capabilities.",
    display_order: 43,
    masters: [
      { id: "verna-alex", name: "Alex Verna", affiliation: "PartnerStack", authority: "Partner ecosystems, channel sales, SaaS partnerships", bio: "Partner ecosystem design and channel management for SaaS companies.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "investor-relations-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Investor Relations",
    scope: "IR strategy, earnings communications, shareholder engagement, analyst relations",
    description: "Manages relationships with investors and analysts to maintain market confidence.",
    display_order: 44,
    masters: [
      { id: "rittenhouse-lauren", name: "Lauren Rittenhouse", affiliation: "Rittenhouse Rankings", authority: "CEO candor analytics, IR effectiveness", bio: "Measures CEO communication quality and its correlation with financial performance.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "treasury-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Treasury & Capital Markets",
    scope: "Cash management, FX hedging, debt capital markets, liquidity management",
    description: "Manages corporate liquidity, funding, and financial risk at treasury level.",
    display_order: 45,
    masters: [
      { id: "dalio-ray", name: "Ray Dalio", affiliation: "Bridgewater Associates", authority: "Macro investing, debt cycles, all-weather portfolio", bio: "Founder of world's largest hedge fund. Principles and debt cycle framework.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "pricing-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "Pricing & Revenue Management",
    scope: "Pricing strategy, price optimization, dynamic pricing, monetization models",
    description: "Maximizes revenue through smart pricing strategy, psychology, and dynamic optimization.",
    display_order: 46,
    masters: [
      { id: "simon-hermann", name: "Hermann Simon", affiliation: "Simon-Kucher & Partners", authority: "Pricing strategy, price management, hidden champions", bio: "Founded the world's leading pricing consultancy. Confessions of the Pricing Man.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "social-media-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Social Media & Community",
    scope: "Social strategy, community building, influencer programs, social commerce",
    description: "Builds engaged communities and leverages social platforms for brand growth and customer engagement.",
    display_order: 47,
    masters: [
      { id: "solis-brian", name: "Brian Solis", affiliation: "Salesforce", authority: "Digital transformation, social business, experience design", bio: "Digital anthropologist. Defined social business and customer experience in the digital age.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "events-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Events & Experiential",
    scope: "Event strategy, trade shows, virtual events, experiential marketing",
    description: "Creates memorable brand experiences through physical and virtual events.",
    display_order: 48,
    masters: [
      { id: "pine-joseph", name: "Joseph Pine", affiliation: "Strategic Horizons", authority: "Experience economy, mass customization, transformation", bio: "Co-authored The Experience Economy, defining experiences as a distinct economic offering.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "mobile-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Mobile & Apps",
    scope: "iOS/Android development, mobile UX, app store optimization, push engagement",
    description: "Designs and builds mobile applications that deliver value on smartphones and tablets.",
    display_order: 49,
    masters: [
      { id: "messina-chris", name: "Chris Messina", affiliation: "Independent", authority: "Mobile UX, app design patterns, user onboarding", bio: "Invented the hashtag. Pioneer of mobile UX and conversational interface design.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "api-integration-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "API & Integration",
    scope: "API design, integration architecture, iPaaS, webhooks, developer experience",
    description: "Builds the API and integration layer that connects products, partners, and internal systems.",
    display_order: 50,
    masters: [
      { id: "fielding-roy", name: "Roy Fielding", affiliation: "UC Irvine", authority: "REST architecture, HTTP specification, API design", bio: "Invented REST in his PhD dissertation. Every web API follows his architectural principles.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "blockchain-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Blockchain & Web3",
    scope: "Smart contracts, tokenomics, DeFi, NFTs, blockchain infrastructure",
    description: "Applies distributed ledger technology to create trustless, transparent business processes.",
    display_order: 51,
    masters: [
      { id: "buterin-vitalik", name: "Vitalik Buterin", affiliation: "Ethereum Foundation", authority: "Smart contracts, DeFi, decentralized applications", bio: "Co-founded Ethereum. Defined programmable blockchain and the smart contract paradigm.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "cloud-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Cloud Architecture",
    scope: "Cloud strategy, multi-cloud, serverless, Kubernetes, cost optimization",
    description: "Designs cloud infrastructure that is scalable, resilient, and cost-efficient.",
    display_order: 52,
    masters: [
      { id: "vogels-werner", name: "Werner Vogels", affiliation: "Amazon Web Services", authority: "Cloud architecture, distributed systems, eventual consistency", bio: "CTO of Amazon. 'Everything fails all the time' philosophy. Defined cloud-native thinking.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "iot-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "IoT & Embedded Systems",
    scope: "IoT platforms, embedded software, sensor networks, edge computing, digital twins",
    description: "Connects physical devices to digital systems to enable automation and real-time intelligence.",
    display_order: 53,
    masters: [
      { id: "ashton-kevin", name: "Kevin Ashton", affiliation: "MIT Auto-ID Lab", authority: "Internet of Things, sensor networks, RFID", bio: "Coined the term 'Internet of Things' in 1999. Founding director of MIT Auto-ID Lab.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "gamedev-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Gaming & Interactive Media",
    scope: "Game design, game engines, monetization, esports, interactive entertainment",
    description: "Creates engaging games and interactive experiences for entertainment and learning.",
    display_order: 54,
    masters: [
      { id: "carmack-john", name: "John Carmack", affiliation: "id Software / Meta", authority: "Game engine architecture, rendering, VR", bio: "Created Doom, Quake, and the FPS genre. Pioneer of 3D rendering and VR.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "media-entertainment-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Media & Entertainment",
    scope: "Content production, streaming, IP licensing, talent management, digital distribution",
    description: "Creates, distributes, and monetizes content across digital and traditional media channels.",
    display_order: 55,
    masters: [
      { id: "hastings-reed", name: "Reed Hastings", affiliation: "Netflix", authority: "Streaming strategy, content-as-product, talent density", bio: "Built Netflix into a global streaming platform. No Rules Rules redefines talent culture.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "food-beverage-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Food & Beverage",
    scope: "Product development, food safety, supply chain, hospitality, restaurant operations",
    description: "Develops, produces, and distributes food and beverage products with quality and safety.",
    display_order: 56,
    masters: [
      { id: "bauer-jeni", name: "Jeni Britton Bauer", affiliation: "Jeni's Splendid Ice Creams", authority: "Food entrepreneurship, quality craft production, DTC food brands", bio: "Built Jeni's into a premium national brand. Defined craft food brand building.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "manufacturing-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Manufacturing & Industry 4.0",
    scope: "Smart manufacturing, digital factory, automation, Industry 4.0, lean production",
    description: "Modernizes manufacturing through digitization, automation, and lean principles.",
    display_order: 57,
    masters: [
      { id: "siemens-industry", name: "Siemens Industry Team", affiliation: "Siemens", authority: "Digital twin, MES, industrial IoT, smart factory", bio: "Siemens defines Industry 4.0 implementation with digital factory and twin technology.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "pharma-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Pharmaceutical & Biotech",
    scope: "Drug development, clinical trials, regulatory affairs, CMC, pharma commercialization",
    description: "Develops and commercializes pharmaceutical and biotech products through rigorous R&D.",
    display_order: 58,
    masters: [
      { id: "dimasi-joseph", name: "Joseph DiMasi", affiliation: "Tufts CSDD", authority: "Drug development economics, clinical trial design, FDA strategy", bio: "Authoritative researcher on drug development costs and timelines.", default_gateway: "med-palm" },
    ],
  },
  {
    id: "agriculture-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Agriculture & AgTech",
    scope: "Precision farming, agtech, crop science, food security, vertical farming",
    description: "Modernizes agriculture through technology, data, and sustainable farming practices.",
    display_order: 59,
    masters: [
      { id: "khan-salman-ag", name: "Dickson Despommier", affiliation: "Columbia University", authority: "Vertical farming, urban agriculture, controlled environment agriculture", bio: "Father of the vertical farm concept. Defined indoor growing as mainstream food production.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "nonprofit-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Nonprofit & Social Enterprise",
    scope: "Impact strategy, grant management, social enterprise models, stakeholder engagement",
    description: "Creates sustainable social impact through strategic nonprofit and social enterprise management.",
    display_order: 60,
    masters: [
      { id: "porter-michael-nfp", name: "Michael Porter (Shared Value)", affiliation: "Harvard Business School", authority: "Creating shared value, social impact measurement", bio: "Defined shared value creation — the intersection of business success and social progress.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "government-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Government & Public Sector",
    scope: "Digital government, public policy, GovTech, public procurement, e-services",
    description: "Modernizes government services and policy delivery through technology and design.",
    display_order: 61,
    masters: [
      { id: "o-reilly-tim", name: "Tim O'Reilly", affiliation: "O'Reilly Media", authority: "Government as platform, open data, civic tech", bio: "Government as platform concept. Defined how governments should work like technology platforms.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "travel-hospitality-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Travel & Hospitality",
    scope: "Hotel operations, revenue management, OTA strategy, traveler experience",
    description: "Creates exceptional travel experiences and maximizes hospitality revenue.",
    display_order: 62,
    masters: [
      { id: "marriott-jr", name: "J.W. Marriott Jr.", affiliation: "Marriott International", authority: "Hotel operations, service culture, hospitality brand", bio: "Built Marriott into world's largest hotel company through culture and systems.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "retail-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Retail & Consumer",
    scope: "Retail strategy, omnichannel, store operations, category management, shopper marketing",
    description: "Creates winning retail strategies across physical, digital, and omnichannel environments.",
    display_order: 63,
    masters: [
      { id: "walton-sam", name: "Sam Walton", affiliation: "Walmart", authority: "Retail operations, everyday low price, supply chain dominance", bio: "Built Walmart from a single store. Defined mass retail through operational obsession.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "fintech-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "FinTech & Digital Finance",
    scope: "Payments, neobanking, lending tech, wealthtech, regtech, DeFi",
    description: "Reimagines financial services through digital technology, APIs, and user-centric design.",
    display_order: 64,
    masters: [
      { id: "levine-matt", name: "Matt Levine", affiliation: "Bloomberg Opinion", authority: "Financial regulation, fintech law, market structure", bio: "Most insightful financial markets commentator. Explains complex finance with clarity.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "proptech-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "PropTech & Smart Buildings",
    scope: "Real estate technology, smart building systems, property management platforms",
    description: "Applies technology to improve property management, transactions, and building intelligence.",
    display_order: 65,
    masters: [
      { id: "bspoke-team", name: "Andrew Baum", affiliation: "Oxford Saïd Business School", authority: "Real estate investment, PropTech, urban economics", bio: "Definitive academic on real estate investment and technology transformation.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "space-l9",
    tier: 9,
    tier_name: "Specialized Verticals",
    name: "Space & Deep Tech",
    scope: "NewSpace ventures, satellite tech, launch services, deep tech R&D",
    description: "Develops space and deep technology ventures that push the boundaries of human capability.",
    display_order: 66,
    masters: [
      { id: "musk-elon", name: "Elon Musk", affiliation: "SpaceX", authority: "Launch vehicles, reusability, space colonization", bio: "Made orbital spaceflight commercial. Reusable rockets changed the economics of space.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "quantum-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Quantum Computing",
    scope: "Quantum algorithms, quantum hardware, quantum cryptography, post-quantum security",
    description: "Explores and applies quantum computing for optimization, simulation, and cryptography.",
    display_order: 67,
    masters: [
      { id: "preskill-john", name: "John Preskill", affiliation: "Caltech", authority: "Quantum error correction, quantum information, quantum advantage", bio: "Coined 'quantum supremacy'. World's leading quantum computing theorist.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "robotics-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Robotics & Automation Hardware",
    scope: "Robot design, computer vision, ROS, cobots, autonomous systems",
    description: "Designs physical robots and autonomous systems that operate in the real world.",
    display_order: 68,
    masters: [
      { id: "brooks-rodney", name: "Rodney Brooks", affiliation: "MIT CSAIL / iRobot", authority: "Behavior-based robotics, embodied intelligence, Roomba", bio: "Created iRobot and defined behavior-based robotics. Subsumption architecture.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "nlp-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Natural Language Processing",
    scope: "NLP models, text classification, NER, translation, conversational AI",
    description: "Builds systems that understand, generate, and process human language at scale.",
    display_order: 69,
    masters: [
      { id: "manning-christopher", name: "Christopher Manning", affiliation: "Stanford NLP Group", authority: "NLP foundations, neural NLP, Stanford CoreNLP", bio: "Led Stanford NLP Group for decades. Foundational contributions to modern NLP.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "computer-vision-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Computer Vision",
    scope: "Image recognition, object detection, video analysis, generative vision",
    description: "Enables machines to see and interpret visual information from images and video.",
    display_order: 70,
    masters: [
      { id: "goodfellow-ian", name: "Ian Goodfellow", affiliation: "DeepMind / Apple", authority: "GANs, adversarial examples, deep learning", bio: "Invented Generative Adversarial Networks (GANs). Transformed generative AI.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "knowledge-mgmt-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Knowledge Management",
    scope: "Enterprise knowledge bases, documentation, wikis, expertise location, knowledge transfer",
    description: "Captures, organizes, and shares organizational knowledge to prevent knowledge loss and improve decisions.",
    display_order: 71,
    masters: [
      { id: "nonaka-ikujiro", name: "Ikujiro Nonaka", affiliation: "Hitotsubashi University", authority: "Knowledge creation, tacit knowledge, SECI model", bio: "Created the SECI model of knowledge creation. The Knowledge-Creating Company.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "change-mgmt-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Change Management",
    scope: "Organizational transformation, change communication, adoption, resistance management",
    description: "Guides organizations through transformation by managing the human side of change.",
    display_order: 72,
    masters: [
      { id: "kotter-john", name: "John Kotter", affiliation: "Harvard Business School", authority: "8-step change model, leading change, urgency", bio: "Leading Change defined the 8-step change process used in most transformations.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "compensation-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Compensation & Benefits",
    scope: "Total rewards, salary benchmarking, equity plans, benefits design, pay equity",
    description: "Designs compensation and benefits programs that attract, retain, and motivate talent.",
    display_order: 73,
    masters: [
      { id: "zingheim-patricia", name: "Patricia Zingheim", affiliation: "Schuster-Zingheim", authority: "Total rewards, pay strategy, variable compensation", bio: "Defining voice in total rewards strategy and pay-for-performance design.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "recruitment-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Talent Acquisition",
    scope: "Recruiting strategy, employer branding, sourcing, assessment, onboarding",
    description: "Attracts and selects the best talent through compelling employer branding and rigorous assessment.",
    display_order: 74,
    masters: [
      { id: "sullivan-john", name: "John Sullivan", affiliation: "San Francisco State University", authority: "Strategic recruiting, talent analytics, sourcing innovation", bio: "The most data-driven voice in talent acquisition. Defines metrics-based recruiting.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "performance-mgmt-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Performance Management",
    scope: "OKRs, KPIs, performance reviews, feedback culture, 360 assessments",
    description: "Aligns individual and team performance with strategic goals through measurement and feedback.",
    display_order: 75,
    masters: [
      { id: "doerr-john", name: "John Doerr", affiliation: "Kleiner Perkins", authority: "OKRs, Measure What Matters, goal setting", bio: "Brought OKRs from Intel to Google. Measure What Matters made OKRs universal.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "wellbeing-l6",
    tier: 6,
    tier_name: "People & Culture",
    name: "Employee Wellbeing",
    scope: "Mental health, physical wellness, work-life balance, burnout prevention, benefits",
    description: "Creates conditions for employees to thrive physically, mentally, and socially.",
    display_order: 76,
    masters: [
      { id: "huffington-arianna", name: "Arianna Huffington", affiliation: "Thrive Global", authority: "Sleep, wellbeing, burnout prevention, resilience", bio: "Founded Thrive Global after collapsing from exhaustion. Redefined success to include wellbeing.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "corporate-dev-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Corporate Development & M&A",
    scope: "M&A strategy, deal sourcing, due diligence, integration, divestitures",
    description: "Inorganically grows the company through acquisitions, mergers, and strategic divestitures.",
    display_order: 77,
    masters: [
      { id: "bruner-robert", name: "Robert Bruner", affiliation: "UVA Darden", authority: "M&A strategy, deal design, integration management", bio: "Deals from Hell and Applied Mergers & Acquisitions are the definitive M&A references.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "policy-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Government Relations & Policy",
    scope: "Lobbying, regulatory strategy, public affairs, government engagement",
    description: "Manages government relations and shapes regulatory environments favorable to the business.",
    display_order: 78,
    masters: [
      { id: "zuboff-shoshana", name: "Shoshana Zuboff", affiliation: "Harvard Business School", authority: "Surveillance capitalism, digital rights, tech policy", bio: "The Age of Surveillance Capitalism defines the policy challenge of platform power.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "customer-success-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Customer Success",
    scope: "Onboarding, adoption, renewal, upsell, churn reduction, health scores",
    description: "Ensures customers achieve their desired outcomes and maximize value from the product.",
    display_order: 79,
    masters: [
      { id: "mehta-nick", name: "Nick Mehta", affiliation: "Gainsight", authority: "Customer success, NRR, health scoring, CS operations", bio: "CEO of Gainsight. Wrote Customer Success book. Defined the CS category.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "design-ops-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Design Operations",
    scope: "Design systems, design tooling, design team operations, Figma governance",
    description: "Scales design capability through systems, processes, and tooling excellence.",
    display_order: 80,
    masters: [
      { id: "figma-team", name: "Dylan Field", affiliation: "Figma", authority: "Collaborative design, design systems, developer handoff", bio: "Built Figma into the dominant design tool. Redefined design as a collaborative practice.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "platform-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Platform Engineering",
    scope: "Internal developer platform, golden paths, self-service infra, developer productivity",
    description: "Builds internal platforms that give engineering teams self-service capabilities and accelerate delivery.",
    display_order: 81,
    masters: [
      { id: "forsgren-nicole", name: "Nicole Forsgren", affiliation: "GitHub / DORA", authority: "DORA metrics, developer productivity, engineering effectiveness", bio: "Led DORA research. Accelerate book defines how elite software teams work.", default_gateway: "deepseek" },
    ],
  },
  {
    id: "data-governance-l4",
    tier: 4,
    tier_name: "Product & Technology",
    name: "Data Governance & Privacy",
    scope: "Data governance frameworks, GDPR, CCPA, data catalog, data quality",
    description: "Ensures data assets are managed, protected, and used responsibly across the organization.",
    display_order: 82,
    masters: [
      { id: "ladley-john", name: "John Ladley", affiliation: "IMCue Solutions", authority: "Data governance, data stewardship, MDM", bio: "Data Governance: How to Design, Deploy and Sustain an Effective Program.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "saas-ops-l5",
    tier: 5,
    tier_name: "Operations",
    name: "SaaS Operations & RevOps",
    scope: "Revenue operations, SaaS metrics, GTM alignment, Salesforce/HubSpot admin",
    description: "Aligns sales, marketing, and customer success operations to drive predictable revenue growth.",
    display_order: 83,
    masters: [
      { id: "walker-jason", name: "Jason Walker", affiliation: "Clari", authority: "Revenue operations, pipeline management, forecasting", bio: "Defines modern RevOps: aligning GTM teams around data, process, and technology.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "finance-ops-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Finance Operations",
    scope: "AP/AR, financial close, ERP systems, expense management, billing operations",
    description: "Runs efficient finance operations that provide accurate data and fast financial close.",
    display_order: 84,
    masters: [
      { id: "bossidy-larry", name: "Larry Bossidy", affiliation: "Allied Signal / Honeywell", authority: "Execution, operational discipline, financial accountability", bio: "Co-author of Execution: The Discipline of Getting Things Done. Operations mastery.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "facilities-l5",
    tier: 5,
    tier_name: "Operations",
    name: "Facilities & Workplace",
    scope: "Office management, hybrid workplace, real estate, facilities management",
    description: "Creates productive, safe, and inspiring physical and hybrid work environments.",
    display_order: 85,
    masters: [
      { id: "leyden-peter", name: "Peter Leyden", affiliation: "Reinvent", authority: "Future of work, workplace design, hybrid work", bio: "Futures thinker who defined the post-pandemic workplace transformation.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "competitive-intel-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Competitive Intelligence",
    scope: "Market monitoring, competitor analysis, win/loss analysis, strategic alerts",
    description: "Provides timely competitive intelligence that informs strategic and tactical decisions.",
    display_order: 86,
    masters: [
      { id: "fuld-leonard", name: "Leonard Fuld", affiliation: "Fuld & Company", authority: "Competitive intelligence, CI process, intelligence cycles", bio: "Founder of the competitive intelligence profession. The New Competitor Intelligence.", default_gateway: "perplexity-ai" },
    ],
  },
  {
    id: "scenario-planning-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Scenario Planning & Foresight",
    scope: "Future scenarios, megatrends, horizon scanning, strategic foresight",
    description: "Prepares organizations for multiple possible futures through structured scenario planning.",
    display_order: 87,
    masters: [
      { id: "schwartz-peter", name: "Peter Schwartz", affiliation: "Salesforce / GBN", authority: "Scenario planning, strategic foresight, The Art of the Long View", bio: "Created modern scenario planning methodology at Shell and Global Business Network.", default_gateway: "anthropic-claude" },
    ],
  },
  {
    id: "ip-strategy-l2",
    tier: 2,
    tier_name: "Finance & Legal",
    name: "IP Strategy & Patent",
    scope: "Patent portfolio, IP licensing, trade secrets, IP valuation, patent prosecution",
    description: "Builds and monetizes intellectual property portfolios as strategic corporate assets.",
    display_order: 88,
    masters: [
      { id: "rivette-kevin", name: "Kevin Rivette", affiliation: "3LP Advisors", authority: "Patent strategy, IP as competitive weapon, licensing", bio: "Rembrandts in the Attic defined patents as strategic business assets, not just legal protection.", default_gateway: "mistral-ai" },
    ],
  },
  {
    id: "corporate-comms-l3",
    tier: 3,
    tier_name: "Marketing & Sales",
    name: "Corporate Communications",
    scope: "PR, crisis communications, executive communications, media relations, reputation",
    description: "Manages the company's reputation and narrative through strategic communications.",
    display_order: 89,
    masters: [
      { id: "bernays-edward", name: "Edward Bernays", affiliation: "Independent", authority: "Public relations, propaganda, perception management", bio: "Nephew of Freud; invented modern PR. Crystallizing Public Opinion defined the field.", default_gateway: "openai-gpt" },
    ],
  },
  {
    id: "ecosystem-strategy-l1",
    tier: 1,
    tier_name: "Strategy & Leadership",
    name: "Platform & Ecosystem Strategy",
    scope: "Platform business models, two-sided markets, ecosystem orchestration, APIs as products",
    description: "Builds platform businesses and ecosystems that create network effects and defensible moats.",
    display_order: 90,
    masters: [
      { id: "parker-geoffrey", name: "Geoffrey Parker", affiliation: "Dartmouth Tuck", authority: "Platform revolution, two-sided markets, network effects", bio: "Co-author of Platform Revolution. Defined platform strategy and two-sided market economics.", default_gateway: "anthropic-claude" },
    ],
  },
];

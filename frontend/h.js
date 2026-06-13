graph TD
    %% ==========================================
    %% SYSTEM SPECIFIC STYLING SYSTEM
    %% ==========================================
    classDef presentation fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
    classDef presNode fill:#0f172a,stroke:#60a5fa,stroke-width:1px,color:#3b82f6;
    
    classDef application fill:#0f172a,stroke:#10b981,stroke-width:2px,color:#f8fafc;
    classDef appNode fill:#022c22,stroke:#34d399,stroke-width:1px,color:#10b981;
    
    classDef data fill:#171717,stroke:#a855f7,stroke-width:2px,color:#f8fafc;
    classDef dataNode fill:#2e1065,stroke:#c084fc,stroke-width:1px,color:#a855f7;
    
    classDef utility fill:#334155,stroke:#94a3b8,stroke-width:1px,color:#f1f5f9;

    %% ==========================================
    %% 1. PRESENTATION TIER (FRONTEND)
    %% ==========================================
    subgraph Tier1 ["CLIENT LAYER - PRESENTATION TIER (Vercel Edge Network)"]
        A["[Component] React SPA Views <br><i>BillingPage, ItemsPage, HistoryPage, TrashPage</i>"]
        B["[State/Hook] Global Application Context <br><i>ThemeContext, useToast Hooks Engine</i>"]
        C["[Interface] Network Gateway Module <br><b>services/api.js (Runtime Endpoint Router)</b>"]
        
        A --> B
        B --> C
    end
    class Tier1 presentation;
    class A,B,C presNode;

    %% Network Ingress Boundary
    C ==>|"Protocol: HTTPS REST API <br> Payload: Application/JSON"| D
    linkStyle 2 stroke:#3b82f6,stroke-width:3px;

    %% ==========================================
    %% 2. APPLICATION TIER (BACKEND)
    %% ==========================================
    subgraph Tier2 ["COMPUTE LAYER - APPLICATION LOGIC TIER (Render Platform)"]
        D["[Runtime] Node.js Process <br><i>server.js Framework Base</i>"]
        E["[Middleware] Core Request Filters <br><i>CORS Interceptors, Express Body-Parsers</i>"]
        F["[Routing] Express Router Pipelines <br><i>/api/bills, /api/items, /api/trash</i>"]
        G["[Service] Controllers Domain Logic <br><i>billController.js, trashController.js</i>"]
        H["[Data-Mapper] Mongoose ODM Layer <br><i>Type-Casting & Schema Validation Enforcers</i>"]
        
        D --> E
        E --> F
        F --> G
        G --> H
    end
    class Tier2 application;
    class D,E,F,G,H appNode;

    %% Database Wire Ingress
    H ==>|"Protocol: Native MongoDB Wire Protocol <br> Transport: TLS Encrypted over Port 27017"| I
    linkStyle 7 stroke:#10b981,stroke-width:3px;

    %% ==========================================
    %% 3. DATA PERSISTENCE TIER (DATABASE)
    %% ==========================================
    subgraph Tier3 ["STORAGE LAYER - DATA PERSISTENCE TIER (MongoDB Atlas)"]
        I{"[Security Gate] Network Firewall <br><b>Origin Whitelist Check (0.0.0.0/0)</b>"}
        J[("--- Database Instance --- <br> DB: mohavhir_billing_prod")]
        
        subgraph Collections ["Production Document Collections Schema"]
            K["[Collection] Bills <br><i>Invoices Schema Records</i>"]
            L["[Collection] Items <br><i>Inventory & Price Matrix</i>"]
            M["[Collection] Parties <br><i>B2B Customer Profiles</i>"]
            N["[Collection] Counters <br><i>Sequence Tracking & Recycled Numbers Array</i>"]
        end
        
        I --> J
        J --> K
        J --> L
        J --> M
        J --> N
    end
    class Tier3,Collections data;
    class I,J,K,L,M,N dataNode;

    %% Auxiliary Elements
    U["[Helper] utils/formatters.js <br><i>Deterministic Currency & Tax Calculators</i>"] -. Static Injection .-> A
    class U utility;
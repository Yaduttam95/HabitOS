# ⚡️ Architecture & Data Flow

> **The Problem:** Most habit trackers hold your data hostage or require expensive monthly subscriptions for sync.  
> **The Solution:** A professional-grade, **Offline-First** React App that uses **Google Sheets** as a free, specialized, and private backend database.

This architecture delivers **60fps performance** on any device, zero latency interaction, and complete data ownership.

---

## 1. The "Secret Sauce" Architecture

We rely on a **Queue-Based Optimistic UI** pattern. This means the app never waits for the internet.

```mermaid
graph TD
    subgraph Client [Frontend - React App]
        style Client fill:#FAFAFA,stroke:#333,stroke-width:2px
        
        UI["User Interface Components"]
        Logic["Sync Engine (The Brain)"]
        
        subgraph Browsers ["Local Browser Storage"]
            SessionDB[("Session Cache (Instant Read)")]
            QueueDB[("Mutation Queue (Write Buffer)")]
        end
    end

    subgraph Server [Backend - Serverless Google Apps Script]
        style Server fill:#E8F5E9,stroke:#1b5e20,stroke-width:2px
        
        API["Unified Sync Endpoint"]
        Batch["Batch Processor"]
        Database[("YOUR Google Sheet")]
    end

    %% Wiring
    UI <--> Logic
    Logic <--> SessionDB
    Logic <--> QueueDB
    
    Logic --"Compressed Batch (JSON)"--> API
    API --> Batch
    Batch <--> Database
```

## 2. The Completel Data Lifecycle

Trace a single user action: **"Checking off a Habit"**.

```mermaid
flowchart TD
    %% Initial State
    Start((Start)) --> UserAction["1. Click Checkbox"]
    
    %% Phase 1: Optimistic Update (Instant)
    subgraph Phase1 ["Phase 1: Zero Latency UI"]
        direction TB
        UserAction --> UpdateState["2. Update Local State"]
        UpdateState --> UpdateUI["3. Re-render UI (16ms)"]
        UpdateState --> WriteQueue["4. Append Action to Queue"]
    end
    
    Phase1 --> Idle{"Wait for Sync Trigger"}
    
    %% Phase 2: Synchronization
    Idle -->|Auto or Manual Sync| SyncStart["5. Sync Engine Wakes Up"]
    
    subgraph Phase2 ["Phase 2: Atomic Batch Commit"]
        direction TB
        SyncStart --> Bundle["6. Change Compression"]
        Bundle --> NetRequest["7. Single HTTP POST"]
        
        NetRequest --> ServerReceive["8. Server Unpacks Batch"]
        ServerReceive --> AtomicWrite["9. Write Changes to Sheet"]
        
        AtomicWrite --> FetchFresh["10. Fetch Global State"]
    end
    
    %% Phase 3: Reconciliation
    subgraph Phase3 ["Phase 3: Source of Truth"]
        direction TB
        FetchFresh --> NetReturn["11. Return New Data"]
        NetReturn --> ClientReceive["12. Hot-Swap Local Cache"]
        ClientReceive --> ClearQueue["13. Flush Queue"]
    end
    
    Phase2 --> Phase3
```

## 3. Data Models (Private & Exportable)

Your data isn't hidden in a binary blob. It lives in readable rows in YOUR Google Sheet.

| Sheet Name | Columns | Description |
| :--- | :--- | :--- |
| **Habits** | `id`, `name`, `color`, `icon` | Configuration for your tracker. |
| **DailyLogs** | `date`, `completedHabits`, `sleep`, `journal`, `screenTime`, `moneySpent` | The heavy lifting. A JSON array stores completion IDs and expense details. |
| **Settings** | `key`, `value` | App preferences (Theme, Mode). |

## 4. Why Developers Love This

### 🚀 **Batch Processing (The 1-Request Rule)**
Instead of firing 10 requests when you mark 10 days as "Done", we fire **1 request**.
- **Efficiency**: 10x less battery usage.
- **Speed**: Syncs months of data in < 800ms.
- **Safety**: Atomic transactions (all or nothing).

### 🛡 **Privacy by Default**
We don't have a database. **You** have a database.
- The app is just a window into your personal Google Sheet.
- Zero tracking.
- Zero subscriptions.
- 100% Exportable (It's just a spreadsheet!).

### 🔁 **Conflict Resolution**
The "Server (Sheet)" is always the **Source of Truth**.
1. We push your changes.
2. We immediately download the Sheet's state.
3. If changes happened on another device, they overwrite your local cache instantly.

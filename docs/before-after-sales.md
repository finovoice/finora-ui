Before vs After: Sales Page State Refactor

File: app/sales/page.tsx

Before (useState scattered)
- State in component:
  - loading, clientList, drawerOpen, activeLead, addLead, collapsedColumns, client
  - selectedPlan, selectedLeadQuality, searchQuery
- Effects and data fetching directly in component using startServerAPI + getClientsAPI
- Drawer and AddLead controlled locally
- ToastManager mounted locally

After (Context API)
- State lifted into contexts/SalesContext.tsx using useReducer
  - loading, clientList, drawerOpen, activeLead, addLeadOpen, currentClient, filters
- Actions exposed from context: refreshClients, openDrawerForLead, closeDrawer, toggleAddLead, toggleColumnCollapse, setSelectedPlan, setSelectedLeadQuality, setSearchQuery, resetFilters
- Component consumes via useSales()
- ToastManager mounted once in components/Providers.tsx and wrapped in app/layout.tsx

Why this is better
- Single source of truth for Sales page shared state
- Easier to share future Sales state across additional components without prop drilling
- Cleaner Sales page file; UI-only state still remains close to components

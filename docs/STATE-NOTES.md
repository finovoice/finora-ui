Context Migration Notes

Overview
- Implemented Context API to manage shared state across the app.
- Focused on Sales and Clients features; kept UI-only state at component level.

Contexts Created (2 so far)
1) SalesContext (contexts/SalesContext.tsx)
   - State: loading, clientList, drawerOpen, activeLead, addLeadOpen, collapsedColumns, currentClient, selectedPlan, selectedLeadQuality, searchQuery
   - Actions: refreshClients, openDrawerForLead, closeDrawer, toggleAddLead, toggleColumnCollapse, setSelectedPlan, setSelectedLeadQuality, setSearchQuery, resetFilters
   - Used in: app/sales/page.tsx + downstream components via props

2) ClientsContext (contexts/ClientsContext.tsx)
   - State: loading, clients, activeClient, drawerOpen
   - Actions: refreshClients, openActionsDrawer, closeDrawer
   - Intended for: app/clients/page.tsx (not refactored yet; local UI state remains for now)

Local vs Global State
- Kept local in components (examples):
  - components/sales/lead-card.tsx: isTruncated
  - components/sales/lead-drawer.tsx: tab, stage select open flags, risk profile form fields, text inputs, etc. These are UI/ephemeral and specific to drawer.
- Moved to context:
  - Sales list, filters (plan, lead quality, search), selection of active lead, drawer open flags, add lead modal flag, and refresh logic.

App Providers
- Added components/Providers.tsx to compose providers and mount ToastManager globally.
- Wrapped the app in Providers via app/layout.tsx.

Next Candidate Contexts (suggested if/when needed)
- AuthContext: current user, sign-in/out, token (not present yet in codebase).
- UIContext: theme, sidebar collapsed, layout preferences.
- NotificationsContext: we currently have a singleton ToastManager; can be formalized if requirements grow.
- TradesContext: advisory/trades pages if they share list/filters.

Verification
- Sales page refactored to use SalesContext; app builds should reflect provider usage.
- ToastManager is now mounted once at root; individual pages need not render it.

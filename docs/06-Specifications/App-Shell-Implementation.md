# App Shell Implementation Specification

> Status: Ready for Development
> Version: 1.0
> Priority: High

---

# Objective

Replace the current page-by-page navigation approach with a shared application shell that provides a consistent layout across all authenticated pages.

---

# Current Problems

- Each page renders its own navigation.
- Navigation does not scale as new modules are added.
- Layout is inconsistent between pages.
- Visual hierarchy is weak.
- UI feels like separate pages instead of one application.

---

# Target Layout

```
+------------------------------------------------------+
|                    Top Navigation                    |
+-----------+------------------------------------------+
|           |                                          |
|           |                                          |
| Sidebar   |            Page Content                  |
|           |                                          |
|           |                                          |
+-----------+------------------------------------------+
```

---

# New Layout Structure

Create reusable layout components.

Suggested structure:

src/

components/

layout/

- AppLayout.jsx
- Sidebar.jsx
- TopBar.jsx
- PageContainer.jsx

---

# Sidebar

The sidebar should contain grouped navigation.

Overview

- Dashboard

Operations

- Inventory
- Production
- Orders
- Deliveries

Management

- Customers
- Employees

Business

- Reports
- Expenses

System

- Settings
- Logout

---

# Top Bar

The top bar should contain:

- Current page title
- Optional search
- Logged-in user
- Notification placeholder

Keep it clean and minimal.

---

# Page Content

Every page should render inside PageContainer.

The page should no longer import its own Navbar.

---

# Design Goals

- Consistent spacing
- Consistent page width
- Consistent headers
- Reusable layout
- Desktop-first
- Easy future mobile support

---

# Acceptance Criteria

- One shared AppLayout.
- One Sidebar.
- One TopBar.
- Existing pages continue working.
- Navigation remains functional.
- Layout is reusable for future pages.
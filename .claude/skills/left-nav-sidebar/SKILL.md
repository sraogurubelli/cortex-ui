---
name: left-nav-sidebar
description: Use when building the left navigation or app shell in cortex-ui — Sidebar structure, nav items, collapse/rail, and main content area. For WebChatUI Left Nav pillar.
---

# Left Nav / Sidebar (Cortex UI)

Use this skill when implementing the **Left Nav** pillar of the WebChatUI framework: app shell, sidebar, and main content area.

## Structure

- **Sidebar.Provider** – Wraps the whole shell (sidebar + main).
- **Sidebar.Root** – Contains the sidebar column (nav content).
- **Sidebar.Inset** – Main content area next to the sidebar.
- **Sidebar.Header** – Logo and optional scope selector.
- **Sidebar.Content** – Nav groups and items.
- **Sidebar.Footer** – Optional usage or secondary actions.
- **Sidebar.Rail** – Optional collapsed/rail mode.
- **Sidebar.Item** – Single nav entry (title, icon, to, active, onClick).

Import these from the project’s design system (e.g. `@harnessio/ui/components`). Exact names may vary; verify in the package.

## Typical Shell

```tsx
<Sidebar.Provider className="bg-cn-0">
  <Sidebar.Root>
    <SidebarNav />   {/* Your nav: Header + Content + optional Footer + Rail */}
  </Sidebar.Root>
  <Sidebar.Inset className="flex flex-col min-h-screen">
    <main className="flex-1 p-cn-lg">
      <Outlet />     {/* React Router outlet or children */}
    </main>
  </Sidebar.Inset>
</Sidebar.Provider>
```

## Nav Items

- Use **Sidebar.Item** with `title`, `icon` (design system icon name), `to`, `active`, `onClick` (e.g. navigate via router).
- Compute `active` from route: exact match for home (`path === '/'`), `pathname.startsWith(path)` for others.
- Keep icon names from the design system’s icon map or type (e.g. `IconV2NamesType`).

## Optional Pieces

- **Scope selector** in Header (org/project switcher) – use design system `Dialog` + `Button` + list components; keep data and state in the app.
- **Footer** – e.g. “Free plan usage” and `Progress` components for quotas.
- **Collapse / Rail** – Use the sidebar’s built-in rail or collapse behavior if provided by the design system.

## Reference

- **WebChatUI**: Left Nav is one of the four pillars (see `webchatui-framework` skill).
- **Apps**: `apps/helloworld-app` implements a full sidebar with nav items, scope selector, and footer; reuse or simplify for new apps.

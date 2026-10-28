# Project Guidelines

## Architecture

- This is a React SPA built with Vite. Routes and global providers are wired in `src/App.jsx`; page-level UI belongs in `src/pages/`, reusable UI in `src/components/`.
- Keep Supabase access in `src/services/` and use the existing hooks and contexts to share application state.
- The skill map is built from Supabase nodes, parent links, and categories. Reuse the graph helpers in `src/flow/utils/` rather than duplicating graph or layout logic.
- Supabase migrations define the schema and Row Level Security policies. Make schema changes with a new migration; preserve public-read rules where intended, owner-scoped policies, and existing role-based write restrictions.

## Conventions

- Use the existing JavaScript/JSX, React hooks, and Tailwind CSS patterns. Keep user-facing copy in Italian.
- Reuse existing components and helpers before adding new abstractions. Keep the responsive mobile tree and desktop React Flow experience consistent when changing the map.
- Surface loading and operation errors through the existing UI patterns; do not silently ignore failed data operations.
- Never expose secrets in client code. Only the Supabase URL and anon/publishable key belong in `VITE_*` variables.

## Validation

- Run `pnpm lint` and `pnpm build` for application changes.
- There is currently no automated test suite or test script in `package.json`.
- Update `README.md` when routes, setup steps, scripts, or user-facing features change.

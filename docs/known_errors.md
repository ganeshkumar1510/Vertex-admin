# Known Issues & Errors Log

This document tracks errors faced during development to prevent recursion in future modules.

## 1. Node Execution Context in `run_command`
- **Issue**: Vite and NPM cannot natively execute or resolve within standard shell commands on Windows when dynamically mapped PATHs are required.
- **Resolution**: Created raw `.ps1` proxy execution scripts to explicitly inject the Node.js installation bin mapping directly into the script's immediate environment.

## 2. Lucide-React Icon Deprecations
- **Issue**: SyntaxError when utilizing legacy icon names (e.g., `Trello`).
- **Resolution**: Ensured alignment with current Lucide docs; e.g., mapping `Trello` to `Kanban`.

## 3. React Rendering / AST Parsing Errors
- **Issue**: Sequence `{{ }}` inside JSX text nodes.
- **Resolution**: Strictly enforce single-brace literal parsing `{logic}`.

## 4. Sidebar Overlap / Content Displacement
- **Issue**: Standard flexbox layout was causing the main content to slide underneath the sidebar.
- **Symptom**: Page content started at X=0 behind the sidebar.
- **Resolution**: Rebuilt `.app-layout` using `display: grid` with `grid-template-columns: 240px 1fr`.

## 5. Relative Pathing Errors in Nested Layouts
- **Issue**: Standard `../` paths failing when components moved into deep subdirectories (e.g., `layout/`).
- **Symptom**: Vite HMR crashes with `Failed to fetch dynamically imported module`.
- **Resolution**: Updated all relative imports to match double-nested structure (e.g., `../../utils/storage`).
## 6. Vite / PowerShell Execution Context
- **Issue**: Running Vite commands through standard `npx` or `npm` within a restricted PowerShell environment often fails to resolve child process binaries.
- **Resolution**: Use a `start.ps1` proxy script at the project root to explicitly map `node_modules` and system PATHs before execution.

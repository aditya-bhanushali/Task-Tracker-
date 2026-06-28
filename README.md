# Tracker — Task management SPA

A fully client-side task tracker built with React (hooks, no class components)
and Tailwind CSS. No backend required — all data persists to `localStorage`
so your tasks survive page reloads.

## Run it

```bash
npm install
npm run dev      # starts a dev server at http://localhost:5173
```

```bash
npm run build    # production build to /dist
npm run preview  # serve the production build locally
```

## Architecture

```
src/
  constants.js              priority/status enums + shared visual tokens
  utils/
    date.js                 date math (today, overdue, relative labels)
    validation.js           pure field-level + form-level validators
  hooks/
    useLocalStorageState.js generic localStorage-backed useState
    useTasks.js             all CRUD operations against the task list
    useToasts.js            toast queue (auto-dismiss + manual dismiss)
  components/
    Dashboard.jsx           main layout container; owns filter/sort/view state
    Header.jsx              top bar, mobile hamburger trigger, "New task"
    StatsBar.jsx            desktop inline summary cards
    StatsDrawer.jsx         mobile slide-out drawer with the same stats
    TaskFilters.jsx         search, priority/status pills, sort, view toggle
    TaskRow.jsx              list-view row: checkbox, priority cycle, edit/delete
    TaskCard.jsx            board-view card, draggable between columns
    KanbanBoard.jsx         three status columns with native HTML5 drag/drop
    TaskForm.jsx            slide-up panel, shared by Create and Edit
    EmptyState.jsx          "no tasks" / "no matches" states
    ToastContainer.jsx      stacked toast notifications with Undo
    PriorityBadge.jsx       reusable color-coded priority pill
    StatusBadge.jsx         reusable status pill
    icons.jsx               inline SVG icon set (no external icon library)
```

### Why this split

- **`useTasks`** is the only place that mutates the task array. Every
  component calls its functions (`addTask`, `updateTask`, `deleteTask`,
  `toggleStatus`, `setPriority`, `setStatus`, `restoreTask`) rather than
  touching state directly — swapping this for a real API later only means
  changing this one file.
- **`useLocalStorageState`** is a generic, reusable hook — it knows nothing
  about tasks specifically, just mirrors any JSON-serializable state to a
  given key, with safe parsing and cross-tab sync via the `storage` event.
- **Validation lives in `utils/validation.js`**, not inside `TaskForm`, so
  the rules (title 3–50 chars, description ≤300, due date can't be in the
  past, etc.) are easy to unit test independently of any component.

### UX details worth knowing

- **Delete is undo-able.** Deleting a task plays a quick fade-out, removes
  it from state, and shows a toast with a 5-second "Undo" action that
  re-inserts it at its original position.
- **Priority cycles on click** in the list view (High → Medium → Low) and
  via the dropdown in the edit form — no need to open the form just to
  bump priority.
- **Board view uses native HTML5 drag-and-drop** — no extra dependency —
  dragging a card to another column updates its status immediately.
- **Mobile**: the summary stats move from inline cards into a hamburger
  drawer, and the list/board collapse to a single column.

## Tech stack

- React 18 (functional components + hooks only)
- Tailwind CSS 3 (custom slate/indigo palette, see `tailwind.config.js`)
- Vite (dev server + build)
- Zero runtime dependencies beyond React itself

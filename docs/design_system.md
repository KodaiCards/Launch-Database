# Launch Fiber Services — Design System v1

> Every portal looks like ONE cohesive app. This document is the
> single source of truth for colors, typography, spacing, and
> the shared component library shipped in `/css/app-shell.css`
> + `/js/app-shell.js`.

---

## 1. Color Tokens

Add `<link rel="stylesheet" href="/css/app-shell.css">` to any portal and all tokens are available as CSS custom properties.

### Brand
| Token | Light value | Dark value | When to use |
|---|---|---|---|
| `--brand-primary` | `#1B5FA0` | `#4A90D9` | Primary actions, links, focus rings, active states |
| `--brand-primary-dark` | `#134880` | `#1B5FA0` | Hover state on primary, topbar background |
| `--brand-primary-light` | `#E8F0FB` | `#1E3A5C` | Sidebar hover/active bg, info badge bg |
| `--brand-accent` | `#0F7B3C` | same | Secondary accent (sparingly) |

Legacy aliases `--primary`, `--primary-dark`, `--primary-light` are preserved for inline styles that already exist in the portals.

### Surfaces
| Token | Light | Dark | When to use |
|---|---|---|---|
| `--surface-0` | `#ffffff` | `#111827` | Pure white card on canvas |
| `--surface-1` | `#F5F7FA` | `#1A1F26` | Page canvas / app background |
| `--surface-2` | `#FFFFFF` | `#1D2430` | Card / modal / panel background |
| `--surface-3` | `#F0F0F0` | `#1F2630` | Subtle bands, table alternating rows, form disabled |

### Text
| Token | Light | Dark | When to use |
|---|---|---|---|
| `--text-1` | `#212529` | `#E8EAED` | Primary body text |
| `--text-2` | `#495057` | `#C2C7CD` | De-emphasized but readable (labels, secondary info) |
| `--text-muted` | `#5A6470` | `#9BA1A8` | Supporting captions, hints, placeholder |

### Borders
| Token | Light | Dark | When to use |
|---|---|---|---|
| `--border-weak` | `#EEF1F5` | `#252A33` | Subtle dividers inside cards |
| `--border-strong` | `#DEE2E6` | `#2D3540` | Visible card edges, input borders |

### Semantic Status
Each status has three tokens: `--{status}` (bold fill/border), `--{status}-light` (tinted background), `--{status}-text` (text on the tinted bg).

| Status | Bold token | Example usage |
|---|---|---|
| Success | `--success: #28A745` | Active badge, save button confirmation |
| Warning | `--warning: #FFC107` | Overdue, needs review |
| Danger | `--danger: #DC3545` | Delete action, error state |
| Info | `--info: #1B5FA0` | Informational callout |

---

## 2. Typography

**Font stack:** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`

Inter is loaded from Google Fonts — add to every portal `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type scale
| Token | Size | Usage |
|---|---|---|
| `--text-xs` | 11px | Badges, timestamp footnotes |
| `--text-sm` | 12px | Table cell text, sidebar labels, form hints |
| `--text-base` | 14px | Body text (default) |
| `--text-md` | 15px | Card titles, emphasized body |
| `--text-lg` | 16px | Section headings, modal titles |
| `--text-xl` | 18px | H3-level headings |
| `--text-2xl` | 22px | H2-level headings, page titles |
| `--text-3xl` | 28px | H1-level, stat values |

---

## 3. Spacing Scale

All spacing tokens follow a 4px base grid:

```css
--space-1: 4px   --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 20px  --space-6: 24px  --space-8: 32px  --space-10: 40px
--space-12: 48px --space-16: 64px
```

---

## 4. Component Examples

### Card

```html
<div class="card">
  <div class="card-header">
    <span class="card-title">Projects</span>
    <button class="btn btn-primary btn-sm">
      <i class="fa-solid fa-plus"></i> New
    </button>
  </div>
  <div class="card-body">
    <!-- content -->
  </div>
  <div class="card-footer">
    <button class="btn btn-secondary btn-sm">Cancel</button>
    <button class="btn btn-primary btn-sm">Save</button>
  </div>
</div>
```

Elevated variant (shadow, no border): add `card-elevated` class.

### Buttons

```html
<!-- Primary — main call to action -->
<button class="btn btn-primary">Save Changes</button>

<!-- Secondary — alternate / cancel -->
<button class="btn btn-secondary">Cancel</button>

<!-- Danger — destructive action -->
<button class="btn btn-danger">Delete</button>

<!-- Ghost — low-emphasis in toolbars -->
<button class="btn btn-ghost">View All</button>

<!-- Link style -->
<button class="btn btn-link">Learn more</button>

<!-- With icon -->
<button class="btn btn-primary">
  <i class="fa-solid fa-save" aria-hidden="true"></i> Save
</button>

<!-- Sizes -->
<button class="btn btn-secondary btn-xs">Tiny</button>
<button class="btn btn-secondary btn-sm">Small</button>
<button class="btn btn-secondary">Default</button>
<button class="btn btn-secondary btn-lg">Large</button>

<!-- Icon-only (use aria-label) -->
<button class="btn btn-secondary btn-icon" aria-label="Settings">
  <i class="fa-solid fa-gear" aria-hidden="true"></i>
</button>

<!-- Disabled -->
<button class="btn btn-primary" disabled>Saving…</button>
```

### Form Input + Label + Error

```html
<div class="form-group">
  <label class="form-label form-label-required" for="client-name">
    Client Name
  </label>
  <input class="input" type="text" id="client-name" placeholder="e.g. PSC" />
  <span class="form-hint">As it appears on invoices</span>
</div>

<!-- With validation error -->
<div class="form-group">
  <label class="form-label" for="email">Email</label>
  <input class="input error" type="email" id="email" value="not-an-email" />
  <span class="form-error">
    <i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
    Enter a valid email address
  </span>
</div>

<!-- Two-column form grid -->
<div class="form-grid">
  <div class="form-group">
    <label class="form-label" for="first">First name</label>
    <input class="input" type="text" id="first" />
  </div>
  <div class="form-group">
    <label class="form-label" for="last">Last name</label>
    <input class="input" type="text" id="last" />
  </div>
  <div class="form-group span2">
    <label class="form-label" for="notes">Notes</label>
    <textarea class="input" id="notes" rows="3"></textarea>
  </div>
</div>
```

### Modal (Header / Body / Footer)

**Via AppShell.js (recommended):**

```js
AppShell.openModal(
  '<p>Are you sure you want to delete this project?</p>',
  {
    title: 'Delete Project',
    size:  'sm',
    footer: '<button class="btn btn-secondary" onclick="AppShell.closeModal()">Cancel</button>' +
            '<button class="btn btn-danger" onclick="confirmDelete()">Delete</button>',
    onClose: function () { console.log('closed'); }
  }
);
```

**Raw HTML (for portals that build modals manually):**

```html
<div class="modal-backdrop" id="my-modal" role="dialog" aria-modal="true" aria-labelledby="my-modal-title">
  <div class="modal-dialog modal-sm">
    <div class="modal-header">
      <h2 class="modal-title" id="my-modal-title">Delete Project</h2>
      <button class="modal-close" onclick="document.getElementById('my-modal').classList.remove('open')"
              aria-label="Close dialog">&times;</button>
    </div>
    <div class="modal-body">
      <p>This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary btn-sm">Cancel</button>
      <button class="btn btn-danger btn-sm">Delete</button>
    </div>
  </div>
</div>

<!-- Open it: -->
<script>document.getElementById('my-modal').classList.add('open');</script>
```

Modal sizes: `modal-sm` (440px), default (680px), `modal-lg` (860px), `modal-xl` (1100px), `modal-full` (98vw).

### Toast

```js
// Via AppShell (wraps LFS.toast if available):
AppShell.toast('Project saved.', 'success');
AppShell.toast('Could not save: network error.', 'error');
AppShell.toast('3 permits ready to invoice', 'info', {
  actionLabel: 'Review',
  onAction: function () { location.hash = '#billing'; }
});
AppShell.toast('Form incomplete.', 'warning', { durationMs: 6000 });
```

Kinds: `'success'` | `'error'` | `'warning'` | `'info'`

### Empty State

```html
<div class="empty-state">
  <div class="empty-state-icon">
    <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
  </div>
  <p class="empty-state-title">No projects yet</p>
  <p class="empty-state-desc">
    Create your first project to start tracking work.
  </p>
  <button class="btn btn-primary">
    <i class="fa-solid fa-plus" aria-hidden="true"></i> New Project
  </button>
</div>
```

### Loading Skeleton

```html
<!-- Card skeleton while loading -->
<div class="card">
  <div class="card-body">
    <div class="skeleton skeleton-heading"></div>
    <div class="skeleton skeleton-text wide"></div>
    <div class="skeleton skeleton-text medium"></div>
    <div class="skeleton skeleton-text narrow"></div>
  </div>
</div>

<!-- Via AppShell: replace element content with skeleton -->
<script>
  AppShell.showSkeleton(document.getElementById('project-list'), 5);
  loadProjects().then(function (data) {
    AppShell.hideSkeleton(document.getElementById('project-list'));
    renderProjects(data);
  });
</script>
```

---

## 5. How to Wrap a Portal in the App-Shell

### Step 1 — Add CSS + fonts to `<head>`

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Launch Fiber — [Portal Name]</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- Design system -->
  <link rel="stylesheet" href="/css/app-shell.css">
</head>
```

### Step 2 — Add `app-with-topbar` to body + skip-nav

```html
<body class="app-with-topbar">
  <a href="#main-content" class="skip-nav">Skip to main content</a>

  <!-- Your portal content -->
  <main id="main-content" class="app-content">
    ...
  </main>

  <!-- AppShell JS — load last -->
  <script src="/js/app-shell.js" defer></script>
</body>
```

### Step 3 — Init the topbar on DOMContentLoaded

```html
<script>
  document.addEventListener('DOMContentLoaded', function () {
    AppShell.init({
      title: 'Design',   // shown right of logo
      portalId: 'design'
    });
  });
</script>
```

Or with a sidebar:

```js
AppShell.init({
  title: 'Admin',
  portalId: 'admin',
  sidebar: [
    { section: 'Main', label: 'Dashboard', href: '#dashboard', icon: 'fa-solid fa-gauge', active: true },
    { label: 'Projects', href: '#projects', icon: 'fa-solid fa-folder', badge: 12 },
    { label: 'Billing',  href: '#billing',  icon: 'fa-solid fa-file-invoice-dollar' },
    { section: 'Settings', label: 'Settings', href: '#settings', icon: 'fa-solid fa-gear' },
  ]
});
```

### Step 4 — Replace existing toast/modal/button code

**Toasts** — swap `alert()` calls and ad-hoc status divs:
```js
// Before:
alert('Saved!');
// After:
AppShell.toast('Saved!', 'success');

// Before:
document.getElementById('error-msg').textContent = 'Failed: ' + err.message;
// After:
AppShell.toast('Failed: ' + err.message, 'error');
```

**Modals** — portals with hand-rolled modal HTML continue to work with the existing `.modal-overlay.open` pattern. The CSS tokens from `app-shell.css` style them consistently.

**Buttons** — migrate inline styles to `btn btn-primary` / `btn-secondary` / `btn-danger` classes as you touch each portal.

---

## 6. Theming (Dark Mode)

Dark mode is driven by `html[data-theme="dark"]`. The system:

1. On page load, `AppShell.initTheme()` (called automatically by `AppShell.init()`) reads `localStorage['lfs-theme']` → falls back to `prefers-color-scheme` media query.
2. The toggle button (rendered in the topbar) calls `AppShell.toggleTheme()`.
3. The new theme is written to `localStorage` AND synced to `/api/auth/me/theme` (best-effort; failure is silent).
4. On next login, `/api/auth/me` returns `user.theme` which overrides localStorage so the user's preference follows them across devices.

**Avoid hardcoded hex colors in portal styles.** Use design tokens — they automatically flip in dark mode:

```css
/* Bad — won't flip in dark mode */
.my-card { background: #ffffff; color: #212529; }

/* Good — flips automatically */
.my-card { background: var(--surface-2); color: var(--text-1); }
```

---

## 7. Responsive Guidance

The app-shell uses three breakpoints:

| Breakpoint | Width | Behavior |
|---|---|---|
| Desktop | > 1024px | Sidebar visible, 3-4 column grids |
| Tablet | 768px – 1024px | 2-column grids, topbar title visible |
| Mobile | < 768px | Sidebar slides in on toggle, single column, inputs 16px (prevent iOS zoom) |
| Small phone | < 480px | Reduced padding, compressed header |

Use responsive grid classes for dashboard layouts:

```html
<div class="responsive-grid">           <!-- auto-fill, min 280px -->
<div class="responsive-grid-2">         <!-- always 2 col on desktop, 1 on mobile -->
<div class="responsive-grid-3">         <!-- 3 → 2 → 1 -->
<div class="responsive-grid-4">         <!-- 4 → 2 → 1 -->
```

---

## 8. Accessibility

- **Focus rings:** `*:focus-visible` provides a 2px `--brand-primary` outline. Do not suppress with `outline: none` on interactive elements.
- **Skip nav:** add `<a href="#main-content" class="skip-nav">Skip to main content</a>` as first child of `<body>`, and `<main id="main-content">` wrapping primary content.
- **Modals:** `AppShell.openModal()` sets `role="dialog"`, `aria-modal="true"`, traps focus on open, and restores focus on close.
- **Toasts:** success/info/warning use `role="status" aria-live="polite"`; error uses `role="alert" aria-live="assertive"`.
- **Icons:** all Font Awesome icons should carry `aria-hidden="true"` when decorative. Provide `aria-label` on icon-only buttons.
- **Color contrast:** all token pairs meet WCAG AA (4.5:1 for normal text, 3:1 for large text) in both light and dark modes.
- **Form labels:** every `<input>`, `<select>`, `<textarea>` needs a matching `<label for="...">`. Use `.sr-only` if a visible label would be redundant.

---

## 9. AppShell.js API Reference

```js
// One-call init (theme + topbar + optional sidebar)
AppShell.init({ title: 'Admin', portalId: 'admin', sidebar: [...] });

// Mount topbar only
AppShell.mountTopbar({ title: 'Design', showBack: true, userMenu: true });

// Mount sidebar (call after mountTopbar)
AppShell.mountSidebar({
  items: [
    { section: 'Main' },
    { label: 'Dashboard', href: '#', icon: 'fa-solid fa-gauge', active: true },
    { label: 'Projects',  href: '#projects', icon: 'fa-solid fa-folder', badge: 3 },
  ],
  collapsible: true,
  collapsed: false
});

// Theme
AppShell.initTheme();    // reads localStorage + applies on load
AppShell.toggleTheme();  // flip + persist

// Toast
AppShell.toast(message, kind, opts);
// kind: 'success' | 'error' | 'warning' | 'info'
// opts: { durationMs, actionLabel, onAction }

// Modal
var ref = AppShell.openModal(contentHtmlOrElement, {
  title: 'Confirm',
  size: 'sm',     // sm | (default) | lg | xl | full
  footer: '<button class="btn btn-primary" onclick="AppShell.closeModal()">OK</button>',
  onClose: function() {},
  closeOnBackdrop: true
});
AppShell.closeModal();    // close most recent
AppShell.closeModal(ref.backdrop);  // close specific

// Skeleton
AppShell.showSkeleton(element, 4);   // replace content with 4 shimmer lines
AppShell.hideSkeleton(element);      // restore original content

// User
AppShell.getUser().then(function(user) { /* user.full_name, user.role, user.theme */ });
AppShell.signOut();  // POST /api/auth/logout → redirect to /login.html
```

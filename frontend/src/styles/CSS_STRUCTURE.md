# FarmConnect CSS Structure Guide

## Overview
This document outlines the clean, organized CSS structure for the FarmConnect application. All CSS files have been organized into a clear hierarchy with separate files for components and pages.

## Directory Structure

```
frontend/src/
├── styles/
│   ├── index.css              # Main entry point - imports all styles
│   ├── theme.css              # Design system variables & tokens
│   ├── global.css             # Global utilities & base styles
│   │
│   ├── components/
│   │   ├── button.css         # Button styles (.fc-btn, .btn, etc.)
│   │   ├── form.css           # Form inputs, labels, search (.fc-input, .field, etc.)
│   │   ├── card.css           # Cards, stat cards, tables (.fc-card, .fc-table, etc.)
│   │   ├── navbar.css         # Navigation bar styles
│   │   ├── sidebar.css        # Sidebar styles
│   │   └── utils.css          # Badges, modals, alerts, steps (.fc-badge, .fc-modal, etc.)
│   │
│   └── pages/
│       ├── auth.css           # Authentication pages (Login, Sign Up)
│       ├── home.css           # Home page styles
│       ├── marketplace.css    # Rice marketplace page
│       ├── ricemill.css       # Rice mill & price manager pages
│       ├── booking.css        # Booking page styles
│       └── admin.css          # Admin dashboard & management pages
│
└── index.js                   # Single import point: import "./styles/index.css"
```

## CSS File Contents

### Theme & Globals
- **theme.css**: Color tokens, typography, spacing, shadows, animations
- **global.css**: Utility classes, layout helpers, responsive grids
- **index.css**: Central file importing all styles

### Components
Each component CSS file contains styles for UI components:

#### button.css
- `.fc-btn` variants (primary, secondary, ghost, danger)
- `.fc-btn-sm`, `.fc-btn-lg`, `.fc-btn-xl`, `.fc-btn-full`
- Legacy `.btn`, `.btn.primary`, `.btn.danger` classes
- `.book-btn` styles

#### form.css
- `.fc-input`, `.fc-select`, `.fc-textarea` - Form controls
- `.fc-label`, `.fc-field` - Form structure
- `.fc-search` - Search input
- Legacy `.input`, `.field` classes
- `.checkbox-label`, `.form-options`

#### card.css
- `.fc-card` and variants - Card containers
- `.fc-stat` - Statistic cards with hover effects
- `.fc-table` - Table styling
- Legacy `.card`, `.stat-card`, `.service-card`, `.table`
- `.toolbar`, `.fc-toolbar` - Action toolbars

#### navbar.css
- `.navbar` - Main navigation bar
- `.navbar-item`, `.navbar-menu` - Navigation items
- `.admin-navbar` - Admin-specific navbar
- User avatar and dropdown styles

#### sidebar.css
- `.sidebar` - Main sidebar navigation
- `.admin-sidebar` - Admin sidebar
- `.sidebar-item`, `.sidebar-submenu` - Navigation structure
- `.main-with-sidebar` - Wrapper for fixed sidebar layout

#### utils.css
- `.fc-badge` with semantic variants (success, warning, danger, info)
- `.fc-modal` - Modal dialogs with overlay
- `.fc-alert` - Alert messages (error, success, warning)
- `.fc-progress` - Progress bars
- `.fc-steps` - Step indicators
- `.fc-skeleton` - Loading skeleton animation

### Pages
Each page has its own CSS file with page-specific styles:

#### auth.css
- `.auth-page` - Authentication page container
- `.auth-container` - Form container
- `.auth-header`, `.auth-form`, `.auth-footer`
- `.auth-divider`, `.auth-btn`

#### home.css
- `.home-page`, `.page-content` - Page wrapper
- `.page-header` - Page title and subtitle
- `.stats-grid`, `.actions-grid`, `.services-grid` - Grid layouts
- `.stat-card`, `.stat-value`, `.stat-label`
- `.sessions` - Session display styles

#### marketplace.css
- `.rice-marketplace` - Main container
- `.marketplace-filters` - Filter bar
- `.listings-grid` - Product grid
- `.rice-listing-card` - Individual listing card
- `.weight-options` - Weight selection
- `.buy-button` - Purchase button

#### ricemill.css
- `.ricemill-grid` - Rice mill listings
- `.ricemill-card` - Individual mill card
- `.price-manager-page` - Price manager container
- `.price-form`, `.price-list` - Price management UI
- `.form-grid`, `.form-group` - Form layouts

#### booking.css
- `.booking-page` - Page container
- `.booking-form` - Booking form
- `.booking-list`, `.booking-item` - Booking listings
- `.booking-status` variants (pending, confirmed, cancelled)
- `.booking-details-container` - Details display

#### admin.css
- `.admin-layout` - Admin page structure
- `.admin-grid` - Dashboard stat cards
- `.admin-table`, `.admin-table-container` - Admin tables
- `.admin-form`, `.admin-form-row` - Admin forms
- `.admin-modal` - Admin modals
- `.admin-btn-save`, `.admin-btn-delete` - Admin buttons

## Import Usage

### In index.js (ONLY place to import styles)
```javascript
import "./styles/index.css";
```

### In Component Files
NO CSS imports needed - all styles are global and available.

## CSS Naming Conventions

- **Global Classes**: `.fc-` prefix (FarmConnect)
  - `.fc-btn`, `.fc-input`, `.fc-card`, `.fc-modal`, `.fc-badge`
  
- **Legacy Classes**: Original names preserved for compatibility
  - `.btn`, `.input`, `.card`, `.table`, `.field`
  
- **Component-Specific**: No prefix
  - `.navbar`, `.sidebar`, `.coffee-listing-card`
  
- **Variants**: Use `-` separator
  - `.fc-btn-primary`, `.fc-btn-danger`, `.booking-status.confirmed`

## Color Tokens (from theme.css)

### Primary Colors
- `--g900` to `--g050` - Green scale

### Neutral Colors
- `--n900` to `--n050` - Neutral scale

### Semantic Colors
- `--success`, `--warning`, `--danger`, `--info`
- `--success-bg`, `--warning-bg`, `--danger-bg`, `--info-bg`

### Surfaces & Borders
- `--surface` - Main background (white)
- `--surface-raised` - Slightly raised surface
- `--border` - Default border color
- `--border-focus` - Focus state color

## Responsive Design

All pages use mobile-first responsive design with breakpoints:
- **1100px**: Large desktop to tablet transition
- **768px**: Tablet to mobile transition
- **700px**: Small mobile devices

## Files to Delete (Deprecated)

These files have been consolidated into the new structure:
- ✓ `/src/App.css` - Merged into components/
- ✓ `/src/App_1.css` - Merged into pages/marketplace.css
- ✓ `/src/App_CLEAN.js` - Duplicate file (safe to delete)
- ✓ `/src/theme.css` - Moved to styles/theme.css
- ✓ `/src/styles.css` - Merged into pages/auth.css and pages/home.css
- ✓ `/src/index.css` - Replaced with styles/index.css

## Adding New Styles

1. **New Page Component**: Add CSS to appropriate page file (e.g., `styles/pages/selling.css`)
2. **New UI Component**: Add CSS to matching component file (e.g., `styles/components/button.css`)
3. **New Global Utility**: Add to `styles/global.css`
4. **Update Index**: Import new file in `styles/index.css`

## Variable Usage Example

```css
.my-component {
  background: var(--g100);        /* Light green */
  color: var(--n900);             /* Dark neutral */
  padding: var(--radius-md);       /* 10px */
  border-radius: var(--radius-lg); /* 14px */
  box-shadow: var(--shadow-sm);   /* Small shadow */
  transition: all 0.15s;           /* Standard transition */
}
```

## Performance Notes

- ✓ Single CSS entry point reduces redundancy
- ✓ Organized structure makes maintenance easier
- ✓ Design tokens ensure consistency
- ✓ Component isolation prevents style conflicts
- ✓ All legacy classes preserved for backward compatibility

# CSS Usage Examples & Best Practices

## Quick Start

The entire CSS system is loaded from a single import point in `index.js`:

```javascript
import "./styles/index.css";
```

This loads **all** styles globally. No component-level CSS imports needed!

## Component Styling Examples

### Using Button Styles

```jsx
// Button component - no CSS import needed
import { useState } from 'react';

function MyComponent() {
  return (
    <>
      {/* Primary button */}
      <button className="fc-btn fc-btn-primary">Click Me</button>
      
      {/* Secondary button */}
      <button className="fc-btn fc-btn-secondary">Cancel</button>
      
      {/* Danger button */}
      <button className="fc-btn fc-btn-danger">Delete</button>
      
      {/* Different sizes */}
      <button className="fc-btn fc-btn-primary fc-btn-sm">Small</button>
      <button className="fc-btn fc-btn-primary fc-btn-lg">Large</button>
      <button className="fc-btn fc-btn-primary fc-btn-xl">Extra Large</button>
      
      {/* Full width */}
      <button className="fc-btn fc-btn-primary fc-btn-full">Full Width</button>
    </>
  );
}
```

### Using Form Styles

```jsx
function LoginForm() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Sign In</h1>
          <p>Welcome back to FarmConnect</p>
        </div>
        
        <form className="auth-form">
          <div className="fc-field">
            <label className="fc-label">Email</label>
            <input 
              type="email" 
              className="fc-input" 
              placeholder="Enter your email"
            />
          </div>
          
          <div className="fc-field">
            <label className="fc-label">Password</label>
            <input 
              type="password" 
              className="fc-input" 
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" className="fc-btn fc-btn-primary fc-btn-full">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
```

### Using Card Styles

```jsx
function RiceListingCard({ rice }) {
  return (
    <div className="rice-listing-card">
      <div className="listing-image">
        <img src={rice.image} alt={rice.type} />
        <div className="mill-badge">
          <img src={rice.millLogo} alt="Mill" className="mill-logo" />
          <span>{rice.millName}</span>
        </div>
      </div>
      
      <div className="listing-body">
        <div className="listing-header">
          <h3 className="rice-type">{rice.type}</h3>
          <p className="mill-location">📍 {rice.location}</p>
        </div>
        
        <p className="rice-description">{rice.description}</p>
        
        <div className="weight-options">
          <h4>Select Weight</h4>
          <div className="weight-buttons">
            {rice.weights.map(weight => (
              <div key={weight.id} className="weight-option">
                <div className="weight-label">{weight.kg}kg</div>
                <div className="weight-price">Rs.{weight.price}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button className="buy-button">Buy Now</button>
      </div>
    </div>
  );
}
```

### Using Table Styles

```jsx
function BookingsList() {
  return (
    <div className="fc-table-wrap">
      <table className="fc-table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Vehicle</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#BOOK001</td>
            <td>Tractor</td>
            <td>2024-04-25</td>
            <td>
              <span className="fc-badge fc-badge-success">Confirmed</span>
            </td>
            <td>
              <button className="fc-btn fc-btn-sm fc-btn-secondary">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

### Using Modal Styles

```jsx
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fc-modal-overlay">
      <div className="fc-modal">
        <div className="fc-modal-header">
          <div>
            <div className="fc-modal-title">{title}</div>
            <div className="fc-modal-subtitle">{message}</div>
          </div>
          <button className="fc-modal-close" onClick={onCancel}>✕</button>
        </div>
        
        <div className="fc-modal-footer">
          <button className="fc-btn fc-btn-ghost" onClick={onCancel}>Cancel</button>
          <button className="fc-btn fc-btn-primary" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}
```

### Using Alert Styles

```jsx
function AlertExample() {
  return (
    <>
      <div className="fc-alert fc-alert-success">
        ✓ Successfully saved changes!
      </div>
      
      <div className="fc-alert fc-alert-warning">
        ⚠ Please review your information
      </div>
      
      <div className="fc-alert fc-alert-error">
        ✕ An error occurred. Please try again.
      </div>
    </>
  );
}
```

### Using Badge Styles

```jsx
function BookingStatus({ status }) {
  const badgeClass = {
    active: 'fc-badge-success',
    pending: 'fc-badge-warning',
    cancelled: 'fc-badge-danger',
    info: 'fc-badge-info'
  }[status];
  
  return <span className={`fc-badge ${badgeClass}`}>{status}</span>;
}
```

## Page Layout Examples

### Admin Dashboard Layout

```jsx
function AdminDashboard() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      
      <div className="admin-main">
        <AdminNavbar />
        
        <div className="admin-container">
          {/* Header */}
          <div className="fc-page-header">
            <div>
              <h1 className="fc-page-title">Dashboard</h1>
              <p className="fc-page-subtitle">Welcome back, Admin</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="admin-grid">
            <div className="admin-card">
              <div className="admin-card-icon">📊</div>
              <div className="admin-card-content">
                <div className="admin-card-label">Total Bookings</div>
                <div className="admin-card-value">1,234</div>
                <div className="admin-card-trend">↑ 12% from last month</div>
              </div>
            </div>
            {/* More cards... */}
          </div>
          
          {/* Table */}
          <div className="admin-table-container">
            <table className="admin-table">
              {/* Table content */}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Home Page Layout

```jsx
function Home() {
  return (
    <div className="home-page">
      <NavBar />
      
      <div className="page-content">
        {/* Header */}
        <div className="page-header">
          <h1>Welcome to FarmConnect</h1>
          <p>Your trusted agricultural marketplace</p>
        </div>
        
        {/* Stats */}
        <div className="stats-grid">
          <div className="fc-stat">
            <div className="fc-stat-icon">🚜</div>
            <div>
              <div className="fc-stat-value">500+</div>
              <div className="fc-stat-label">Equipment Available</div>
            </div>
          </div>
          {/* More stats... */}
        </div>
        
        {/* Actions */}
        <div className="actions-grid">
          {/* Action cards */}
        </div>
      </div>
    </div>
  );
}
```

## Design System Variables

All colors, spacing, and shadows are defined as CSS variables in `styles/theme.css`:

```css
/* Colors */
var(--g700)        /* Primary green */
var(--n900)        /* Dark text */
var(--success)     /* Green semantic */
var(--danger)      /* Red semantic */

/* Spacing */
var(--radius-md)   /* 10px borderRadius */
var(--radius-lg)   /* 14px borderRadius */

/* Shadows */
var(--shadow-sm)   /* Subtle shadow */
var(--shadow-md)   /* Medium shadow */
var(--shadow-lg)   /* Large shadow */

/* Typography */
var(--font-body)   /* DM Sans */
var(--font-display)/* Fraunces */
```

## Common Patterns

### Responsive Grid
```jsx
<div className="fc-grid fc-grid-3">
  {/* Items automatically responsive */}
</div>
```

### Flex with Gap
```jsx
<div className="flex gap-16">
  {/* Items with 16px gap */}
</div>
```

### Page Container
```jsx
<div className="container">
  {/* Max-width 1200px, centered */}
</div>
```

## Important Notes

1. **No component-level CSS imports** - Everything is global
2. **Use design tokens** - Don't hardcode colors/spacing
3. **Follow naming conventions** - `.fc-` for components, page first for pages
4. **Keep responsive in mind** - All layouts use mobile-first design
5. **Legacy classes work too** - `.btn`, `.input`, `.card` still available

## Performance Tips

- ✓ Single CSS file = faster load times
- ✓ Design tokens = consistent styling
- ✓ BEM-like structure = easy to understand
- ✓ Utility classes = reusable code
- ✓ Organized files = easy to maintain

---

For complete CSS structure documentation, see `CSS_STRUCTURE.md`

# Bootstrap 5 Integration Guide

## 🎯 Overview

This portfolio is built with **Bootstrap 5.3.0** CSS framework integrated alongside custom animations and styling. Bootstrap provides the responsive grid system and components, while custom CSS adds the unique design elements.

---

## 📦 What's Included

### Bootstrap CDN Links (in `index.html`)

```html
<!-- Bootstrap CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap JavaScript Bundle (includes Popper.js) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### No Build Process Needed ✅
- Bootstrap is served via CDN
- No npm installation required
- Works immediately in all browsers
- Perfect for static site hosting

---

## 🎨 Bootstrap Components Used

### Grid System

The portfolio uses Bootstrap's responsive grid:

```html
<div class="container">
  <div class="row">
    <div class="col-12">Full width</div>
  </div>
  <div class="row">
    <div class="col-md-6">Half on medium screens</div>
    <div class="col-md-6">Half on medium screens</div>
  </div>
</div>
```

**Breakpoints Used:**
- `xs` - Extra small (< 576px)
- `sm` - Small (≥ 576px)
- `md` - Medium (≥ 768px)
- `lg` - Large (≥ 992px)
- `xl` - Extra large (≥ 1200px)

### Utility Classes

Bootstrap utility classes used throughout:

```css
/* Flexbox Utilities */
.d-flex              /* Display flex */
.gap-3               /* Gap between items */
.justify-content-end /* Align right */
.align-items-center  /* Vertical center */

/* Spacing Utilities */
.mt-5    /* Margin top */
.mb-3    /* Margin bottom */
.p-4     /* Padding */
.px-5    /* Padding horizontal */

/* Text Utilities */
.text-center         /* Center text */
.text-end            /* Right align text */
.text-muted          /* Muted gray text */

/* Display Utilities */
.d-none              /* Hide element */
.d-md-block          /* Show on medium+ screens */
```

### Form Components

Bootstrap form styling:

```html
<form>
  <div class="form-group">
    <label for="input" class="form-label">Label</label>
    <input type="text" class="form-input" id="input">
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

---

## 🔧 Customization with Bootstrap

### Change Container Width

Bootstrap containers have default widths per breakpoint:

```css
.container {
    max-width: 1140px;  /* Default for lg breakpoint */
}

.container-fluid {
    width: 100%;        /* Full width */
}
```

### Add Bootstrap Components

To add new Bootstrap components, check the [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/):

**Example - Add a Card:**

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Card Title</h5>
    <p class="card-text">Card content</p>
    <a href="#" class="btn btn-primary">Link</a>
  </div>
</div>
```

### Override Bootstrap Styles

Custom CSS takes precedence. To override Bootstrap:

```css
/* Portfolio custom styles in styles.css */
.btn-submit {
    background: var(--primary-color);  /* Overrides Bootstrap */
    border-radius: 8px;                /* Custom border radius */
}
```

---

## 📱 Responsive Design with Bootstrap

### Mobile-First Approach

```html
<!-- Stacked on mobile, side-by-side on md+ screens -->
<div class="row">
  <div class="col-12 col-md-6">Content A</div>
  <div class="col-12 col-md-6">Content B</div>
</div>
```

### Hide/Show Elements

```html
<!-- Hidden on small screens, shown on md+ -->
<div class="d-none d-md-block">
  Desktop-only content
</div>

<!-- Shown on small screens, hidden on md+ -->
<div class="d-md-none">
  Mobile-only content
</div>
```

---

## 🚀 Performance Notes

- **CDN Delivery**: Fast global distribution
- **Bootstrap** Size: ~180 KB (gzipped)
- **No Build Time**: Instant development
- **Caching**: Browser caches CDN resources
- **Custom CSS**: Only 1000+ lines of additional styling

---

## 📚 Bootstrap Resources

### Official Documentation
- **Main Docs**: https://getbootstrap.com/docs/5.3/
- **Components**: https://getbootstrap.com/docs/5.3/components/
- **Utilities**: https://getbootstrap.com/docs/5.3/utilities/
- **Layout**: https://getbootstrap.com/docs/5.3/layout/

### Color System
```css
Primary Colors (Bootstrap defaults):
- Primary: #0d6efd
- Secondary: #6c757d
- Success: #198754
- Danger: #dc3545
- Warning: #ffc107
- Info: #0dcaf0

(Portfolio uses custom colors)
```

### Grid System Deep Dive
```css
12-column responsive grid:
- .row creates flexbox container
- .col-* classes define column spans
- Auto-layout with .col (equal width)
- .col-md-6 = 50% width on medium+ screens
```

---

## ✅ Browser Compatibility

Bootstrap 5 supports:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

**Note:** IE 11 is NOT supported

---

## 🔗 Integration with Custom JavaScript

The portfolio's JavaScript works alongside Bootstrap:

```javascript
// Custom Theme Manager
class ThemeManager {
    // Switches themes while maintaining Bootstrap functionality
    applyTheme(theme) {
        // Animations + Bootstrap responsive design
    }
}

// Form Handling
document.getElementById('contactForm').addEventListener('submit', (e) => {
    // Bootstrap form + custom validation
});
```

---

## 📦 Local Installation (Optional)

If you want to install Bootstrap locally via npm:

```bash
npm install bootstrap@5.3.0

# Then in your HTML:
<link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.min.css">
<script src="node_modules/bootstrap/dist/js/bootstrap.bundle.js"></script>
```

**Note:** CDN approach is better for this static portfolio!

---

## 🎯 Best Practices Applied

1. **Mobile-First**: Design for mobile, enhance for larger screens
2. **Semantic HTML**: Proper Bootstrap component structure
3. **CSS Variables**: Custom branding with Bootstrap utilities
4. **No Conflicts**: Custom CSS enhances rather than conflicts
5. **Accessibility**: Bootstrap's accessibility features maintained
6. **Performance**: CDN caching + minimal overhead

---

## 📝 Summary

| Aspect | Details |
|--------|---------|
| **Framework** | Bootstrap 5.3.0 |
| **Delivery** | CDN (jsDelivr) |
| **Build Required** | ❌ No |
| **npm Required** | ❌ No |
| **Size** | ~180 KB (gzipped) |
| **Breakpoints** | 6 responsive sizes |
| **Customization** | Full with CSS variables |
| **Deployment** | Works on any static host |
| **Browser Support** | All modern browsers |

---

## 🚀 Next Steps

1. ✅ Understand Bootstrap Grid System
2. ✅ Review Bootstrap Components
3. ✅ Customize with CSS variables
4. ✅ Deploy to GitHub Pages/Netlify
5. ✅ Share your portfolio!

---

**Made with Bootstrap 5 and ❤️**

Last Updated: April 2, 2026
Version: 1.0.0

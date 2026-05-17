# Rov Japheth G. Oracion - IT Professional Portfolio 🚀

A modern, responsive, and interactive professional portfolio website built with **Bootstrap 5** CSS framework, featuring animated backgrounds, multiple theme modes, and smooth scrolling navigation.

![Portfolio Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Framework](https://img.shields.io/badge/framework-Bootstrap%205-blueviolet)

---

## 📋 Quick Links

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Framework Integration](#framework-integration)
- [Setup Instructions](#setup-instructions)
- [Customization](#customization)
- [Deployment](#deployment)
- [Browser Support](#browser-support)

---

## 🎯 Overview

This is a professional portfolio website showcasing:
- **IT Instructor** at Bukidnon State University
- **Software Developer** with freelance experience
- **AI & ML Enthusiast** pursuing a Master's in IT
- Based in Philippines

The portfolio features animated backgrounds with theme modes and is built using **Bootstrap 5** CSS framework for modern, responsive design.

---

## ✨ Features

### ✅ Core Features

1. **Responsive Design with Bootstrap 5**
   - Mobile-first approach
   - Works seamlessly on all devices
   - Bootstrap Grid system for layouts
   - Responsive utilities and components

2. **Theme System** (Dark/Light/Hybrid)
   - Dark Mode: Matrix-style falling code animation
   - Light Mode: Floating code symbols
   - Hybrid Mode: Mixed animations (DEFAULT)
   - Persistent selection using localStorage

3. **Complete Portfolio Sections**
   - Hero section with professional photo
   - About me with skills grid
   - Education timeline
   - Work experience cards
   - Featured projects gallery
   - Technical skills badges
   - Quick contact links with platform-specific colors
   - Professional contact form

4. **Interactive Elements**
   - Smooth scrolling navigation
   - Animated hover effects on cards
   - Canvas-based animated backgrounds
   - Platform color-coded social buttons
   - Form validation

---

## 🛠️ Technology Stack

### CSS Framework
- **Bootstrap 5.3.0** ⭐ (Main Framework)
  - Responsive Grid System
  - Utility Classes
  - Component Styling
  - Flexbox Layouts
  - Responsive Breakpoints

### Icons & Typography
- **Font Awesome 6.4.0** - Icon library
- **Segoe UI, Tahoma** - System fonts

### Core Technologies
- **HTML5** - Semantic markup
- **CSS3** - Custom styling with CSS Variables
- **Vanilla JavaScript** - No dependencies
- **Canvas API** - Animated backgrounds

### CDN-Delivered (No Build Needed)
```
✅ Bootstrap CSS via jsdelivr
✅ Bootstrap JavaScript Bundle (includes Popper.js)
✅ Font Awesome Icons via CDN
```

---

## 🎨 Framework Integration

### How Bootstrap 5 is Used

#### 1. **Grid System**
Bootstrap's powerful grid system for responsive layouts:
```html
<div class="container">
  <div class="row">
    <div class="col-md-6">LEFT COLUMN</div>
    <div class="col-md-6">RIGHT COLUMN</div>
  </div>
</div>
```

#### 2. **Utility Classes**
- `.d-flex` - Flexbox layouts
- `.gap-*` - Spacing utilities
- `.text-center`, `.text-end` - Text alignment
- `.mt-5`, `.mb-3` - Margin utilities
- `.p-4` - Padding utilities

#### 3. **Responsive Utilities**
- `.d-none .d-md-block` - Show/hide on different screens
- `.container-fluid` - Full-width containers
- Breakpoints: xs, sm, md, lg, xl, xxl

#### 4. **Components**
- Form inputs and styling
- Button utilities
- Card layouts
- Container system

#### 5. **Typography**
- Heading hierarchy (`<h1>` to `<h6>`)
- Font sizing utilities
- Text color and styling

### Custom Enhancements

The portfolio adds custom styling on top of Bootstrap:

```css
/* Custom CSS Variables */
:root {
    --primary-color: #1e88e5;      /* Bootstrap Primary */
    --accent-color: #ff6b35;       /* Custom Orange */
}

/* Bootstrap utilities extended with Canvas animation backdrops */
.section {
    background: rgba(var(--bg-dark), 0.7);  /* Semi-transparent over animated canvas */
    transition: all 0.3s ease;
}

/* Bootstrap button enhanced */
.contact-card {
    background: linear-gradient(...);  /* Enhanced with gradients */
    transition: all 0.4s cubic-bezier(...);  /* Smooth animations */
}
```

### CDN Links Used

```html
<!-- Bootstrap CSS Framework -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap JavaScript (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Font Awesome Icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

---

## 📁 Project Structure

**4. Update Work Experience**
Replace job titles, companies, dates, and responsibilities with your own. Add or remove experience cards as needed.

**5. Showcase Your Projects**
Update the project cards with:
- Project titles
- Descriptions
- Technologies used (tags)
- Links to GitHub repositories
- Project icons (Font Awesome icons)

**6. List Your Skills**
Update the technical skills section with:
- Programming languages
- Frameworks and libraries
- Tools and platforms
- Databases and other technologies

**7. Add Contact Information**
Update links in the contact section:
- Email address: `mailto:your-email@example.com`
- Phone: `tel:+1234567890`
- GitHub: `https://github.com/yourusername`
- LinkedIn: `https://linkedin.com/in/yourprofile`
- Twitter: `https://twitter.com/yourhandle`

### Color Customization

Edit the CSS variables in `styles.css` to customize colors:

```css
:root {
    --primary-color: #6366f1;      /* Main accent color */
    --secondary-color: #8b5cf6;    /* Secondary accent */
    --accent-color: #ec4899;       /* Highlight color */
    --bg-dark: #0f172a;            /* Dark background */
    --bg-light: #ffffff;           /* Light background */
    --text-dark: #f8f8f8;          /* Dark mode text */
    --text-light: #1e293b;         /* Light mode text */
}
```

## Animations

### Dark Mode - Comet Animation
- Twinkling stars background
- Colorful animated comets with trailing effects
- Glow effects and smooth movement
- Auto-bouncing off edges

### Light Mode - Floating Particles
- Colorful floating particles with wobbling motion
- Animated falling leaves
- Soft glowing effects
- Smooth continuous animation

Both animations are responsive and adjust to window size.

## Browser Compatibility

- Chrome/Edge (Chromium-based) - Full support
- Firefox - Full support
- Safari - Full support
- Mobile browsers - Full support

## Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 769px to 1199px
- **Mobile**: 768px and below

## Deployment

You can deploy this portfolio to:

1. **GitHub Pages** - Free hosting
   - Push files to a GitHub repository
   - Enable GitHub Pages in settings
   - Your portfolio will be live at `username.github.io/repository-name`

2. **Netlify** - Simple drag & drop deployment
   - Sign up at netlify.com
   - Drag your project folder
   - Get a live URL instantly

3. **Vercel** - Optimized for web apps
   - Connect your GitHub repository
   - Auto-deploys on push
   - Global CDN support

4. **Traditional Hosting** - Upload via FTP
   - Upload all files to your web host
   - Access via your domain

## Tips for Best Results

1. **Add Profile Image** - Update the project icon areas with your own images
2. **Optimize Images** - Compress images for faster loading
3. **SEO Optimization** - Update meta tags and add keywords
4. **Mobile Testing** - Test on various devices before deployment
5. **Regular Updates** - Keep your portfolio updated with recent projects
6. **Performance** - Monitor load times and optimize as needed

## Customizing Animations

### To adjust comet speed in dark mode:
In `script.js`, find the CometAnimation class and modify:
```javascript
vx: Math.random() * 2 - 1,  // Increase multiplier for faster movement
vy: Math.random() * 2 - 1,
```

### To adjust particle count:
Find the `createParticles()` method and modify:
```javascript
const particleCount = 50;  // Increase for more particles
```

## Font Awesome Icons

This portfolio uses Font Awesome 6.4.0 for icons. To change icons:
- Find icon references in HTML (e.g., `<i class="fas fa-laptop-code"></i>`)
- Browse available icons at [fontawesome.com](https://fontawesome.com)
- Replace the class name with desired icon

## Performance Tips

1. Use modern browsers for best performance
2. Compress images before adding to portfolio
3. Minimize CSS/JS if needed for production
4. Test on slow internet connections
5. Monitor lighthouse scores

## Troubleshooting

**Theme not saving?**
- Check if localStorage is enabled in browser
- Clear browser cache and try again

**Animations not smooth?**
- Update your browser to latest version
- Try a different browser
- Check hardware acceleration is enabled

**Links not working?**
- Verify URLs are correct
- Ensure links start with `https://`
- Test in incognito mode

## Future Enhancements

Consider adding:
- Blog section for tech articles
- Dark mode image variations
- PDF resume download
- Email contact form
- Analytics tracking
- CMS integration

## Credits

- Built with HTML, CSS, and Vanilla JavaScript
- Icons by [Font Awesome](https://fontawesome.com)
- Animations using Canvas API

## License

Free to use for personal and commercial projects.

## Support

For questions or issues:
1. Check this README first
2. Review the source code comments
3. Test in a different browser
4. Check browser console for errors

---

**Last Updated**: April 2024
**Version**: 1.0

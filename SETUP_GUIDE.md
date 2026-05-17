# Portfolio Setup Guide

## Recent Updates

### ✨ New Features:
1. **Professional Photo Section** - Added to hero section showing your profile photo
2. **Masculine Color Scheme** - Replaced pink/purple with professional blue and orange
3. **Programming-Themed Animations** - Matrix code rain (dark mode) and floating code symbols (light mode)
4. **Enhanced UI/UX** - Cleaner, more professional design

## Adding Your Photo

### Step 1: Prepare Your Photo
- Ensure you have a photo file named `photo.jpg`
- Recommended dimensions: 300x400 pixels (or any 3:4 aspect ratio)
- File format: JPG or PNG

### Step 2: Place Photo in Assets Folder
1. Copy your `photo.jpg` file
2. Paste it into the `assets` folder located at: `c:\Users\Danielle Blanca\Videos\web_portfolio\assets\`
3. The file should be at: `assets/photo.jpg`

### Step 3: Verify
- Open `index.html` in your browser
- You should see your photo displayed next to your name in the hero section
- The photo has a professional blue border frame

## Color Scheme

### New Professional Colors:
- **Primary Blue**: #1e88e5 (Professional sky blue)
- **Secondary Blue**: #0066cc (Deep blue)
- **Accent Orange**: #ff6b35 (Professional rust/orange)
- **Dark Background**: #0a0e27 (Very dark blue-gray)
- **Light Background**: #f5f5f5 (Clean light gray)

### Why This Scheme:
✓ Professional and masculine
✓ Tech industry standard colors
✓ Better contrast for readability
✓ More suitable for IT professional
✓ Works well in both dark and light modes

## Background Animations

### Dark Mode - Code Matrix Rain
- Inspired by "The Matrix" style animation
- Shows falling code characters and binary
- Cyan and blue color scheme
- Creates immersive tech atmosphere

### Light Mode - Floating Code Symbols
- Floating programming symbols: `< > / { } [ ] ; : = + - *`
- Rotates and pulses gently
- Blue, orange, and green accents
- Clean, professional appearance

## File Structure
```
web_portfolio/
├── index.html              (Main HTML file)
├── styles.css              (Styling with new colors & photo styles)
├── script.js               (JavaScript with new animations)
├── README.md               (Portfolio documentation)
├── SETUP_GUIDE.md          (This file)
└── assets/
    └── photo.jpg           (Your profile photo - ADD THIS)
```

## Testing the Portfolio

1. **Dark Mode (Default)**:
   - Open `index.html` in browser
   - You'll see the Code Matrix rain background
   - All sections have the new blue theme

2. **Light Mode**:
   - Click the moon icon in top-right corner
   - Background changes to floating code symbols
   - All colors adjust for light mode

3. **Responsive Design**:
   - Test on mobile (resize browser)
   - Photo and content should stack nicely
   - All buttons and forms should work smoothly

## Customization Tips

### Change Photo Size
Edit `styles.css` and find `.photo-frame`:
```css
.photo-frame {
    width: 300px;      /* Change width */
    height: 400px;     /* Change height */
}
```

### Adjust Animation Speed (Dark Mode)
Edit `script.js` and find `CodeMatrixAnimation`:
```javascript
speed: Math.random() * 2 + 0.5,    /* Increase multiplier for faster speed */
```

### Adjust Animation Speed (Light Mode)
Edit `script.js` and find `CodeParticlesAnimation`:
```javascript
vy: (Math.random() - 0.5) * 1,    /* Increase multiplier for more movement */
```

## Browser Compatibility

✓ Chrome/Edge (Recommended)
✓ Firefox
✓ Safari
✓ Mobile Browsers

## Need Help?

- Ensure `assets/photo.jpg` exists before opening in browser
- Clear browser cache if animations don't update
- Make sure your photo is in JPG or PNG format
- Check console (F12) for any error messages

## Next Steps

1. ✓ Add photo.jpg to assets folder
2. ✓ Open index.html in browser
3. ✓ Test theme toggle
4. ✓ Test responsive design
5. Ready to deploy!

---
**Last Updated**: April 2, 2026

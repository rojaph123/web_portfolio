# 🚀 Deployment Guide - Get Your Portfolio Online

## Option 1: GitHub Pages (EASIEST & FREE) ✅

### Steps:

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com/signup
   - Sign up with your email

2. **Create a New Repository**
   - Click "New Repository"
   - Name it: `portfolio` or `rojaph-portfolio`
   - Click "Create Repository"

3. **Upload Your Files**
   - Clone the repo locally, or use GitHub Desktop
   - Copy all your files (index.html, styles.css, script.js, assets/) into the repo
   - Commit and Push

4. **Enable GitHub Pages**
   - Go to Repository Settings → Pages
   - Select "main" branch as source
   - Save
   - Your site will be live at: `https://YOUR-USERNAME.github.io/portfolio`

---

## Option 2: Netlify (FREE with Great Features) ⭐

### Steps:

1. **Go to Netlify**
   - Visit https://www.netlify.com
   - Click "Sign up" (use GitHub login for easier setup)

2. **Deploy Your Site**
   - Method A: Drag & Drop
     - Go to https://app.netlify.com/drop
     - Drag your project folder here
     - Your site is instantly live!
   
   - Method B: Connect GitHub
     - Click "New site from Git"
     - Connect your GitHub repo
     - Site auto-deploys on every push

3. **Your Site URL**
   - Free URL format: `https://[random-name].netlify.app`
   - You can customize it or add your own domain

---

## Option 3: Vercel (FREE, Best for Modern Projects) 🎯

### Steps:

1. **Go to Vercel**
   - Visit https://vercel.com/signup
   - Sign up with GitHub

2. **Deploy Project**
   - Upload your project folder
   - Select as static site
   - Vercel auto-deploys

3. **Your Site URL**
   - Format: `https://[project-name].vercel.app`
   - Custom domains available

---

## 📌 RECOMMENDED: GitHub Pages + Custom Domain

### Why?
- ✅ Completely free
- ✅ GitHub integration
- ✅ Professional URL option
- ✅ Version control built-in

### Setup:
```bash
# 1. Install Git if needed: https://git-scm.com

# 2. Navigate to your project folder
cd "c:\Users\Danielle Blanca\Videos\web_portfolio"

# 3. Initialize Git repo
git init

# 4. Add all files
git add .

# 5. Make first commit
git commit -m "Initial portfolio commit"

# 6. Go to GitHub, create repo named "portfolio"

# 7. Add remote and push
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main

# 8. Go to repo settings → Pages → Select main branch → Save
```

Your portfolio will be live at: `https://YOUR-USERNAME.github.io/portfolio`

---

## 🎓 Quick Comparison

| Feature | GitHub Pages | Netlify | Vercel |
|---------|-------------|---------|--------|
| Cost | FREE | FREE | FREE |
| Setup Time | 5 min | 3 min | 3 min |
| Custom Domain | Yes | Yes | Yes |
| Git Integration | Yes | Yes | Yes |
| Easy Updates | Git push | Git push/Auto | Git push/Auto |
| Ideal For | Static sites | Modern projects | Projects & APIs |

---

## 📝 After Deployment:

1. **Share Your Portfolio URL**
   - Add to resume
   - LinkedIn profile
   - Email signature
   - Social media

2. **Update Portfolio URL in Meta Tags**
   - Open `index.html`
   - Add: `<meta property="og:url" content="YOUR-DEPLOYED-URL">`

3. **Monitor Performance**
   - GitHub Pages: automatic
   - Netlify: Analytics dashboard
   - Vercel: Performance monitoring

---

## 🔧 Keep Your Portfolio Updated:

For GitHub Pages:
```bash
# Make changes locally
# Then push to update:
git add .
git commit -m "Update portfolio"
git push
```

Changes live within seconds!

---

## ⚠️ Important Notes:

- Your portfolio uses **Canvas animations** - all supported by modern browsers
- **No backend needed** - it's a static site (all client-side code)
- **Assets folder** must be in the repo (photo.jpg)
- **Works offline** - great for sharing as ZIP before online deployment

---

## Need Help?

- **GitHub Pages Help**: https://docs.github.com/en/pages
- **Netlify Docs**: https://docs.netlify.com
- **Vercel Docs**: https://vercel.com/docs

---

**Your portfolio is ready to go online today!** 🎉

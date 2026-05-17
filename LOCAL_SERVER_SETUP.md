# 🚀 Local Development Server Setup

## Fix: "Unsafe attempt to load URL" Console Error

The error you're seeing is a browser security restriction when opening files directly with `file://` protocol. All modern browsers have this limitation.

### ✅ SOLUTION: Use a Local Server

Choose one method below (pick the easiest for your OS):

---

## **Method 1: Python (Easiest if Python is installed)**

### Windows PowerShell:
```powershell
# Navigate to your portfolio folder
cd "c:\Users\Danielle Blanca\Videos\web_portfolio"

# Python 3.x
python -m http.server 8000

# OR Python 2.x
python -m SimpleHTTPServer 8000
```

### Then:
1. Open browser
2. Go to: **http://localhost:8000**
3. Press **Ctrl+C** to stop server when done

---

## **Method 2: Node.js (Recommended if you have Node)**

### Install if needed:
```bash
npm install -g http-server
```

### Run server:
```bash
cd "c:\Users\Danielle Blanca\Videos\web_portfolio"
http-server
```

### Then:
1. Open browser
2. Go to: **http://localhost:8080** (or shown in terminal)
3. Press **Ctrl+C** to stop

---

## **Method 3: VS Code Live Server Extension**

### Install:
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search: "Live Server"
4. Install by Ritwick Dey

### Use:
1. Right-click `index.html`
2. Select "Open with Live Server"
3. Automatically opens in browser
4. Auto-reloads on file changes

---

## **Method 4: Windows IIS (Advanced)**

Windows built-in web server, if you prefer.

---

## **After Fixing the Error:**

✅ Console warnings will disappear  
✅ All forms work correctly  
✅ Animations run smoothly  
✅ No security restrictions  
✅ Better testing experience  

---

## **Recommended for Development:**

**VS Code Live Server** - Easiest, auto-reload on saves, best experience

**Python http.server** - No installation, quick, works everywhere

---

## **When Ready to Deploy:**

✅ Deploy to GitHub Pages - No local server needed!  
✅ Deploy to Netlify - Auto-serves correctly  
✅ Deploy to Vercel - No issues there  

See **DEPLOY_GUIDE.md** for online deployment.

---

**Use one of these methods during development. The file:// URLs won't work in production either - that's why we deploy to real servers!** 🎯

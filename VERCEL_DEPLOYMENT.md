# Vercel Deployment Guide - Frontend + Backend

## Project Structure
```
fadecraft-studio/
├── package.json (Frontend)
├── vercel.json (Deployment config)
├── tsconfig.json
├── vite.config.ts
├── dist/ (Built frontend)
├── src/ (Frontend code)
├── api/
│   ├── index.js (Backend API - Serverless)
│   └── package.json (Backend dependencies)
└── ...
```

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Setup Vercel serverless backend"
git push origin main
```

### 2. Connect to Vercel
- Go to [vercel.com](https://vercel.com)
- Connect your GitHub repository
- Select the project folder: `fadecraft-studio`

### 3. Set Environment Variables in Vercel
In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
CORS_ORIGIN=https://your-vercel-url.vercel.app
```

### 4. Deploy
- Vercel will automatically detect:
  - ✅ Frontend build (package.json + vite build)
  - ✅ Backend API (api/index.js)
- Click **Deploy**

---

## How It Works

### Frontend Routes
- `GET /` → Serves React SPA from `dist/index.html`
- `GET /*` → Routes to SPA for React Router

### Backend API Routes
- `POST /api/book-appointment` → Saves booking to MySQL
- `GET /api/` → Health check

### Example Frontend Code to Call Backend
```javascript
// In your booking page
const baseUrl = process.env.VITE_API_BASE || window.location.origin;

const response = await fetch(`${baseUrl}/api/book-appointment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ref, date, time, name, phone, notes, lines, grandTotal })
});
```

---

## Notify Service (Optional)

If you want to deploy the **notify server** (email notifications) separately:

Deploy `server/` folder to **Render.com** instead:
1. Go to [render.com](https://render.com)
2. Create **New Web Service**
3. Connect GitHub and select `server/` folder
4. Add environment variables (SMTP settings)
5. Deploy

Then update your frontend:
```env
VITE_API_BASE=https://your-render-app.onrender.com
```

---

## Testing Locally

```bash
# Install all dependencies
npm install
cd api && npm install && cd ..

# Run frontend dev
npm run dev

# In another terminal, test API
curl -X POST http://localhost:3000/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{"ref":"TEST-1","date":"2026-05-23","time":"10:00","name":"Test","phone":"03xx"}'
```

---

## Troubleshooting

### API not found
- Check `vercel.json` routes configuration
- Ensure `api/index.js` exists
- Verify environment variables are set

### Database connection fails
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` in Vercel env
- Check database allows Vercel IP addresses
- MySQL connection pool is configured for serverless

### Frontend not loading
- Check `build` output in Vercel logs
- Verify `vite build` succeeds locally
- Check build script: `npm run vercel-build`

---

## Production Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel project
- [ ] Set all environment variables
- [ ] Trigger deploy
- [ ] Test `/api/book-appointment`
- [ ] Test booking form on production URL
- [ ] Verify emails are being saved to MySQL

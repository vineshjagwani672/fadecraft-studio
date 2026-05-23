# FadeCraft Notify Backend

This folder contains the backend server for booking notification forwarding via CallMeBot.

## Deploy on Render
1. Set the root directory to `fadecraft-studio/server`.
2. Set the build command to `npm install`.
3. Set the start command to `npm start`.
4. Configure environment variables:
   - `CALLMEBOT_API_KEY`
   - `CALLMEBOT_PHONE`
   - `NOTIFY_SECRET`
   - `PORT` (optional, default is `8787`)
   - `CORS_ORIGIN` (optional, e.g. `https://your-vercel-app.vercel.app`)

## Local development
```bash
cd fadecraft-studio/server
npm install
npm start
```

## Notes
- The front-end should set `VITE_API_BASE` to your Render backend URL.
- `VITE_NOTIFY_SECRET` and `NOTIFY_SECRET` should match to protect the POST route.

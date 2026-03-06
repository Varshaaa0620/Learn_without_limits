# 🚀 Deployment Instructions

## Backend (Render)

1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Add Environment Variables** in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=lms_database
   JWT_SECRET=<generate_a_secure_secret>
   HUGGINGFACE_API_KEY=<your_huggingface_api_key>
   ```

## Frontend (Vercel)

1. Go to https://vercel.com/
2. Import your repository
3. Configure:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

## Test Locally First

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Open http://localhost:5173 and test the AI Assistant chatbot!

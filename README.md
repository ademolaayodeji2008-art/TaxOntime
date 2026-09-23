# TaxonTime.Ng — Website

Full-stack website for TaxonTime.Ng — Nigeria's trusted tax consulting firm.

**Stack:** React + Vite + Tailwind CSS + Framer Motion | Node.js + Express | MongoDB Atlas | Nodemailer (Gmail SMTP)

**Hosting:** Frontend → Vercel | Backend → Render | Database → MongoDB Atlas

---

## Project Structure

```
Taxontime.ng/
├── frontend/          ← React app (deploy to Vercel)
├── backend/           ← Express API (deploy to Render)
└── README.md
```

---

## Local Development

### 1. Backend
```bash
cd backend
# Fill in your values (see Environment Variables section below)
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

### 3. Create your admin account
Send a POST request to `http://localhost:5000/api/auth/register`:
```json
{
  "name": "Zarat Ranti L.",
  "email": "your@email.com",
  "password": "yourpassword"
}
```
Then log in at `http://localhost:3000/admin/login`

---

## Deployment Guide

### Step 1 — Push to GitHub

Create **two separate repositories** on GitHub (or two folders in one monorepo):
- One for `/backend`
- One for `/frontend`

```bash
# Backend repo
cd backend
git init
git add .
git commit -m "Initial backend"
git remote add origin https://github.com/YOUR_USERNAME/taxontime-backend.git
git push -u origin main

# Frontend repo
cd ../frontend
git init
git add .
git commit -m "Initial frontend"
git remote add origin https://github.com/YOUR_USERNAME/taxontime-frontend.git
git push -u origin main
```

> **Important:** Never commit `.env` files. They are in `.gitignore`.

---

### Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your **backend** GitHub repo
3. Render will detect `render.yaml` automatically. Confirm these settings:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Region:** Oregon (or closest to Nigeria — Frankfurt is closer)
4. Set the following **Environment Variables** in the Render dashboard:

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string (30+ characters) |
| `JWT_EXPIRES_IN` | `7d` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Your Gmail address |
| `SMTP_PASS` | Your Gmail App Password (see below) |
| `ADMIN_EMAIL` | Email to receive contact form notifications |
| `FRONTEND_URL` | Your Vercel URL (add this after Step 3) |

5. Click **Deploy**. Once live, copy your Render URL — it looks like:
   `https://taxontime-api.onrender.com`

> **Free tier note:** Render free services spin down after 15 minutes of inactivity.
> The first request after sleep takes ~30 seconds. Upgrade to the $7/month plan to keep it always on.

---

### Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your **frontend** GitHub repo
3. Vercel auto-detects Vite. Confirm these settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (the frontend folder root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add this **Environment Variable** in the Vercel dashboard:

| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL e.g. `https://taxontime-api.onrender.com` |

5. Click **Deploy**. Your site goes live at `https://taxontime-ng.vercel.app` (or your custom domain)

---

### Step 4 — Connect Frontend URL to Backend

Now that both are deployed, go back to your **Render dashboard**:

1. Open your backend service → **Environment**
2. Update `FRONTEND_URL` to your actual Vercel URL:
   ```
   https://taxontime-ng.vercel.app
   ```
   If you have a custom domain too, separate with a space:
   ```
   https://taxontime-ng.vercel.app https://www.taxontime.ng
   ```
3. Save — Render will automatically redeploy

---

### Step 5 — Set Up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://cloud.mongodb.com) → Create a free cluster
2. Create a database user (username + password)
3. Under **Network Access** → Add IP Address → `0.0.0.0/0` (allow all — required for Render)
4. Under **Clusters** → Connect → **Connect your application**
5. Copy the connection string and replace `<password>` with your db user password:
   ```
   mongodb+srv://username:password@cluster0.mongodb.net/taxontime?retryWrites=true&w=majority
   ```
6. Paste this as your `MONGO_URI` in Render

---

### Step 6 — Set Up Gmail App Password

Gmail blocks plain password login. You need an **App Password**:

1. Go to your Google Account → **Security**
2. Make sure **2-Step Verification** is turned ON
3. Search for **App Passwords** → Select app: Mail → Select device: Other → name it "TaxonTime"
4. Google gives you a **16-character password** — use this as `SMTP_PASS` in Render
5. Use your full Gmail address as `SMTP_USER`

---

### Step 7 — Custom Domain (Optional)

**On Vercel:**
1. Go to your project → **Settings → Domains**
2. Add `taxontime.ng` and `www.taxontime.ng`
3. Vercel gives you DNS records to add at your domain registrar

**On Render (custom API domain — optional):**
1. Go to your service → **Settings → Custom Domains**
2. Add `api.taxontime.ng` and configure the CNAME

---

## Environment Variables Summary

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb+srv://...
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_16_char_app_password

ADMIN_EMAIL=your@gmail.com
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.production`)
```env
VITE_API_URL=https://your-render-backend.onrender.com
```
> Set this in the **Vercel dashboard** under Environment Variables — do not commit it.

---

## After Deployment Checklist

- [ ] Backend health check responds: `https://your-api.onrender.com/api/health`
- [ ] Frontend loads on Vercel URL
- [ ] Create admin account via POST `/api/auth/register`
- [ ] Log in at `/admin/login` — Dashboard loads
- [ ] Create a test blog post and verify it appears on `/blog`
- [ ] Submit the contact form — check admin inbox and Gmail for notifications
- [ ] Subscribe to newsletter — check MongoDB for new subscriber
- [ ] Send a test newsletter campaign from admin panel
- [ ] Add a product with a Selar URL — verify redirect works

---

## Admin Panel Routes

| Route | Description |
|---|---|
| `/admin/login` | Admin login |
| `/admin` | Dashboard |
| `/admin/blogs` | Manage blog posts |
| `/admin/blogs/new` | Create new post |
| `/admin/products` | Manage products |
| `/admin/products/new` | Create new product |
| `/admin/newsletter` | Compose + send newsletters |
| `/admin/contacts` | View contact form messages |

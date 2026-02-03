# Umbra HQ Setup Guide

## ✅ Already Completed

1. **Authentication System** - Full Supabase Auth integration
   - Login page at `/login`
   - Password reset flow
   - Protected routes (redirects to login if not authenticated)
   - Logout button in sidebar

2. **Environment Variables** - Set on Vercel
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **User Invitation** - Sent to jladehoff3@gmail.com
   - Check email for invitation link to set password

4. **Deployed** to https://umbra-hq.vercel.app

---

## 🔧 One-Time Setup Required: Database Tables

The app is currently using fallback demo data because the database tables don't exist yet.

**To enable full persistence with RLS, run this SQL in Supabase:**

1. Go to https://supabase.com/dashboard
2. Select the `hvrtuyfhcwilkidzjdxp` project
3. Navigate to **SQL Editor** (left sidebar)
4. Create a new query
5. Copy and paste the contents of `supabase/migrations/002_auth_rls.sql`
6. Click **Run**

This will create all tables with Row Level Security policies so each user can only see their own data.

---

## 🔐 Authentication Flow

1. User visits any page → redirected to `/login` if not authenticated
2. User logs in with email/password
3. Data is fetched from Supabase with user's `user_id`
4. All CRUD operations include `user_id` for RLS compliance

---

## 📂 File Structure

```
src/
├── app/
│   ├── login/page.tsx           # Login page
│   ├── auth/
│   │   ├── callback/route.ts    # OAuth callback handler
│   │   └── reset-password/page.tsx  # Password reset
│   └── ...
├── context/
│   ├── AuthContext.tsx          # Auth state management
│   └── DataContext.tsx          # Data + Supabase queries
├── components/
│   ├── ProtectedRoute.tsx       # Route guard
│   ├── AppShell.tsx             # Conditional layout
│   └── Sidebar.tsx              # Includes logout
└── lib/
    └── supabase.ts              # Supabase client
```

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

---

## 📝 Notes

- The app gracefully falls back to demo data if Supabase tables don't exist
- All data operations check for authentication before syncing to Supabase
- Dark mode preference is saved to localStorage (not user-specific)

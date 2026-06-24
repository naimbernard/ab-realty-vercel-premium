# AB Realty Premium Vercel Website

A premium React/Vite website for AB Realty, ready to upload to GitHub and deploy on Vercel.

## What is included

- Premium homepage matching the supplied Wix screenshots
- Smooth logo preloader
- Video hero support behind homepage text
- Animated text reveals and premium hover effects
- Custom clean house cursor
- About page
- Requirements page
- Properties section and full Properties page
- Individual property detail pages
- Enquiry page
- Instagram preview/link section for `@ab_realty_in`
- Admin login page at `/admin`
- Simple property manager for adding, editing and deleting properties
- Supabase-ready backend option for live persistent property updates
- LocalStorage fallback for testing without a database

## Quick deploy to Vercel via GitHub

1. Unzip this folder.
2. Upload the full folder to a new GitHub repository.
3. Go to Vercel and choose **Add New Project**.
4. Import the GitHub repo.
5. Framework should auto-detect as **Vite**.
6. Build command: `npm run build`
7. Output directory: `dist`
8. Deploy.

## Admin login

Admin page:

```text
/admin
```

Default password:

```text
abrealty2026
```

To change it in Vercel, add this environment variable:

```text
VITE_ADMIN_PASSWORD=your-new-password
```

Important: the default local mode is for simple testing. For proper live updates that everyone can see, connect Supabase.

## Supabase backend setup for live property updates

Without Supabase, the admin saves properties in the browser only. This is useful for testing, but it will not update the public website for everyone.

For real Vercel production updates:

1. Create a free Supabase project.
2. Open Supabase SQL Editor.
3. Paste and run `supabase/schema.sql`.
4. Add your properties manually in Supabase or through the admin after write policies are configured.
5. Add these Vercel environment variables:

```text
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_TABLE=properties
VITE_ADMIN_PASSWORD=your-secure-admin-password
```

For production, use Supabase Auth and restrict insert/update/delete to an authenticated admin. The included schema gives public read access only.

## Hero video

The homepage is built with a video layer behind the text.

To use your own video:

1. Add a file called `hero.mp4` into the `public` folder.
2. Rebuild and deploy.

If no video is added, the site uses a premium image fallback automatically.

## Instagram integration

The site includes a clean Instagram preview section linked to:

```text
https://www.instagram.com/ab_realty_in
```

For a true live Instagram feed, connect a third-party embed such as Elfsight, Curator.io, or Instagram Basic Display API and replace the preview rail component in `src/main.jsx`.

## Key files

```text
src/main.jsx       Main site pages and components
src/styles.css     Full premium styling, animations, responsive design
src/data.js        Starter properties, requirements and services
src/supabase.js    Supabase/localStorage data layer
public/assets      Logo and visual assets
```

## Notes

- Property area values already use sqm where supplied.
- WhatsApp links use `+91 9373136048`.
- Footer says: `AB Realty 2026 by Mavorra Creative`.

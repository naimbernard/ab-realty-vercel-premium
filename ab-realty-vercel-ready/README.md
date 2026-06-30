# AB Realty Premium Vercel Site

This ZIP is fixed for Vercel/GitHub deployment. The project files are at the ZIP root, not hidden inside an extra parent folder.

## Deploy on Vercel

1. Unzip this file.
2. Upload the extracted files to a GitHub repository so the repo root shows:
   - `package.json`
   - `index.html`
   - `src/`
   - `public/`
   - `vercel.json`
3. Import the GitHub repo into Vercel.
4. Use these build settings:
   - Framework Preset: `Vite`
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Redeploy without build cache if you previously deployed the broken version.

## Build check

The project has been locally tested with:

```bash
npm install
npm run build
```

Build output is successful.

## Routes included

- `/` homepage
- `/properties` properties page
- `/properties/:id` property detail page
- `/about` about page
- `/requirements` AB Realty Requirements page
- `/enquire` enquiry page
- `/admin` simple admin page

## Admin

Default password:

```text
abrealty2026
```

Change it in Vercel by adding an environment variable:

```text
VITE_ADMIN_PASSWORD=your-new-password
```

## Property updates

The admin works in local browser mode by default. For real live property updates on Vercel, connect Supabase and run the SQL in `supabase/schema.sql`.

Required Vercel environment variables for Supabase:

```text
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Hero video

The homepage is ready for a background video. Add your video file here:

```text
public/hero.mp4
```

If no video is added, the site uses the included premium image fallback.

## Notes

- Mobile and tablet responsive CSS has been tightened.
- Horizontal overflow prevention is included.
- Smooth animations, preloader, hover effects and house cursor are included.
- Vercel SPA rewrites are included in `vercel.json` to prevent route refresh 404s.

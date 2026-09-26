# For you, Swati

A personal, responsive photo scrapbook with meeting albums, a four-pair photo game, and a love letter. No dependencies. A small build script copies the public website into `dist/` for hosting.

Run `npm run dev` and visit http://localhost:3000. You can also open `index.html` directly. To host it, upload `index.html`, `style.css`, `app.js`, and `assets/` to a static host. Photos will be accessible to anyone with access to the hosted site.

Edit the letter and page text in `index.html`. Album groupings and game photos are in `app.js`. Original photos are untouched; the sideways train photo is rotated in the album viewer with CSS. The chapters follow the provided first, third, and fourth meeting folders.

Google Fonts is optional; local font fallbacks work offline. No analytics, storage, sign-in, or photo uploads are used.

## Deploy on Vercel

1. Commit and push the project to your Git repository, including `assets/`, `build.js`, and `vercel.json`.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Use the repository root as the Root Directory. The included `vercel.json` configures Framework Preset **Other**, Build Command `npm run build`, and Output Directory `dist`.
4. Click **Deploy**. No environment variables are needed.

The build publishes only `index.html`, `style.css`, `app.js`, and the photographs. `server.js` is for local development; Vercel serves the generated files directly. Documentation and local configuration are not copied to the public output. Do not set the Vercel build command to `npm start` or `npm run dev`.

To check the production output locally, run `npm run build`. The `dist/` folder is generated and should not be committed. Each build replaces its previous contents.

Configuration reference: [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json).

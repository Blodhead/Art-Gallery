Angular Universal / Prerender scaffolding

What I added

- `src/app/app.server.module.ts` — server module for Angular Universal.
- `src/main.server.ts` — server entry point for server builds.
- `package.json` scripts: `build:ssr`, `serve:ssr`, and `prerender`.

Why this is minimal

The Angular CLI provides an automated schematic that wires up `angular.json`, server builders, and other config correctly. Running `ng add @nguniversal/express-engine --clientProject app` will:

- Install `@nguniversal/express-engine` and related packages.
- Create server main files and an Express server file that works with the Universal build.
- Update `angular.json` with `server` and `prerender` targets.

Next steps (run locally)

1) From `frontend/app` install the Universal schematic and required packages:

```powershell
cd frontend\app
npm install @nguniversal/express-engine @nguniversal/builders --save
npx ng add @nguniversal/express-engine --clientProject app
```

2) Build and test SSR locally:

```powershell
# build browser + server bundles
npm run build:ssr
# run the SSR server (after ng add created dist/app/server/main.js)
npm run serve:ssr
```

3) Optional: prerender static pages (after schematic wires prerender target):

```powershell
npm run prerender
```

Notes & caveats

- I created minimal server-module and main.server.ts to prepare the project; the schematic (`ng add`) will replace or augment these files as needed.
- The project name `app` is used in the scripts (this is the `name` field in `package.json`). If your Angular `angular.json` uses a different project name, update the scripts accordingly.
- After SSR/prerender is working, we can add a small server-side route to serve product pages with proper meta tags and JSON-LD for SEO.

If you want, I can run `npx ng add @nguniversal/express-engine` and finish wiring this up now (it will modify `angular.json` and install dependencies). Should I proceed and run the schematic and then build+serve SSR? If yes, confirm and I'll run the commands here.
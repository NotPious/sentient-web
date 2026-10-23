# Development and deployment

This project is deployed to Vercel from the `main` branch on GitHub. When the Vercel project is connected to this repository, pushing a commit to `main` starts a production deployment; pushes to other branches generally create preview deployments.

## Set up locally

1. Install Node.js **22.12+**.
2. From the project directory, install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create a `.env` file in the project root when you need newsletter submissions to work locally:

   ```env
   GOOGLE_APPS_SCRIPT_URL="your Apps Script Web App URL"
   ```

   Keep environment-variable values private. `.env` is ignored by Git; never force-add it or paste secret values into source, commits, or issue reports.

## Develop and verify

Start the local site:

```bash
npm run dev
```

To start Astro's background server instead:

```bash
npm run dev -- --background
```

The local site is normally available at <http://localhost:4321/>. For a background server, check or manage it with:

```bash
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Before publishing, run the production build and check the patch:

```bash
npm run build
git diff --check
```

Review `git status` and `git diff` to confirm that only intended files will be included. Do not commit generated output, dependencies, or local environment files.

## Commit and publish

The normal production workflow is to commit and push to `main`:

```bash
git status
git add src/path/to/changed-file
git commit -m "describe the change"
git push origin main
```

Replace the example path with each intended file, including documentation when applicable. If working on a separate branch, push that branch and merge it into `main` through GitHub when ready to release.

## Confirm a Vercel deployment

GitHub accepting a push does not, by itself, prove that production deployment succeeded. After pushing:

1. Open the Sentient project in the Vercel dashboard and choose **Deployments**.
2. Find the deployment for the pushed commit. For a production release from `main`, confirm its status is **Ready** and that it is marked as a **Production** deployment.
3. Open the production domain, <https://sentient-web-iota.vercel.app>, and check the changed page or feature.
4. If there is no new deployment, verify that the Vercel project's Git settings connect to `NotPious/sentient-web` and use `main` as its production branch. If the deployment failed, open its build logs, fix the reported cause, and push a follow-up commit.

The site uses Astro's Vercel adapter and server output. Configure `GOOGLE_APPS_SCRIPT_URL` in Vercel under **Project Settings > Environment Variables** for the environments that need newsletter submissions; redeploy after changing a production environment variable. Do not put its value in this document.

## Undo a release

Prefer a new corrective commit over rewriting published history. To undo a specific commit, use `git revert <commit-sha>`, review the resulting changes, then push to `main`. Confirm the new Vercel production deployment is **Ready** and check the live site again.

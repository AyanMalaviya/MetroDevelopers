 # React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Private Records Dashboard

The hidden records page lives at `/records` and is protected by the calculator unlock flow plus a server-issued HttpOnly cookie.

Current demo unlock code: `13579024`.

If you already pasted your published Google Sheets CSV URL into `.env.local` or your Vercel environment variables, the API will read it from `RECORDS_SHEET_CSV_URL` and no client code change is needed.

To enable it, set these environment variables on Vercel or your deployment target:

- `RECORDS_UNLOCK_CODE`
- `RECORDS_SESSION_SECRET`
- `RECORDS_WEBHOOK_URL`
- `RECORDS_SHEET_CSV_URL`

`RECORDS_WEBHOOK_URL` is optional. You only need it if you want new form submissions to be appended back into Google Sheets.

The Google Sheet webhook should accept these fields: `recordId`, `submittedAt`, `role`, `fullName`, `phone`, `email`, `companyName`, `shedNumbers`, `dealType`, `agreementStatus`, and `notes`.

To open the page, load `/calculator`, tap the simple calculator digits `13579024` in order, and the hidden page will open automatically.

For local testing, use `vercel dev` or a Vercel preview deployment. Plain `vite dev` does not serve the `/api/records` function.

Pushing to Git is enough to trigger a Vercel redeploy, but it does not set the environment variables. You still need to configure them in Vercel under Project Settings > Environment Variables.

If you want the form to append to Google Sheets, also set `RECORDS_WEBHOOK_URL` to your Apps Script webhook URL. If you only want to read CSV data, leave it unset.

If you want a local dummy-data fallback for testing, point `RECORDS_SHEET_CSV_URL` to `/records-dummy-data.csv` in your local `.env.local`, but do not keep that value there if you want the real Google Sheets CSV URL to win.

`.env.example` is only a template for the repo. `.env.local` is where your actual local values live. You do not need a committed `.env` file for this setup.

When `RECORDS_WEBHOOK_URL` is missing, the page runs in read-only demo mode so the sample rows still load but new submissions are disabled.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

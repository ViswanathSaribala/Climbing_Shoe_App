# Climbing Shoe Advisor

A responsive web app that recommends climbing shoes based on a climber's foot shape, shoe size, climbing style, experience level, and preferred shoe feel.

The current version uses a public browser UI, private Supabase database, and Vercel API functions. Public users can get recommendations, but they cannot download the raw shoe database.

## Features

- Foot profile questionnaire
- Climbing style and experience inputs
- Soft, stiff, or balanced shoe preference
- Comfort, performance, or aggressive fit preference
- Rule-based recommendation scoring
- Top shoe matches with explanations
- Suggested starting size based on street shoe size
- Protected admin editor for advisor fit notes
- Responsive layout for desktop and mobile browsers

## Project Structure

```text
.
├── index.html
├── README.md
├── admin.html
├── api/
│   ├── _lib.js
│   ├── admin-shoes.js
│   └── recommend.js
├── data/
│   ├── README.md
│   └── shoes.local.json
├── db/
│   └── schema.sql
├── package.json
├── scripts/
│   ├── import-shoes-to-supabase.js
│   └── migrate-shoes-to-v1.js
├── src/
│   ├── app.js
│   └── styles.css
└── research/
    ├── Climbing_Shoe_Advisor_Roadmap.pdf
    ├── climbing_shoe_advisor_database_template.json
    ├── climbing_shoe_advisor_master_database.xlsx
    ├── climbing_shoe_advisor_schema_and_rules.json
    └── la_sportiva_scarpa_shoe_advisor_dataset.xlsx
```

## Database Privacy

The raw shoe database is private. The browser app does not fetch `data/shoes.json`.

Instead:

- Public app calls `/api/recommend`.
- `/api/recommend` reads Supabase from server-side code.
- Admin page calls `/api/admin-shoes`.
- `SUPABASE_SERVICE_ROLE_KEY` is stored only as a server environment variable.
- `data/shoes.local.json` is ignored by git and should not be committed.

If a JSON file is committed to a public GitHub repository, it is public. If you already pushed an older `data/shoes.json`, remove it from the current branch and consider cleaning repository history or starting a fresh public repo if the data must be treated as private.

## Setup Supabase

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run `db/schema.sql`.
4. Copy your project URL.
5. Copy your service-role key from Project Settings -> API.

Never put the service-role key in browser JavaScript.

## Environment Variables

Create `.env.local` for local development:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_TOKEN=choose_a_long_private_admin_password
```

Add the same variables in Vercel Project Settings -> Environment Variables.

## Import Existing Shoes

Keep your private source data in:

```text
data/shoes.local.json
```

Then run:

```bash
npm install
npm run import:shoes
```

This imports the local shoes into the private Supabase `shoes` table.

## Run Locally With APIs

Install dependencies:

```bash
npm install
```

Run with Vercel's local dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/
```

The public advisor app is at `/`.

The protected admin editor is at:

```text
http://localhost:3000/admin.html
```

## How To Use The App

1. Choose your foot width, foot volume, and toe shape.
2. Enter your street shoe size in EU sizing.
3. Select your main climbing use.
4. Select your climbing experience level.
5. Choose whether you want a soft, stiff, or balanced shoe.
6. Choose comfort, performance, or aggressive fit.
7. Click Get Recommendations.

The app returns ranked shoe recommendations with match scores, sizing guidance, fit details, reasons, and cautions.

## Data

The deployed app uses the private Supabase `shoes` table.

Each shoe separates:

- `official_data`: product facts from official brand pages, catalogs, or product sheets.
- `advisor_fit_notes`: practical fit interpretation from testing, shop knowledge, demos, reviews, or user feedback.

Some fit data is still early and marked as `estimated` with `needs_validation: true`. Improve those fields with real fitting research before treating recommendations as reliable.

See `data/README.md` for the data collection rules. The `research/` folder contains the original roadmap, schema/rules plan, and spreadsheet references for expanding the database.

## Recommendation Logic

The app uses weighted rule-based scoring.

It adds points for:

- Matching climbing use
- Matching skill level
- Matching soft, stiff, or balanced shoe preference
- Matching foot width
- Matching foot volume
- Matching toe shape
- Matching comfort, performance, or aggressive fit preference

It subtracts points for:

- Shoes that may be too advanced for beginners
- Foot width or volume mismatches
- Toe shape mismatches
- Aggressive shoes when the user wants comfort

The highest-scoring shoes are normalized into match percentages and shown as recommendations.

## Publish Online

Because the app now uses private data and API functions, deploy it to Vercel, Netlify, or another host that supports serverless functions.

GitHub Pages is no longer enough because it cannot run `/api/recommend` or protect the database.

## Push To GitHub

Create an empty repository on GitHub first. Then copy its repository URL and run:

```bash
git remote add origin https://github.com/your-username/your-repository-name.git
git push -u origin main
```

If you use SSH instead of HTTPS:

```bash
git remote add origin git@github.com:your-username/your-repository-name.git
git push -u origin main
```

### Vercel

1. Push this project to GitHub.
2. Create a Vercel account.
3. Import the GitHub repository into Vercel.
4. Add environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_TOKEN`
5. Deploy.

Vercel will create a public URL like:

```text
https://your-project.vercel.app/
```

Anyone can open that URL in a desktop or mobile browser without installing anything.

## Other Hosting Options

Netlify also works if you adapt the API functions to Netlify Functions. Vercel is the simplest fit for the current `api/` folder.

## Next Steps

1. Improve the shoe fit database.
2. Add more brands and models.
3. Add budget and indoor/outdoor filters.
4. Add shoe comparison.
5. Add an admin workflow for editing shoe data.
6. Later, add a backend and user feedback.

## Important Note

This app provides starting recommendations, not guaranteed fit decisions. Climbing shoe fit still depends on trying shoes on, foot shape, pressure tolerance, climbing style, and break-in behavior.

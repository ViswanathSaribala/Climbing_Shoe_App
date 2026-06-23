# Shoe Data Guide

The shoe database is split into two sections for each shoe:

- `official_data`: product facts from official brand pages, catalogs, or product sheets.
- `advisor_fit_notes`: fit interpretation from testing, shop knowledge, demos, reviews, or user feedback.

Keep these separate. Official specs are not the same thing as real-world fit advice.

## Privacy Model

Do not commit full shoe datasets to the public repository.

Use:

- `data/shoes.local.json` for private local seed/import data.
- Supabase `shoes` table as the deployed source of truth.
- `/api/recommend` for public recommendations.
- `/admin.html` for protected browser editing.

The public app should never fetch a raw JSON shoe database.

## Official Data

Use official brand sources for:

- Brand
- Model
- Gender fit or version
- Closure type
- Rubber name
- Rubber thickness, when listed
- Upper material
- Vegan status
- Lined/unlined status
- Profile
- Asymmetry
- Stiffness, sensitivity, and support scores, when listed
- Intended use
- Skill level or product category
- Product URL
- Official product notes

For material classification, use:

- `leather`
- `synthetic_leather`
- `vegan_materials`
- `mixed`
- `other`
- `unknown`

Only mark `vegan: true` when the manufacturer explicitly identifies the shoe as
vegan.

Set `official_confidence` to:

- `official`: verified from the brand page or brand catalog
- `researched`: from a reputable retailer or catalog when the official page is missing
- `estimated`: inferred from multiple non-official sources
- `unknown`: not verified yet

## Advisor Fit Notes

Use `advisor_fit_notes` for:

- Foot width fit
- Foot volume fit
- Toe shape compatibility
- Heel fit
- Sizing offsets from street size
- Stretch and break-in notes
- Practical recommendation summary

Set `fit_confidence` to:

- `tested`: personally tested or confirmed through direct fitting experience
- `researched`: supported by multiple reliable fit reports
- `estimated`: plausible but not validated
- `unknown`: still missing

Use `needs_validation: true` until the fit notes are backed by testing, reliable expert review, or strong user feedback.

## Recommended Workflow

1. Add official product facts in Supabase or a private local seed file.
2. Add the official product URL.
3. Mark official data confidence.
4. Open `/admin.html`.
5. Load shoes with your admin token.
6. Add advisor fit notes in the form.
7. Mark fit confidence honestly.
8. Keep `needs_validation: true` for any shoe that has not been tested.

The database manager also lets you add and update brand, model, construction,
performance scores, intended use, official source, and confidence fields. Saving
an existing shoe updates the complete record in Supabase.

## Why This Matters

The app should be honest about what it knows. Brand pages are good for construction and product positioning, but they often do not give precise foot-shape compatibility. The advisor becomes useful when official specs are combined with carefully labeled fit knowledge.

# Shoe Data Guide

The shoe database is split into two sections for each shoe:

- `official_data`: product facts from official brand pages, catalogs, or product sheets.
- `advisor_fit_notes`: fit interpretation from testing, shop knowledge, demos, reviews, or user feedback.

Keep these separate. Official specs are not the same thing as real-world fit advice.

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

1. Add official product facts first.
2. Add the official product URL.
3. Mark official data confidence.
4. Add advisor fit notes separately.
5. Mark fit confidence honestly.
6. Keep `needs_validation: true` for any shoe that has not been tested.

## Why This Matters

The app should be honest about what it knows. Brand pages are good for construction and product positioning, but they often do not give precise foot-shape compatibility. The advisor becomes useful when official specs are combined with carefully labeled fit knowledge.

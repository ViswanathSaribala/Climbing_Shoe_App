# Climbing Shoe Advisor

A responsive web app that recommends climbing shoes based on a climber's foot shape, shoe size, climbing style, experience level, and preferred shoe feel.

The current version is a static MVP that runs in desktop and mobile browsers. It uses a local JSON shoe database and a rule-based scoring system to recommend the best matches.

## Features

- Foot profile questionnaire
- Climbing style and experience inputs
- Soft, stiff, or balanced shoe preference
- Comfort, performance, or aggressive fit preference
- Rule-based recommendation scoring
- Top shoe matches with explanations
- Suggested starting size based on street shoe size
- Built-in shoe library view
- Responsive layout for desktop and mobile browsers

## Project Structure

```text
.
├── index.html
├── README.md
├── data/
│   └── shoes.json
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

## Run Locally

The app loads `data/shoes.json`, so run it from a local web server instead of opening `index.html` directly.

### Option 1: Python

From the project folder:

```bash
python3 -m http.server 8088 --bind 127.0.0.1
```

Open:

```text
http://127.0.0.1:8088/
```

### Option 2: VS Code

1. Open the project folder in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select Open with Live Server.

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

The MVP uses `data/shoes.json`, a starter La Sportiva and Scarpa shoe dataset.

Some fit data is still early and should be improved with real fitting research. The `research/` folder contains the original roadmap, schema/rules plan, and spreadsheet references for expanding the database.

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

Because this is a static web app, the easiest way to let people use it without running code is GitHub Pages.

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

### GitHub Pages

1. Push this project to a GitHub repository.
2. Open the repository on GitHub.
3. Go to Settings.
4. Go to Pages.
5. Under Build and deployment, choose Deploy from a branch.
6. Choose the `main` branch.
7. Choose `/root` as the folder.
8. Click Save.

GitHub will create a public URL like:

```text
https://your-username.github.io/your-repository-name/
```

Anyone can open that URL in a desktop or mobile browser without installing anything.

## Other Hosting Options

You can also deploy the app on:

- Netlify
- Vercel
- Cloudflare Pages

For this static MVP, GitHub Pages is the simplest choice.

## Next Steps

1. Improve the shoe fit database.
2. Add more brands and models.
3. Add budget and indoor/outdoor filters.
4. Add shoe comparison.
5. Add an admin workflow for editing shoe data.
6. Later, add a backend and user feedback.

## Important Note

This app provides starting recommendations, not guaranteed fit decisions. Climbing shoe fit still depends on trying shoes on, foot shape, pressure tolerance, climbing style, and break-in behavior.

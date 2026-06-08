const form = document.querySelector("#advisor-form");
const resetButton = document.querySelector("#reset-button");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");
const libraryDialog = document.querySelector("#library-dialog");
const libraryList = document.querySelector("#library-list");
const showLibrary = document.querySelector("#show-library");
const closeLibrary = document.querySelector("#close-library");

let shoes = [];

const fitKnowledge = {
  "la sportiva solution": {
    width: "medium",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Powerful bouldering and sport shoe with a structured heel and aggressive shape."
  },
  "la sportiva theory": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "roman-square"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Very soft indoor and competition-style shoe for volumes, smears, and dynamic climbing."
  },
  "la sportiva mantra": {
    width: "medium",
    volume: "low-medium",
    toeShapes: ["egyptian", "roman-square"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Extremely sensitive slipper for modern indoor climbing and friction-based movement."
  },
  "la sportiva tc pro": {
    width: "medium",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Supportive flat shoe for edging, cracks, trad, and long outdoor routes."
  },
  "la sportiva miura": {
    width: "narrow",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Technical edging shoe for vertical and outdoor sport climbing."
  },
  "la sportiva katana lace": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Precise all-round outdoor shoe with strong edging support."
  },
  "la sportiva kubo": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "roman-square"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Approachable all-rounder for gym climbing, bouldering, and sport climbing."
  },
  "la sportiva finale": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable beginner and all-day shoe with supportive construction."
  },
  "la sportiva tarantulace": {
    width: "medium-wide",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Beginner-friendly gym and training shoe with forgiving fit."
  },
  "la sportiva mythos eco": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfort-focused trad and multipitch shoe."
  },
  "scarpa drago lv": {
    width: "narrow",
    volume: "low",
    toeShapes: ["egyptian", "roman-square"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Low-volume, very soft bouldering and competition shoe."
  },
  "scarpa instinct vs men's": {
    width: "medium-wide",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Powerful bouldering and sport shoe with strong support."
  },
  "scarpa instinct": {
    width: "medium-wide",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Balanced performance shoe for bouldering and sport climbing."
  },
  "scarpa instinct vsr": {
    width: "medium-wide",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Softer Instinct variant for bouldering, indoor climbing, and sensitivity."
  },
  "scarpa vapor men's": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Versatile moderate shoe for sport climbing, edging, and gym use."
  },
  "scarpa vapor v lv": {
    width: "narrow",
    volume: "low",
    toeShapes: ["egyptian", "greek"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Lower-volume versatile shoe with good edging and sport climbing range."
  },
  "scarpa helix men's new": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable beginner and long-session shoe."
  },
  "scarpa origin woman": {
    width: "medium",
    volume: "low-medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable entry-level shoe for gym climbing."
  },
  "scarpa veloce": {
    width: "wide",
    volume: "medium-high",
    toeShapes: ["roman-square", "egyptian"],
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Soft and comfortable indoor shoe with a roomy forefoot."
  }
};

function keyFor(shoe) {
  return `${shoe.brand} ${shoe.model}`.toLowerCase();
}

function normalizeShoe(shoe) {
  const fit = fitKnowledge[keyFor(shoe)] || {};
  return {
    ...shoe,
    fitWidth: fit.width || shoe.shop_width || "unknown",
    fitVolume: fit.volume || shoe.shop_volume || "unknown",
    toeShapes: fit.toeShapes || (shoe.shop_toe_shape ? [shoe.shop_toe_shape] : ["unknown"]),
    sizing: fit.sizing || { comfort: 0, performance: -0.5, aggressive: -1 },
    advisorNotes: fit.notes || shoe.shop_notes || shoe.official_notes || "No notes available yet."
  };
}

function distanceValue(value, target, order) {
  const a = order.indexOf(value);
  const b = order.indexOf(target);
  if (a === -1 || b === -1) return null;
  return Math.abs(a - b);
}

function pointsForRating(rating, weight) {
  return Number(rating || 0) * weight;
}

function scoreShoe(shoe, prefs) {
  let score = 0;
  const reasons = [];
  const cautions = [];

  const useScores = {
    indoor_bouldering: shoe.bouldering + shoe.indoor,
    outdoor_bouldering: shoe.bouldering + shoe.outdoor,
    sport: shoe.sport + Math.max(shoe.indoor, shoe.outdoor),
    trad: shoe.trad + shoe.outdoor,
    multipitch: shoe.multipitch + shoe.support,
    all_round: shoe.bouldering + shoe.sport + shoe.indoor + shoe.outdoor
  };
  const useScore = useScores[prefs.primaryUse] || useScores.all_round;
  score += useScore * 3;
  reasons.push(`Strong use-case score for ${labelFor(prefs.primaryUse)}.`);

  score += pointsForRating(shoe[prefs.level], 3);
  if (Number(shoe[prefs.level]) >= 4) {
    reasons.push(`Suitable for ${prefs.level} climbers.`);
  }

  if (prefs.shoeFeel === "soft") {
    score += pointsForRating(shoe.sensitivity, 4);
    score -= pointsForRating(shoe.stiffness, 1.5);
    reasons.push("Prioritizes sensitivity and friction.");
  }

  if (prefs.shoeFeel === "stiff") {
    score += pointsForRating(shoe.stiffness, 4);
    score += pointsForRating(shoe.support, 2);
    score -= pointsForRating(shoe.sensitivity, 1);
    reasons.push("Prioritizes support for small holds.");
  }

  if (prefs.shoeFeel === "balanced") {
    const balance = 5 - Math.abs(Number(shoe.stiffness) - Number(shoe.sensitivity));
    score += Math.max(0, balance) * 4;
    reasons.push("Balanced stiffness and sensitivity profile.");
  }

  const widthDistance = distanceValue(shoe.fitWidth, prefs.footWidth, ["narrow", "medium", "medium-wide", "wide"]);
  if (widthDistance === 0) {
    score += 12;
    reasons.push("Foot width match.");
  } else if (widthDistance === 1) {
    score += 5;
    reasons.push("Foot width is close.");
  } else if (widthDistance !== null) {
    score -= 8;
    cautions.push("Width may need careful try-on.");
  }

  const volumeDistance = distanceValue(shoe.fitVolume, prefs.footVolume, ["low", "low-medium", "medium", "medium-high", "high"]);
  if (volumeDistance === 0) {
    score += 10;
    reasons.push("Foot volume match.");
  } else if (volumeDistance === 1) {
    score += 4;
    reasons.push("Foot volume is close.");
  } else if (volumeDistance !== null) {
    score -= 7;
    cautions.push("Volume may feel too roomy or too tight.");
  }

  if (shoe.toeShapes.includes(prefs.toeShape) || prefs.toeShape === "unknown") {
    score += 8;
    reasons.push("Toe shape looks compatible.");
  } else if (!shoe.toeShapes.includes("unknown")) {
    score -= 5;
    cautions.push("Toe shape compatibility is not ideal.");
  }

  if (prefs.fitPreference === "comfort") {
    score += Number(shoe.beginner || 0) * 2 + Number(shoe.support || 0) * 1.5;
    if (String(shoe.profile).toLowerCase().includes("aggressive")) {
      score -= 6;
      cautions.push("Aggressive profile may be less comfortable.");
    }
  }

  if (prefs.fitPreference === "performance") {
    score += Number(shoe.intermediate || 0) * 2 + Number(shoe.advanced || 0) * 2;
  }

  if (prefs.fitPreference === "aggressive") {
    score += Number(shoe.advanced || 0) * 3;
    if (!String(shoe.profile).toLowerCase().includes("aggressive")) score -= 4;
  }

  if (prefs.level === "beginner" && Number(shoe.advanced) >= 5 && Number(shoe.beginner) <= 1) {
    score -= 14;
    cautions.push("Likely too specialized for a first shoe.");
  }

  return {
    shoe,
    score: Math.max(0, Math.round(score)),
    reasons: [...new Set(reasons)].slice(0, 4),
    cautions: [...new Set(cautions)].slice(0, 3)
  };
}

function labelFor(value) {
  return value.replaceAll("_", " ");
}

function sizeAdvice(shoe, streetSize, preference) {
  const offset = shoe.sizing[preference] ?? shoe.sizing.performance ?? -0.5;
  const target = Number(streetSize) + Number(offset);
  const sign = offset > 0 ? "+" : "";
  return `${target.toFixed(target % 1 === 0 ? 0 : 1)} EU (${sign}${offset} from street size)`;
}

function renderResults(matches, prefs) {
  const top = matches.slice(0, 5);
  resultCount.textContent = `${top.length} recommended shoes`;
  results.className = "results-list";
  results.innerHTML = top.map((match, index) => {
    const shoe = match.shoe;
    const score = Math.min(100, Math.round((match.score / Math.max(matches[0].score, 1)) * 100));
    return `
      <article class="shoe-card">
        <div class="rank">#${index + 1}</div>
        <div class="shoe-card-main">
          <div class="shoe-card-head">
            <div>
              <h3>${shoe.brand} ${shoe.model}</h3>
              <p>${shoe.profile || "Profile unknown"} · ${shoe.rubber_type || "Rubber unknown"}</p>
            </div>
            <div class="match-score">${score}%</div>
          </div>
          <div class="meter" aria-label="Match score"><span style="width: ${score}%"></span></div>
          <dl class="quick-facts">
            <div><dt>Fit</dt><dd>${shoe.fitWidth}, ${shoe.fitVolume}</dd></div>
            <div><dt>Feel</dt><dd>Stiff ${shoe.stiffness}/5 · Sensitive ${shoe.sensitivity}/5</dd></div>
            <div><dt>Size start</dt><dd>${sizeAdvice(shoe, prefs.streetSize, prefs.fitPreference)}</dd></div>
          </dl>
          <p class="advisor-note">${shoe.advisorNotes}</p>
          <ul class="reason-list">
            ${match.reasons.map(reason => `<li>${reason}</li>`).join("")}
            ${match.cautions.map(caution => `<li class="caution">${caution}</li>`).join("")}
          </ul>
        </div>
      </article>
    `;
  }).join("");
}

function renderLibrary() {
  libraryList.innerHTML = shoes.map(shoe => `
    <article class="library-row">
      <div>
        <h3>${shoe.brand} ${shoe.model}</h3>
        <p>${shoe.profile || "Profile unknown"} · ${shoe.rubber_type || "Rubber unknown"}</p>
      </div>
      <div class="library-tags">
        <span>${shoe.fitWidth}</span>
        <span>${shoe.fitVolume}</span>
        <span>B ${shoe.bouldering}/5</span>
        <span>S ${shoe.sport}/5</span>
      </div>
    </article>
  `).join("");
}

function getPrefs() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

async function loadShoes() {
  try {
    const response = await fetch("data/shoes.json");
    const data = await response.json();
    shoes = data.shoes.map(normalizeShoe);
    renderLibrary();
  } catch (error) {
    results.className = "results-empty";
    results.textContent = "Could not load the shoe dataset. Run this app from a local web server, not by opening the HTML file directly.";
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const prefs = getPrefs();
  const matches = shoes
    .map(shoe => scoreShoe(shoe, prefs))
    .sort((a, b) => b.score - a.score);
  renderResults(matches, prefs);
});

resetButton.addEventListener("click", () => {
  form.reset();
  resultCount.textContent = "Ready when you are";
  results.className = "results-empty";
  results.textContent = "Answer the questions and the advisor will rank shoes from the starter database.";
});

showLibrary.addEventListener("click", () => libraryDialog.showModal());
closeLibrary.addEventListener("click", () => libraryDialog.close());

loadShoes();

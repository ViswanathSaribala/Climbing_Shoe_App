const form = document.querySelector("#advisor-form");
const resetButton = document.querySelector("#reset-button");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");
const libraryDialog = document.querySelector("#library-dialog");
const libraryList = document.querySelector("#library-list");
const showLibrary = document.querySelector("#show-library");
const closeLibrary = document.querySelector("#close-library");

let shoes = [];

function normalizeShoe(shoe) {
  const official = shoe.official_data || {};
  const fit = shoe.advisor_fit_notes || {};
  const performance = official.performance_scores_1_to_5 || {};
  const use = official.use_scores_1_to_5 || {};
  const skill = official.skill_scores_1_to_5 || {};
  const shape = official.shape || {};
  const rubber = official.rubber || {};

  return {
    ...shoe,
    gender_fit: official.gender_fit || shoe.gender_fit || "",
    closure: official.closure || shoe.closure || "",
    rubber_type: rubber.primary || shoe.rubber_type || "",
    profile: shape.profile || shoe.profile || "",
    asymmetry: shape.asymmetry || shoe.asymmetry || "",
    stiffness: performance.stiffness ?? shoe.stiffness ?? 0,
    sensitivity: performance.sensitivity ?? shoe.sensitivity ?? 0,
    support: performance.support ?? shoe.support ?? 0,
    bouldering: use.bouldering ?? shoe.bouldering ?? 0,
    sport: use.sport ?? shoe.sport ?? 0,
    indoor: use.indoor ?? shoe.indoor ?? 0,
    outdoor: use.outdoor ?? shoe.outdoor ?? 0,
    trad: use.trad ?? shoe.trad ?? 0,
    multipitch: use.multipitch ?? shoe.multipitch ?? 0,
    beginner: skill.beginner ?? shoe.beginner ?? 0,
    intermediate: skill.intermediate ?? shoe.intermediate ?? 0,
    advanced: skill.advanced ?? shoe.advanced ?? 0,
    productUrl: official.product_url || shoe.source_url || "",
    officialNotes: official.official_notes || shoe.official_notes || "",
    officialConfidence: official.official_confidence || shoe.data_confidence || "unknown",
    fitWidth: fit.foot_width || shoe.shop_width || "unknown",
    fitVolume: fit.foot_volume || shoe.shop_volume || "unknown",
    heelFit: fit.heel_fit || shoe.shop_heel_fit || "",
    toeShapes: fit.toe_shape_fit || (shoe.shop_toe_shape ? [shoe.shop_toe_shape] : ["unknown"]),
    sizing: fit.sizing_offsets_eu || { comfort: null, performance: null, aggressive: null },
    advisorNotes: fit.summary || shoe.shop_notes || official.official_notes || "No notes available yet.",
    fitConfidence: fit.fit_confidence || "unknown",
    fitSourceType: fit.source_type || "unknown",
    needsValidation: Boolean(fit.needs_validation)
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
          <div class="source-strip">
            <span>Official data: ${shoe.officialConfidence}</span>
            <span>Fit notes: ${shoe.fitConfidence}${shoe.needsValidation ? " · needs validation" : ""}</span>
            ${shoe.productUrl ? `<a href="${shoe.productUrl}" target="_blank" rel="noreferrer">Official source</a>` : ""}
          </div>
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
        <span>${shoe.fitConfidence}</span>
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

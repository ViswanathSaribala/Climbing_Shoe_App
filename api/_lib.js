const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

function loadLocalEnv() {
  const envPath = ".env.local";
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getSupabase() {
  return createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false
      }
    }
  );
}

function requireAdmin(req, res) {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) {
    json(res, 500, { error: "ADMIN_TOKEN is not configured." });
    return false;
  }

  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== expected) {
    json(res, 401, { error: "Unauthorized." });
    return false;
  }

  return true;
}

function normalizeShoe(shoe) {
  const official = shoe.official_data || {};
  const fit = shoe.advisor_fit_notes || {};
  const performance = official.performance_scores_1_to_5 || {};
  const use = official.use_scores_1_to_5 || {};
  const skill = official.skill_scores_1_to_5 || {};
  const shape = official.shape || {};
  const rubber = official.rubber || {};

  return {
    id: shoe.id,
    brand: shoe.brand,
    model: shoe.model,
    gender_fit: official.gender_fit || "",
    closure: official.closure || "",
    rubber_type: rubber.primary || "",
    profile: shape.profile || "",
    asymmetry: shape.asymmetry || "",
    stiffness: performance.stiffness ?? 0,
    sensitivity: performance.sensitivity ?? 0,
    support: performance.support ?? 0,
    bouldering: use.bouldering ?? 0,
    sport: use.sport ?? 0,
    indoor: use.indoor ?? 0,
    outdoor: use.outdoor ?? 0,
    trad: use.trad ?? 0,
    multipitch: use.multipitch ?? 0,
    beginner: skill.beginner ?? 0,
    intermediate: skill.intermediate ?? 0,
    advanced: skill.advanced ?? 0,
    productUrl: official.product_url || "",
    officialNotes: official.official_notes || "",
    officialConfidence: official.official_confidence || "unknown",
    fitWidth: fit.foot_width || "unknown",
    fitVolume: fit.foot_volume || "unknown",
    heelFit: fit.heel_fit || "",
    toeShapes: fit.toe_shape_fit || ["unknown"],
    sizing: fit.sizing_offsets_eu || { comfort: null, performance: null, aggressive: null },
    advisorNotes: fit.summary || official.official_notes || "No notes available yet.",
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

function labelFor(value) {
  return String(value || "").replaceAll("_", " ");
}

function scoreShoe(rawShoe, prefs) {
  const shoe = normalizeShoe(rawShoe);
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
  if (Number(shoe[prefs.level]) >= 4) reasons.push(`Suitable for ${prefs.level} climbers.`);

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

function publicRecommendation(match, maxScore, prefs) {
  const shoe = match.shoe;
  const score = Math.min(100, Math.round((match.score / Math.max(maxScore, 1)) * 100));
  const offset = shoe.sizing[prefs.fitPreference] ?? shoe.sizing.performance ?? null;
  const streetSize = Number(prefs.streetSize);
  const sizeStart = offset === null || Number.isNaN(streetSize)
    ? "Try-on range needed"
    : `${(streetSize + Number(offset)).toFixed((streetSize + Number(offset)) % 1 === 0 ? 0 : 1)} EU (${offset > 0 ? "+" : ""}${offset} from street size)`;

  return {
    brand: shoe.brand,
    model: shoe.model,
    match_score: score,
    profile: shoe.profile,
    rubber_type: shoe.rubber_type,
    fit_width: shoe.fitWidth,
    fit_volume: shoe.fitVolume,
    stiffness: shoe.stiffness,
    sensitivity: shoe.sensitivity,
    size_start: sizeStart,
    advisor_summary: shoe.advisorNotes,
    official_confidence: shoe.officialConfidence,
    fit_confidence: shoe.fitConfidence,
    needs_validation: shoe.needsValidation,
    official_source_url: shoe.productUrl,
    reasons: match.reasons,
    cautions: match.cautions
  };
}

module.exports = {
  getSupabase,
  json,
  normalizeShoe,
  publicRecommendation,
  requireAdmin,
  scoreShoe
};

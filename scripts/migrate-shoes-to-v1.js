const fs = require("fs");

const dataPath = "data/shoes.json";
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

if (data.schema_version === "1.0") {
  console.log("data/shoes.json is already using schema 1.0. No migration needed.");
  process.exit(0);
}

const fitKnowledge = {
  "la sportiva solution": {
    width: "medium",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    heelFit: "structured performance heel",
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Powerful bouldering and sport shoe with a structured heel and aggressive shape."
  },
  "la sportiva theory": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "roman-square"],
    heelFit: "performance heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Very soft indoor and competition-style shoe for volumes, smears, and dynamic climbing."
  },
  "la sportiva mantra": {
    width: "medium",
    volume: "low-medium",
    toeShapes: ["egyptian", "roman-square"],
    heelFit: "slipper-style sensitive heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Extremely sensitive slipper for modern indoor climbing and friction-based movement."
  },
  "la sportiva tc pro": {
    width: "medium",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    heelFit: "supportive all-day heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Supportive flat shoe for edging, cracks, trad, and long outdoor routes."
  },
  "la sportiva miura": {
    width: "narrow",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    heelFit: "precise technical heel",
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Technical edging shoe for vertical and outdoor sport climbing."
  },
  "la sportiva katana lace": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    heelFit: "secure lace-adjustable heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Precise all-round outdoor shoe with strong edging support."
  },
  "la sportiva kubo": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "roman-square"],
    heelFit: "comfortable performance heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Approachable all-rounder for gym climbing, bouldering, and sport climbing."
  },
  "la sportiva finale": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "comfort-oriented heel",
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable beginner and all-day shoe with supportive construction."
  },
  "la sportiva tarantulace": {
    width: "medium-wide",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "forgiving beginner heel",
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Beginner-friendly gym and training shoe with forgiving fit."
  },
  "la sportiva mythos eco": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "comfort lace-adjustable heel",
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfort-focused trad and multipitch shoe."
  },
  "scarpa drago lv": {
    width: "narrow",
    volume: "low",
    toeShapes: ["egyptian", "roman-square"],
    heelFit: "low-volume performance heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Low-volume, very soft bouldering and competition shoe."
  },
  "scarpa instinct vs men's": {
    width: "medium-wide",
    volume: "medium-high",
    toeShapes: ["egyptian", "greek"],
    heelFit: "powerful heel for hooks",
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Powerful bouldering and sport shoe with strong support."
  },
  "scarpa instinct": {
    width: "medium-wide",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    heelFit: "secure performance heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Balanced performance shoe for bouldering and sport climbing."
  },
  "scarpa instinct vsr": {
    width: "medium-wide",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "secure softer-performance heel",
    sizing: { comfort: -1, performance: -1.5, aggressive: -2 },
    notes: "Softer Instinct variant for bouldering, indoor climbing, and sensitivity."
  },
  "scarpa vapor men's": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek"],
    heelFit: "versatile heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Versatile moderate shoe for sport climbing, edging, and gym use."
  },
  "scarpa vapor v lv": {
    width: "narrow",
    volume: "low",
    toeShapes: ["egyptian", "greek"],
    heelFit: "low-volume versatile heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Lower-volume versatile shoe with good edging and sport climbing range."
  },
  "scarpa helix men's new": {
    width: "medium",
    volume: "medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "comfort heel",
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable beginner and long-session shoe."
  },
  "scarpa origin woman": {
    width: "medium",
    volume: "low-medium",
    toeShapes: ["egyptian", "greek", "roman-square"],
    heelFit: "comfort beginner heel",
    sizing: { comfort: 0, performance: -0.5, aggressive: -1 },
    notes: "Comfortable entry-level shoe for gym climbing."
  },
  "scarpa veloce": {
    width: "wide",
    volume: "medium-high",
    toeShapes: ["roman-square", "egyptian"],
    heelFit: "roomier indoor-focused heel",
    sizing: { comfort: -0.5, performance: -1, aggressive: -1.5 },
    notes: "Soft and comfortable indoor shoe with a roomy forefoot."
  }
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function keyFor(shoe) {
  return `${shoe.brand} ${shoe.model}`.toLowerCase();
}

const migrated = {
  schema_version: "1.0",
  dataset_status: "Starter dataset. Official product specs are separated from advisor fit notes so accuracy and confidence can be tracked independently.",
  rating_scale: "1 low / 5 high",
  data_policy: {
    official_data: "Facts copied or summarized from official brand/product sources. Keep source URLs for each shoe.",
    advisor_fit_notes: "Manual fit interpretation from research, shop experience, demos, user feedback, or testing. Do not treat as official brand data.",
    confidence_levels: ["official", "researched", "tested", "estimated", "unknown"]
  },
  shoes: data.shoes.map((shoe) => {
    const fit = fitKnowledge[keyFor(shoe)] || {};
    const shopToeShapes = shoe.shop_toe_shape
      ? shoe.shop_toe_shape.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    return {
      id: slugify(`${shoe.brand}-${shoe.model}`),
      brand: shoe.brand,
      model: shoe.model,
      official_data: {
        gender_fit: shoe.gender_fit || "",
        closure: shoe.closure || "",
        rubber: {
          primary: shoe.rubber_type || "",
          thickness_mm: null
        },
        construction: {
          upper_material: "",
          vegan: null,
          lined: null
        },
        shape: {
          profile: shoe.profile || "",
          asymmetry: shoe.asymmetry || ""
        },
        performance_scores_1_to_5: {
          stiffness: Number(shoe.stiffness || 0),
          sensitivity: Number(shoe.sensitivity || 0),
          support: Number(shoe.support || 0)
        },
        use_scores_1_to_5: {
          bouldering: Number(shoe.bouldering || 0),
          sport: Number(shoe.sport || 0),
          indoor: Number(shoe.indoor || 0),
          outdoor: Number(shoe.outdoor || 0),
          trad: Number(shoe.trad || 0),
          multipitch: Number(shoe.multipitch || 0)
        },
        skill_scores_1_to_5: {
          beginner: Number(shoe.beginner || 0),
          intermediate: Number(shoe.intermediate || 0),
          advanced: Number(shoe.advanced || 0)
        },
        product_url: shoe.source_url || "",
        official_notes: shoe.official_notes || "",
        official_confidence: shoe.data_confidence || "unknown"
      },
      advisor_fit_notes: {
        foot_width: fit.width || shoe.shop_width || "unknown",
        foot_volume: fit.volume || shoe.shop_volume || "unknown",
        toe_shape_fit: fit.toeShapes || (shopToeShapes.length ? shopToeShapes : ["unknown"]),
        heel_fit: fit.heelFit || shoe.shop_heel_fit || "",
        sizing_offsets_eu: fit.sizing || {
          comfort: null,
          performance: null,
          aggressive: null
        },
        summary: fit.notes || shoe.shop_notes || "",
        source_type: fit.notes ? "estimated" : "unknown",
        fit_confidence: fit.notes ? "estimated" : "unknown",
        needs_validation: true
      }
    };
  })
};

fs.writeFileSync(dataPath, `${JSON.stringify(migrated, null, 2)}\n`);
console.log(`Migrated ${migrated.shoes.length} shoes to schema ${migrated.schema_version}.`);

const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const dryRun = process.argv.includes("--dry-run");

const catalogs = [
  {
    brand: "Ocún",
    baseUrl: "https://www.ocun.com",
    products: [
      ["Diamond S", "/product/diamond-s3"],
      ["Sigma", "/product/sigma6"],
      ["Fury", "/product/fury3"],
      ["Ozone", "/product/ozone3"],
      ["Ozone HV", "/product/ozone-hv3"],
      ["Havoc", "/product/havoc3"],
      ["Bullit", "/product/bullit3"],
      ["Iris", "/product/iris3"],
      ["Pearl 20th Anniversary", "/product/pearl-20th-anniversary3"],
      ["Jett Crack", "/product/jett-crack3"],
      ["Jett QC", "/product/jett-qc"],
      ["Jett LU", "/product/jett-lu"],
      ["Jett S", "/product/jett-s"],
      ["Advancer QC", "/product/advancer-qc3"],
      ["Advancer LU", "/product/advancer-lu3"],
      ["Striker QC", "/product/striker-qc3"],
      ["Striker LU", "/product/striker-lu3"],
      ["Ribbit", "/product/ribbit3"],
      ["Rental", "/product/rental4"]
    ]
  },
  {
    brand: "Mad Rock",
    baseUrl: "https://madrock.com",
    products: [
      ["Remora Pro HV", "/products/remora-pro-hv"],
      ["Remora Pro LV", "/products/remora-pro-lv"],
      ["Villain", "/products/villain"],
      ["D2.ONE LV", "/products/d2-one-lv"],
      ["D2.ONE HV", "/products/d2-one-hv"],
      ["Mad Monkey 3", "/products/mad-monkey-3"],
      ["Shark 3 LV", "/products/shark-3-lv"],
      ["Shark 3 HV", "/products/shark-3-0"],
      ["Talaria HV", "/products/talaria-hv"],
      ["Talaria LV", "/products/talaria-lv"],
      ["Drone 2 LV", "/products/drone-2-0-lv"],
      ["Drone 2 HV", "/products/drone-2-0-hv"],
      ["Rover", "/products/rover"],
      ["Drone CS LV", "/products/drone-cs-lv"],
      ["Drone CS HV", "/products/drone-cs-hv"],
      ["Remora LV", "/products/remora-lv"],
      ["RedLine Strap", "/products/redline-strap"],
      ["Remora HV", "/products/remora-hv"],
      ["Phoenix", "/products/phoenix-2019"]
    ]
  },
  {
    brand: "Butora",
    baseUrl: "https://butorausa.com",
    products: [
      ["Ibex", "/products/ibex"],
      ["Habara Knit Rental Shoe", "/products/habara-knit-rental-shoe"],
      ["Habara 3D Rental Shoe", "/products/habara-3d-rental-shoe"],
      ["Habara Markless Rental Shoe", "/products/habara-5-5mm"],
      ["Komet", "/products/komet"],
      ["Rubicon", "/products/rubicon"],
      ["Nix", "/products/nix"],
      ["Sierra Climbing Shoe", "/products/sierra-climbing-shoe"],
      ["Advance", "/products/advance-1"],
      ["Endeavor 2.0", "/products/endeavor"],
      ["Gomi", "/products/gomi-1"],
      ["Acro Comp", "/products/acro-comp"],
      ["Brava", "/products/brava-knit"],
      ["Brava Markless Rental Shoe", "/products/brava-markless-rental-shoe"]
    ]
  },
  {
    brand: "Unparallel",
    baseUrl: "https://www.unparallelsports.com",
    products: [
      ["UP-Grade Engage", "/product/up-grade-engage/"],
      ["Hold Up VCS Slipper", "/product/hold-up-vcs-slipper/"],
      ["UP Link W", "/product/up-link-w/"],
      ["Dust Up W", "/product/dust-up-w/"],
      ["UP Duel", "/product/up-duel/"],
      ["Hold Up Engage", "/product/hold-up-engage/"],
      ["UP Mocc", "/product/up-mocc/"],
      ["UP Mocc Yellow", "/product/up-mocc-yellow/"],
      ["Vim", "/product/vim/"],
      ["TN Pro", "/product/tn-pro/"],
      ["TN Pro LV", "/product/tn-pro-lv/"],
      ["Flagship", "/product/flagship/"],
      ["Flagship Women LV", "/product/flagship-women-lv/"],
      ["Flagship Pro", "/product/flagship-pro/"],
      ["Flagship Pro LV", "/product/flagship-pro-lv/"],
      ["Sirius", "/product/sirius/"],
      ["Sirius LV", "/product/sirius-lv/"],
      ["UP Pivot", "/product/up-pivot/"],
      ["Regulus", "/product/regulus/"],
      ["Regulus LV", "/product/regulus-lv/"],
      ["Souped UP", "/product/souped-up/"],
      ["Qubit", "/product/qubit/"],
      ["Qubit LV", "/product/qubit-lv/"],
      ["UP Virtu LV", "/product/up-virtu-lv/"],
      ["UP Virtu", "/product/up-virtu/"],
      ["UP Lift", "/product/up-lift/"],
      ["UP Beat 3", "/product/up-beat-3/"],
      ["UP Lace", "/product/up-lace/"],
      ["UP Lace LV", "/product/up-lace-lv/"],
      ["UP Float", "/product/up-float/"],
      ["TN Finity", "/product/tn-finity/"],
      ["UP Rise VCS", "/product/up-rise-vcs/"],
      ["UP Rise VCS LV", "/product/up-rise-vcs-lv/"],
      ["UP Rise Pro", "/product/up-rise-pro/"],
      ["Rock Guide", "/product/rock-guide/"]
    ]
  },
  {
    brand: "Evolv",
    baseUrl: "https://www.evolvsports.com",
    products: [
      ["2026 V6", "/2026-v6-66-0000062603"],
      ["2026 Zenist", "/2026-zenist-66-0000062605"],
      ["Defy Low Volume", "/defy-_low-volume_-66-0000062502"],
      ["Defy Medium Volume", "/defy-_medium-volume_-66-0000062501"],
      ["Defy", "/defy_-66-0000000055"],
      ["Evolv Adaptive Foot", "/evolv-adaptive-foot-_eaf_-66-0000003305"],
      ["Geshido", "/geshido-66-0000062110"],
      ["Kronos", "/kronos-66-0000002475"],
      ["Phantom", "/phantom-66-0000003645"],
      ["Phantom LV", "/phantom-lv-66-0000062210"],
      ["Phantom Pro", "/phantom-pro-66-0000062505"],
      ["Phantom Pro LV", "/phantom-pro-lv-66-0000062506"],
      ["Rave", "/rave-66-0000004105"],
      ["Shaman 2S", "/shaman-2s-66-0000062601"],
      ["Shaman", "/shaman-66-0000062203"],
      ["Shaman Lace", "/shaman-lace-66-0000062206"],
      ["Shaman Pro", "/shaman-pro-66-0000062301"],
      ["Shaman Pro LV", "/shaman-pro-lv-66-0000062302"],
      ["V6 Medium Volume", "/v6-_medium-volume_-66-0000062401"],
      ["Zenist Pro", "/zenist-pro-66-0000062305"]
    ]
  },
  {
    brand: "Tenaya",
    baseUrl: "https://tenaya.net",
    products: [
      ["Aruma", "/en/aruma"],
      ["Indalo", "/en/indalo"],
      ["Mastia", "/en/mastia"],
      ["Mundaka", "/en/mundaka"],
      ["Iati", "/en/iati"],
      ["Tarifa", "/en/tarifa"],
      ["Oasi", "/en/oasi"],
      ["Oasi LV", "/en/oasi-lv"],
      ["Masai", "/en/masai"],
      ["Araí", "/en/arai"],
      ["Tanta", "/en/tanta"],
      ["Tanta Green", "/en/tanta-green"],
      ["Tanta Laces", "/en/tanta-laces"],
      ["Tanta LX Green", "/en/tanta-lx-green"]
    ]
  }
];

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) return;

  for (const line of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

function requireEnv(name) {
  if (!process.env[name]) throw new Error(`Missing environment variable: ${name}`);
  return process.env[name];
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&reg;/gi, "®")
    .replace(/&trade;/gi, "™")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function pageText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).trim();
}

function metaContent(html, name) {
  const patterns = [
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, "i")
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return decodeHtml(match[1]).trim();
  }
  return "";
}

function firstMatch(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim();
  }
  return "";
}

function materialData(text) {
  const lower = text.toLowerCase();
  const vegan = /\bvegan\b|100%\s+synthetic\s+vegan/.test(lower);
  const synthetic = /\bsynthetic\b|microfiber|microfibre/.test(lower);
  const leather = /\bleather\b|suede/.test(lower);

  let materialCategory = "unknown";
  if (vegan) materialCategory = "vegan_materials";
  else if (synthetic && leather) materialCategory = "mixed";
  else if (synthetic) materialCategory = "synthetic_leather";
  else if (leather) materialCategory = "leather";

  return {
    material_category: materialCategory,
    upper_material: materialCategory === "synthetic_leather"
      ? "synthetic leather"
      : materialCategory === "vegan_materials"
        ? "vegan materials"
        : materialCategory,
    vegan: vegan ? true : materialCategory === "leather" ? false : null,
    lined: null
  };
}

function profileFrom(text) {
  const lower = text.toLowerCase();
  if (/aggressive|aggressively profiled|strongly downturned/.test(lower)) return "aggressive";
  if (/cambered|downturned|curved last/.test(lower)) return "moderate";
  if (/flat profile|flat last|neutral/.test(lower)) return "flat";
  return "unknown";
}

function volumeFrom(model, text) {
  const lower = `${model} ${text}`.toLowerCase();
  if (/\blv\b|low volume|narrow feet/.test(lower)) return "low";
  if (/medium volume/.test(lower)) return "medium";
  return "unknown";
}

function closureFrom(text) {
  const raw = firstMatch(text, [
    /Closure:\s*(.*?)(?=\s+(?:Rand|Vegan|Age Group|Weight|Upper|Sizes|Materials):|$)/i,
    /Closure System\s+(.*?)(?=\s+(?:Tongue|Lining|Insole|Midsole|Sole|Weight|Sizes|Advantages)\b)/i,
    /cierre\s+(velcro|cordones)/i
  ]).slice(0, 140);

  if (/draxtor/i.test(raw)) return "Velcro (Draxtor)";
  if (/velcro/i.test(raw)) return "Velcro";
  if (/lace|laces|cordones/i.test(raw)) return "Lace";
  if (/strap/i.test(raw)) return "Strap";
  if (/slip-on|slipper/i.test(raw)) return "Slipper";
  return "unknown";
}

function outsoleFrom(text) {
  const value = firstMatch(text, [
    /Outsole:\s*(.*?)(?=\s+(?:Sizes|Upper|Closure|Weight|Rand|Vegan|Age Group):|$)/i,
    /\bSole\b\s+(.*?)(?=\s+(?:Weight|Sizes|Advantages|Closure|Upper|Lining|Insole|Midsole)\b|$)/i
  ]);
  return value.slice(0, 120);
}

function rubberThickness(outsole) {
  const match = outsole.match(/(\d+(?:\.\d+)?)\s*mm/i);
  return match ? Number(match[1]) : null;
}

function rubberName(outsole) {
  return outsole
    .replace(/\b\d+(?:\.\d+)?\s*mm\b/gi, "")
    .replace(/\s+\./g, "")
    .replace(/^[- :]+|[- :]+$/g, "")
    .trim();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchProduct(brand, model, url) {
  let response;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 ClimbingShoeAdvisor/1.0 official-catalog-sync" }
    });

    if (response.ok || ![429, 500, 502, 503, 504].includes(response.status) || attempt === 4) break;
    await wait(attempt * 1500);
  }

  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  const html = await response.text();
  const text = pageText(html);
  const description = metaContent(html, "description")
    || metaContent(html, "og:description")
    || firstMatch(text, [new RegExp(`${model}\\s+(.{40,320}?)\\s+(?:€|\\$|Features|Specifications)`, "i")]);
  const specificationText = firstMatch(text, [
    /Specifications\s+([\s\S]{0,1800}?)(?:Reviews|EASY RETURNS|Related products|You may also like)/i,
    /Technical specifications\s+([\s\S]{0,1800}?)(?:Advantages|Related products|You may also like)/i,
    /Uppers\s+([\s\S]{0,1200}?)(?:Advantages|Related products|You may also like)/i
  ]) || text.slice(0, 8000);
  const outsole = outsoleFrom(specificationText);
  const volume = volumeFrom(model, text);

  return {
    id: slugify(`${brand}-${model}`),
    brand,
    model,
    official_data: {
      gender_fit: volume === "low" ? "Low volume" : volume === "medium" ? "Medium volume" : "Unisex / not specified",
      closure: closureFrom(specificationText) || "unknown",
      rubber: {
        primary: rubberName(outsole) || "unknown",
        thickness_mm: rubberThickness(outsole)
      },
      construction: materialData(specificationText),
      shape: {
        profile: profileFrom(`${description} ${text.slice(0, 5000)}`),
        asymmetry: "unknown"
      },
      performance_scores_1_to_5: {
        stiffness: 0,
        sensitivity: 0,
        support: 0
      },
      use_scores_1_to_5: {
        bouldering: 0,
        sport: 0,
        indoor: 0,
        outdoor: 0,
        trad: 0,
        multipitch: 0
      },
      skill_scores_1_to_5: {
        beginner: 0,
        intermediate: 0,
        advanced: 0
      },
      product_url: url,
      official_notes: description.slice(0, 600),
      official_confidence: "official",
      catalog_synced_at: new Date().toISOString()
    },
    advisor_fit_notes: {
      foot_width: "unknown",
      foot_volume: volume,
      toe_shape_fit: ["unknown"],
      heel_fit: "",
      sizing_offsets_eu: {
        comfort: null,
        performance: null,
        aggressive: null
      },
      summary: "",
      source_type: "unknown",
      fit_confidence: "unknown",
      needs_validation: true
    }
  };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

async function main() {
  loadLocalEnv();

  const products = catalogs.flatMap((catalog) =>
    catalog.products.map(([model, productPath]) => ({
      brand: catalog.brand,
      model,
      url: new URL(productPath, catalog.baseUrl).toString()
    }))
  );

  const failures = [];
  const rows = (await mapWithConcurrency(products, 2, async (product) => {
    try {
      const row = await fetchProduct(product.brand, product.model, product.url);
      console.log(`Prepared ${product.brand} ${product.model}`);
      return row;
    } catch (error) {
      failures.push(`${product.brand} ${product.model}: ${error.message}`);
      return null;
    }
  })).filter(Boolean);

  if (dryRun) {
    console.log(JSON.stringify({ rows, failures }, null, 2));
    return;
  }

  const supabase = createClient(
    requireEnv("SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );

  const { data: existing, error: readError } = await supabase
    .from("shoes")
    .select("id, advisor_fit_notes");
  if (readError) throw readError;

  const fitNotesById = new Map((existing || []).map((shoe) => [shoe.id, shoe.advisor_fit_notes]));
  const upsertRows = rows.map((row) => ({
    ...row,
    advisor_fit_notes: fitNotesById.get(row.id) || row.advisor_fit_notes
  }));

  const { error } = await supabase
    .from("shoes")
    .upsert(upsertRows, { onConflict: "id" });
  if (error) throw error;

  console.log(`Synced ${upsertRows.length} official shoe records to Supabase.`);
  if (failures.length) {
    console.warn(`Skipped ${failures.length} products:`);
    failures.forEach((failure) => console.warn(`- ${failure}`));
  }
}

main().catch((error) => {
  console.error("Official catalogue sync failed:");
  console.error(error.message || error);
  process.exit(1);
});

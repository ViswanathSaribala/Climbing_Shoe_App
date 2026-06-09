const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const dataPath = "data/shoes.local.json";
const envPath = ".env.local";

function loadLocalEnv() {
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

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

loadLocalEnv();

if (!fs.existsSync(dataPath)) {
  throw new Error(`Missing ${dataPath}. Keep your private seed data there and do not commit it.`);
}

const seed = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const rows = seed.shoes.map((shoe) => ({
  id: shoe.id,
  brand: shoe.brand,
  model: shoe.model,
  official_data: shoe.official_data || {},
  advisor_fit_notes: shoe.advisor_fit_notes || {}
}));

const supabase = createClient(
  requireEnv("SUPABASE_URL"),
  requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      persistSession: false
    }
  }
);

(async () => {
  const { error } = await supabase
    .from("shoes")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw new Error([
      error.message,
      error.details,
      error.hint,
      error.code
    ].filter(Boolean).join(" | "));
  }
  console.log(`Imported ${rows.length} shoes into Supabase.`);
})().catch((error) => {
  console.error("Import failed:");
  console.error(error.message || error);
  process.exit(1);
});

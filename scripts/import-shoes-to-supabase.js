const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const dataPath = "data/shoes.local.json";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

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

  if (error) throw error;
  console.log(`Imported ${rows.length} shoes into Supabase.`);
})();

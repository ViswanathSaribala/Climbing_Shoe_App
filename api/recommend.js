const { getSupabase, json, publicRecommendation, scoreShoe } = require("./_lib");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { error: "Method not allowed." });
  }

  try {
    const prefs = req.body || {};
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("shoes")
      .select("id, brand, model, official_data, advisor_fit_notes");

    if (error) throw error;

    const eligibleShoes = (data || []).filter((shoe) => {
      const construction = shoe.official_data?.construction || {};
      const upper = String(construction.upper_material || "").toLowerCase();
      const category = construction.material_category
        || (construction.vegan === true ? "vegan_materials" : null)
        || (upper.includes("synthetic") ? "synthetic_leather" : null)
        || (upper.includes("leather") ? "leather" : null);

      if (prefs.materialPreference === "vegan") return construction.vegan === true;
      if (prefs.materialPreference === "leather") return category === "leather" || category === "mixed";
      if (prefs.materialPreference === "synthetic") return category === "synthetic_leather" || category === "mixed";
      return true;
    });

    const matches = eligibleShoes
      .map((shoe) => scoreShoe(shoe, prefs))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const maxScore = matches[0]?.score || 1;
    return json(res, 200, {
      recommendations: matches.map((match) => publicRecommendation(match, maxScore, prefs))
    });
  } catch (error) {
    return json(res, 500, {
      error: "Could not generate recommendations.",
      detail: error.message
    });
  }
};

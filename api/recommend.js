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

    const matches = (data || [])
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

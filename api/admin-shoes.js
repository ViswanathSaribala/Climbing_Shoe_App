const { getSupabase, json, requireAdmin } = require("./_lib");

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

module.exports = async function handler(req, res) {
  if (!requireAdmin(req, res)) return;

  try {
    const supabase = getSupabase();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("shoes")
        .select("id, brand, model, official_data, advisor_fit_notes")
        .order("brand", { ascending: true })
        .order("model", { ascending: true });

      if (error) throw error;
      return json(res, 200, { shoes: data || [] });
    }

    if (req.method === "POST") {
      const { brand, model, official_data, advisor_fit_notes } = req.body || {};
      if (!brand || !model || !official_data || !advisor_fit_notes) {
        return json(res, 400, { error: "Missing brand, model, official_data, or advisor_fit_notes." });
      }

      const row = {
        id: req.body.id || slugify(`${brand}-${model}`),
        brand,
        model,
        official_data,
        advisor_fit_notes
      };

      const { data, error } = await supabase
        .from("shoes")
        .insert(row)
        .select("id, brand, model, official_data, advisor_fit_notes")
        .single();

      if (error) throw error;
      return json(res, 201, { shoe: data });
    }

    if (req.method === "PUT") {
      const { id, advisor_fit_notes } = req.body || {};
      if (!id || !advisor_fit_notes) {
        return json(res, 400, { error: "Missing id or advisor_fit_notes." });
      }

      const { data, error } = await supabase
        .from("shoes")
        .update({ advisor_fit_notes, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select("id, brand, model, official_data, advisor_fit_notes")
        .single();

      if (error) throw error;
      return json(res, 200, { shoe: data });
    }

    return json(res, 405, { error: "Method not allowed." });
  } catch (error) {
    return json(res, 500, {
      error: "Admin shoe request failed.",
      detail: error.message
    });
  }
};

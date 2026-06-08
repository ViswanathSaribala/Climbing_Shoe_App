const tokenInput = document.querySelector("#admin-token");
const loadButton = document.querySelector("#load-shoes");
const loginPanel = document.querySelector("#login-panel");
const workspace = document.querySelector("#admin-workspace");
const shoeSearch = document.querySelector("#shoe-search");
const shoeList = document.querySelector("#shoe-list");
const editorEmpty = document.querySelector("#editor-empty");
const editorForm = document.querySelector("#shoe-editor");
const editorHeading = document.querySelector("#editor-heading");
const officialData = document.querySelector("#official-data");
const toast = document.querySelector("#toast");

let shoes = [];
let selectedShoe = null;

const savedToken = sessionStorage.getItem("advisor_admin_token");
if (savedToken) tokenInput.value = savedToken;

function notify(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(notify.timer);
  notify.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function adminHeaders() {
  return {
    "Authorization": `Bearer ${tokenInput.value.trim()}`,
    "Content-Type": "application/json"
  };
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      ...adminHeaders(),
      ...(options.headers || {})
    }
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || "Request failed.");
  return payload;
}

function flatOfficialRows(shoe) {
  const official = shoe.official_data || {};
  const rubber = official.rubber || {};
  const shape = official.shape || {};
  const performance = official.performance_scores_1_to_5 || {};
  const use = official.use_scores_1_to_5 || {};
  const skill = official.skill_scores_1_to_5 || {};

  return [
    ["Closure", official.closure],
    ["Gender fit", official.gender_fit],
    ["Rubber", rubber.primary],
    ["Profile", shape.profile],
    ["Asymmetry", shape.asymmetry],
    ["Stiff / Sensitive / Support", `${performance.stiffness}/5 · ${performance.sensitivity}/5 · ${performance.support}/5`],
    ["Boulder / Sport", `${use.bouldering}/5 · ${use.sport}/5`],
    ["Indoor / Outdoor", `${use.indoor}/5 · ${use.outdoor}/5`],
    ["Trad / Multipitch", `${use.trad}/5 · ${use.multipitch}/5`],
    ["Beginner / Intermediate / Advanced", `${skill.beginner}/5 · ${skill.intermediate}/5 · ${skill.advanced}/5`],
    ["Confidence", official.official_confidence],
    ["Official notes", official.official_notes],
    ["Product URL", official.product_url]
  ];
}

function renderShoeList() {
  const q = shoeSearch.value.trim().toLowerCase();
  const filtered = shoes.filter((shoe) =>
    `${shoe.brand} ${shoe.model}`.toLowerCase().includes(q)
  );

  shoeList.innerHTML = filtered.map((shoe) => `
    <button type="button" class="shoe-list-item ${selectedShoe?.id === shoe.id ? "active" : ""}" data-id="${shoe.id}">
      <strong>${shoe.brand} ${shoe.model}</strong>
      <span>${shoe.advisor_fit_notes?.fit_confidence || "unknown"} · ${shoe.advisor_fit_notes?.foot_width || "unknown"}</span>
    </button>
  `).join("");
}

function setCheckboxes(values = []) {
  editorForm.querySelectorAll("input[name='toe_shape_fit']").forEach((input) => {
    input.checked = values.includes(input.value);
  });
}

function selectShoe(id) {
  selectedShoe = shoes.find((shoe) => shoe.id === id);
  if (!selectedShoe) return;

  const fit = selectedShoe.advisor_fit_notes || {};
  const sizing = fit.sizing_offsets_eu || {};
  editorHeading.textContent = `${selectedShoe.brand} ${selectedShoe.model}`;
  officialData.innerHTML = flatOfficialRows(selectedShoe).map(([label, value]) => `
    <div>
      <dt>${label}</dt>
      <dd>${label === "Product URL" && value ? `<a href="${value}" target="_blank" rel="noreferrer">${value}</a>` : value || "-"}</dd>
    </div>
  `).join("");

  editorForm.elements.foot_width.value = fit.foot_width || "unknown";
  editorForm.elements.foot_volume.value = fit.foot_volume || "unknown";
  editorForm.elements.heel_fit.value = fit.heel_fit || "";
  editorForm.elements.fit_confidence.value = fit.fit_confidence || "unknown";
  editorForm.elements.source_type.value = fit.source_type || "unknown";
  editorForm.elements.comfort.value = sizing.comfort ?? "";
  editorForm.elements.performance.value = sizing.performance ?? "";
  editorForm.elements.aggressive.value = sizing.aggressive ?? "";
  editorForm.elements.summary.value = fit.summary || "";
  editorForm.elements.needs_validation.checked = Boolean(fit.needs_validation);
  setCheckboxes(fit.toe_shape_fit || ["unknown"]);

  editorEmpty.hidden = true;
  editorForm.hidden = false;
  renderShoeList();
}

function numberOrNull(value) {
  return value === "" ? null : Number(value);
}

function formToFitNotes() {
  const data = new FormData(editorForm);
  const toeShapes = data.getAll("toe_shape_fit");
  return {
    foot_width: data.get("foot_width"),
    foot_volume: data.get("foot_volume"),
    toe_shape_fit: toeShapes.length ? toeShapes : ["unknown"],
    heel_fit: data.get("heel_fit").trim(),
    sizing_offsets_eu: {
      comfort: numberOrNull(data.get("comfort")),
      performance: numberOrNull(data.get("performance")),
      aggressive: numberOrNull(data.get("aggressive"))
    },
    summary: data.get("summary").trim(),
    source_type: data.get("source_type"),
    fit_confidence: data.get("fit_confidence"),
    needs_validation: data.has("needs_validation")
  };
}

loadButton.addEventListener("click", async () => {
  try {
    loadButton.disabled = true;
    loadButton.textContent = "Loading...";
    sessionStorage.setItem("advisor_admin_token", tokenInput.value.trim());
    const payload = await api("/api/admin-shoes");
    shoes = payload.shoes || [];
    workspace.hidden = false;
    loginPanel.classList.add("compact-login");
    renderShoeList();
    notify(`Loaded ${shoes.length} shoes.`);
  } catch (error) {
    notify(error.message);
  } finally {
    loadButton.disabled = false;
    loadButton.textContent = "Load Shoes";
  }
});

shoeSearch.addEventListener("input", renderShoeList);

shoeList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-id]");
  if (button) selectShoe(button.dataset.id);
});

editorForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedShoe) return;

  try {
    const advisor_fit_notes = formToFitNotes();
    const payload = await api("/api/admin-shoes", {
      method: "PUT",
      body: JSON.stringify({
        id: selectedShoe.id,
        advisor_fit_notes
      })
    });
    selectedShoe = payload.shoe;
    shoes = shoes.map((shoe) => shoe.id === selectedShoe.id ? selectedShoe : shoe);
    renderShoeList();
    notify("Advisor notes saved.");
  } catch (error) {
    notify(error.message);
  }
});

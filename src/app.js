const form = document.querySelector("#advisor-form");
const resetButton = document.querySelector("#reset-button");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");

function getPrefs() {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function renderLoading() {
  resultCount.textContent = "Finding matches";
  results.className = "results-empty";
  results.textContent = "Scoring shoes against your foot profile and climbing preferences...";
}

function renderError(message) {
  resultCount.textContent = "Could not recommend";
  results.className = "results-empty";
  results.textContent = message;
}

function renderResults(recommendations) {
  if (!recommendations.length) {
    renderError("No recommendations were returned. Check that the database has shoes loaded.");
    return;
  }

  resultCount.textContent = `${recommendations.length} recommended shoes`;
  results.className = "results-list";
  results.innerHTML = recommendations.map((shoe, index) => `
    <article class="shoe-card">
      <div class="rank">#${index + 1}</div>
      <div class="shoe-card-main">
        <div class="shoe-card-head">
          <div>
            <h3>${shoe.brand} ${shoe.model}</h3>
            <p>${shoe.profile || "Profile unknown"} · ${shoe.rubber_type || "Rubber unknown"}</p>
          </div>
          <div class="match-score">${shoe.match_score}%</div>
        </div>
        <div class="meter" aria-label="Match score"><span style="width: ${shoe.match_score}%"></span></div>
        <dl class="quick-facts">
          <div><dt>Fit</dt><dd>${shoe.fit_width}, ${shoe.fit_volume}</dd></div>
          <div><dt>Feel</dt><dd>Stiff ${shoe.stiffness}/5 · Sensitive ${shoe.sensitivity}/5</dd></div>
          <div><dt>Size start</dt><dd>${shoe.size_start}</dd></div>
        </dl>
        <p class="advisor-note">${shoe.advisor_summary}</p>
        <div class="source-strip">
          <span>Official data: ${shoe.official_confidence}</span>
          <span>Fit notes: ${shoe.fit_confidence}${shoe.needs_validation ? " · needs validation" : ""}</span>
          ${shoe.official_source_url ? `<a href="${shoe.official_source_url}" target="_blank" rel="noreferrer">Official source</a>` : ""}
        </div>
        <ul class="reason-list">
          ${shoe.reasons.map((reason) => `<li>${reason}</li>`).join("")}
          ${shoe.cautions.map((caution) => `<li class="caution">${caution}</li>`).join("")}
        </ul>
      </div>
    </article>
  `).join("");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  renderLoading();

  try {
    const response = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(getPrefs())
    });

    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Recommendation request failed.");
    renderResults(payload.recommendations || []);
  } catch (error) {
    renderError(`${error.message} Make sure the API and Supabase environment variables are configured.`);
  }
});

resetButton.addEventListener("click", () => {
  form.reset();
  resultCount.textContent = "Ready when you are";
  results.className = "results-empty";
  results.textContent = "Answer the questions and the advisor will return private-database recommendations.";
});

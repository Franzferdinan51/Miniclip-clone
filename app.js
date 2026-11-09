const ORDER = ["Shooters", "Open World", "Racing", "Strategy", "Adventure", "Simulation", "Puzzle", "Arcade", "Sports"];
const HEAD_CLASS = {
  "Shooters": "shooters", "Open World": "openworld", "Racing": "racing",
  "Strategy": "strategy", "Adventure": "adventure", "Simulation": "simulation",
  "Puzzle": "puzzle", "Arcade": "arcade", "Sports": "sports"
};
const TYPE_LABEL = { ai: "AI Original", port: "Browser Port", remake: "Remake" };

let GAMES = [], SITE = {}, filter = "All", query = "";

const $ = (s) => document.querySelector(s);
const thumbOf = (g) => g.thumb || `assets/thumbs/${g.slug}-cover.jpg`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function cardHTML(g) {
  return `<article class="card" data-slug="${esc(g.slug)}" tabindex="0" role="button" aria-label="${esc(g.title)} — details">
    <div class="thumb" style="background-image:url('${esc(thumbOf(g))}')"></div>
    <div class="card-body">
      <h3>${esc(g.title)}</h3>
      <p>${esc(g.blurb)}</p>
      <div class="card-foot"><span class="dev">by ${esc(g.developer)}</span><span class="chip ${esc(g.type)}">${esc(TYPE_LABEL[g.type] || g.type)}</span></div>
    </div>
  </article>`;
}

function sectionHTML(cat, games) {
  return `<section class="section">
    <div class="section-head ${HEAD_CLASS[cat] || ""}"><h2>${esc(cat)}</h2><span class="count">${games.length} game${games.length === 1 ? "" : "s"}</span></div>
    <div class="grid">${games.map(cardHTML).join("")}</div>
  </section>`;
}

function matches(g) {
  if (filter === "Multiplayer" && !g.tags.includes("multiplayer") && !g.tags.includes("co-op") && !g.tags.includes("online")) return false;
  if (filter !== "All" && filter !== "Multiplayer" && g.category !== filter) return false;
  if (query) {
    const hay = `${g.title} ${g.blurb} ${g.developer} ${g.category} ${g.tags.join(" ")} ${g.madeWith}`.toLowerCase();
    if (!hay.includes(query)) return false;
  }
  return true;
}

function render() {
  const list = GAMES.filter(matches);
  const hero = GAMES.find((g) => g.featured);
  $("#hero-slot").innerHTML = (filter === "All" && !query && hero)
    ? `<div class="hero">
         <div class="hero-img" style="background-image:url('${esc(thumbOf(hero))}')"></div>
         <div class="hero-body">
           <h1>${esc(hero.title)}</h1>
           <p>${esc(hero.description)}</p>
           <p class="hero-meta">by <b>${esc(hero.developer)}</b> · ${esc(hero.madeWith)}</p>
           <a class="btn big" href="${esc(hero.playUrl)}" target="_blank" rel="noopener">▶ Play now</a>
         </div>
       </div>`
    : "";
  if (!list.length) {
    $("#games").innerHTML = `<div class="empty">No games match that search yet — try another word, or <a href="#submit">suggest it</a> and we'll add it.</div>`;
    return;
  }
  if (filter !== "All" || query) {
    $("#games").innerHTML = `<section class="section"><div class="section-head"><h2>${filter !== "All" ? esc(filter) : "Results"}</h2><span class="count">${list.length} game${list.length === 1 ? "" : "s"}</span></div><div class="grid">${list.map(cardHTML).join("")}</div></section>`;
    return;
  }
  $("#games").innerHTML = ORDER.map((cat) => {
    const gs = list.filter((g) => g.category === cat && !g.featured);
    return gs.length ? sectionHTML(cat, gs) : "";
  }).join("");
  bindCards();
}

function bindCards() {
  document.querySelectorAll(".card[data-slug]").forEach((el) => {
    el.addEventListener("click", () => openModal(el.dataset.slug));
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(el.dataset.slug); } });
  });
}

function renderPills() {
  const cats = ["All", ...ORDER, "Multiplayer"];
  $("#pills").innerHTML = cats.map((c) => {
    const n = c === "All" ? GAMES.length
      : c === "Multiplayer" ? GAMES.filter((g) => g.tags.includes("multiplayer") || g.tags.includes("co-op") || g.tags.includes("online")).length
      : GAMES.filter((g) => g.category === c).length;
    return `<button class="pill ${filter === c ? "active" : ""}" data-filter="${esc(c)}">${esc(c)}<span class="n">${n}</span></button>`;
  }).join("");
  document.querySelectorAll(".pill").forEach((p) =>
    p.addEventListener("click", () => { filter = p.dataset.filter; renderPills(); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
}

function openModal(slug) {
  const g = GAMES.find((x) => x.slug === slug);
  if (!g) return;
  $("#modal-thumb").src = thumbOf(g);
  $("#modal-thumb").alt = g.title;
  const badge = $("#modal-badge");
  badge.textContent = g.badge || TYPE_LABEL[g.type] || "";
  badge.className = "chip " + g.type;
  $("#modal-title").textContent = g.title;
  $("#modal-desc").textContent = g.description;
  $("#modal-dev").innerHTML = `<a href="${esc(g.developerUrl)}" target="_blank" rel="noopener">${esc(g.developer)} ↗</a>`;
  $("#modal-made").textContent = g.madeWith;
  $("#modal-orig-row").style.display = g.originalBy ? "" : "none";
  $("#modal-orig").textContent = g.originalBy || "";
  $("#modal-cat").textContent = g.category;
  $("#modal-tags").textContent = g.tags.join(" · ");
  $("#modal-play").href = g.playUrl;
  $("#modal-devlink").href = g.developerUrl;
  $("#modal-backdrop").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeModal() {
  $("#modal-backdrop").hidden = true;
  document.body.style.overflow = "";
}
$("#modal-close").addEventListener("click", closeModal);
$("#modal-backdrop").addEventListener("click", (e) => { if (e.target.id === "modal-backdrop") closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
$("#search").addEventListener("input", (e) => { query = e.target.value.trim().toLowerCase(); render(); });

fetch("games.json")
  .then((r) => r.json())
  .then((data) => {
    GAMES = data.games; SITE = data.site || {};
    $("#site-about").textContent = SITE.about || "";
    renderPills(); render();
  })
  .catch(() => { $("#games").innerHTML = `<div class="empty">The game shelf failed to load — please refresh.</div>`; });

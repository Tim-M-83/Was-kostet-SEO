/* ============================================================
   Was kostet SEO? – SEO-Leistungs-Rechner
   Mediencenter Essen – https://mediencenteressen.com/
   Reines Vanilla-JS, keine Abhängigkeiten. Alle Berechnungen
   laufen ausschließlich im Browser des Nutzers.
   ============================================================ */

/* ---- Die 7 SEO-Leistungen ---- */
const SERVICES = {
  audit:    { name: "SEO-Analyse / Audit",     desc: "Bestandsaufnahme von Technik, Inhalten und Struktur." },
  keyword:  { name: "Keyword-Recherche",       desc: "Herausfinden, wonach Ihre Kunden tatsächlich suchen." },
  onpage:   { name: "OnPage-Optimierung",      desc: "Titel, Meta-Texte, Überschriften, interne Links & Struktur." },
  technik:  { name: "Technische SEO",          desc: "Ladezeiten, mobile Darstellung, Indexierung, Core Web Vitals." },
  content:  { name: "Content-Erstellung",      desc: "Leistungsseiten, Landingpages, Ratgeber & FAQ-Inhalte." },
  lokal:    { name: "Lokale SEO",              desc: "Sichtbarkeit in Ihrer Stadt/Region & Google Unternehmensprofil." },
  laufend:  { name: "Laufende SEO-Betreuung",  desc: "Monitoring, neue Inhalte und kontinuierliche Optimierung." }
};

/* ---- Fragen ----
   Jede Antwort liefert:
   - scores: Punkte je Leistung (steuert Priorität Muss/Sollte/Kann)
   - effekte für die Preislogik über die ausgewählten value-Codes
*/
const QUESTIONS = [
  {
    id: "projekt",
    title: "Welche Art von Webseite möchten Sie optimieren?",
    help: "Die Art des Projekts hat den größten Einfluss auf Aufwand und Kosten.",
    options: [
      { value: "lokal",   title: "Lokales Unternehmen / Handwerk / Praxis", desc: "Sie gewinnen Kunden vor allem aus Ihrer Stadt oder Region.",
        scores: { lokal: 3, onpage: 2, content: 1, audit: 1 } },
      { value: "kmu",     title: "Unternehmen mit mehreren Leistungen", desc: "Mehrere Dienstleistungen, regionales oder überregionales Wachstum.",
        scores: { content: 2, onpage: 2, keyword: 2, laufend: 2, audit: 1 } },
      { value: "shop",    title: "Onlineshop (z. B. WooCommerce)", desc: "Sie verkaufen Produkte online über einen Shop.",
        scores: { technik: 3, content: 2, onpage: 2, laufend: 3, keyword: 1 } },
      { value: "neu",     title: "Neue Webseite / Start bei null", desc: "Die Seite ist neu oder es gibt noch kaum Inhalte und Rankings.",
        scores: { content: 3, onpage: 2, keyword: 2, audit: 1 } }
    ]
  },
  {
    id: "zustand",
    title: "Wie ist der aktuelle Zustand Ihrer Webseite?",
    help: "Je weniger Grundlage vorhanden ist, desto mehr Basisarbeit fällt an.",
    options: [
      { value: "keine",  title: "Neu oder noch keine Webseite", desc: "Es muss vieles erst aufgebaut werden.",
        scores: { content: 3, onpage: 2, technik: 2, audit: 1 } },
      { value: "kaum",   title: "Vorhanden, wird aber kaum gefunden", desc: "Die Seite existiert, rankt aber nicht für relevante Begriffe.",
        scores: { audit: 3, onpage: 2, content: 2, technik: 1 } },
      { value: "solide", title: "Solide aufgestellt", desc: "Die Seite läuft gut, soll aber gezielt verbessert werden.",
        scores: { laufend: 2, keyword: 1, content: 1, audit: 1 } }
    ]
  },
  {
    id: "reichweite",
    title: "Wo möchten Sie gefunden werden?",
    help: "Lokale, regionale oder bundesweite Sichtbarkeit erfordern unterschiedliche Strategien.",
    options: [
      { value: "lokal",  title: "Lokal – in meiner Stadt/Umgebung", desc: "z. B. „Dienstleister in Essen“.",
        scores: { lokal: 3, onpage: 1 } },
      { value: "regio",  title: "Regional – im weiteren Umkreis", desc: "Mehrere Städte oder eine ganze Region.",
        scores: { lokal: 2, content: 1, keyword: 1 } },
      { value: "national", title: "Deutschlandweit", desc: "Bundesweite Sichtbarkeit, meist mehr Wettbewerb.",
        scores: { content: 2, keyword: 2, laufend: 2, technik: 1 } }
    ]
  },
  {
    id: "wettbewerb",
    title: "Wie stark ist der Wettbewerb in Ihrer Branche?",
    help: "Mehr Wettbewerb bedeutet in der Regel mehr Aufwand für gute Platzierungen.",
    options: [
      { value: "gering", title: "Eher gering", desc: "Wenige Mitbewerber kämpfen online um Sichtbarkeit.",
        scores: { onpage: 1 } },
      { value: "mittel", title: "Mittel", desc: "Einige aktive Mitbewerber in den Suchergebnissen.",
        scores: { keyword: 1, content: 1, laufend: 1 } },
      { value: "stark",  title: "Stark umkämpft", desc: "Viele Mitbewerber betreiben aktiv SEO.",
        scores: { content: 2, laufend: 3, keyword: 2, technik: 1 } }
    ]
  },
  {
    id: "inhalte",
    title: "Wie viele gute Inhalte hat Ihre Webseite bereits?",
    help: "Inhalte sind die Grundlage dafür, für welche Suchbegriffe Sie gefunden werden.",
    options: [
      { value: "kaum",   title: "Kaum Inhalte", desc: "Im Wesentlichen nur Startseite und Kontakt.",
        scores: { content: 3, onpage: 2, keyword: 1 } },
      { value: "einige", title: "Einige Inhalte", desc: "Ein paar Leistungsseiten sind vorhanden.",
        scores: { content: 2, onpage: 1 } },
      { value: "viele",  title: "Viele gute Inhalte", desc: "Umfangreiche, hochwertige Seiten/Artikel vorhanden.",
        scores: { onpage: 1, laufend: 1, keyword: 1 } }
    ]
  },
  {
    id: "technik",
    title: "Wie schätzen Sie den technischen Zustand ein?",
    help: "Technische Fehler können die Sichtbarkeit deutlich ausbremsen.",
    options: [
      { value: "unklar",  title: "Weiß ich nicht", desc: "Ladezeiten, Mobile & Indexierung sind unklar.",
        scores: { audit: 3, technik: 2 } },
      { value: "probleme",title: "Es gibt bekannte Probleme", desc: "z. B. langsame Seite, Fehler oder schlechte mobile Darstellung.",
        scores: { technik: 3, audit: 2 } },
      { value: "sauber",  title: "Technisch sauber", desc: "Schnell, mobil optimiert und sauber indexiert.",
        scores: { content: 1, onpage: 1 } }
    ]
  },
  {
    id: "ziel",
    title: "Was ist Ihr Ziel?",
    help: "Bestimmt, ob eher eine einmalige Optimierung oder laufende Betreuung sinnvoll ist.",
    options: [
      { value: "basis", title: "Erst einmal eine solide Basis schaffen", desc: "Grundlegende Fehler beheben, sauberes Fundament legen.",
        scores: { audit: 2, onpage: 2, technik: 2 } },
      { value: "wachsen", title: "Langfristig sichtbar werden & wachsen", desc: "Kontinuierlich mehr Anfragen und Sichtbarkeit aufbauen.",
        scores: { laufend: 3, content: 2, keyword: 1 } }
    ]
  }
];

/* ============================================================
   State
   ============================================================ */
const answers = {};          // id -> selectedOption
let current = 0;

const qArea = document.getElementById("questionArea");
const btnNext = document.getElementById("btnNext");
const btnBack = document.getElementById("btnBack");
const progressFill = document.getElementById("progressFill");
const stepNow = document.getElementById("stepNow");
const stepTotal = document.getElementById("stepTotal");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");

stepTotal.textContent = QUESTIONS.length;

/* ============================================================
   Rendering
   ============================================================ */
function renderQuestion() {
  const q = QUESTIONS[current];
  const chosen = answers[q.id];

  qArea.innerHTML = `
    <div class="question">
      <h2>${q.title}</h2>
      <p class="q-help">${q.help}</p>
      <div class="options" role="radiogroup" aria-label="${q.title}">
        ${q.options.map((opt, i) => `
          <label class="option ${chosen && chosen.value === opt.value ? "selected" : ""}">
            <input type="radio" name="${q.id}" value="${opt.value}" ${chosen && chosen.value === opt.value ? "checked" : ""} />
            <span class="opt-text">
              <span class="opt-title">${opt.title}</span>
              <span class="opt-desc">${opt.desc}</span>
            </span>
          </label>
        `).join("")}
      </div>
    </div>
  `;

  qArea.querySelectorAll("input[type=radio]").forEach(input => {
    input.addEventListener("change", () => {
      const opt = q.options.find(o => o.value === input.value);
      answers[q.id] = opt;
      qArea.querySelectorAll(".option").forEach(l => l.classList.remove("selected"));
      input.closest(".option").classList.add("selected");
      btnNext.disabled = false;
    });
  });

  // Nav state
  btnNext.disabled = !answers[q.id];
  btnNext.textContent = current === QUESTIONS.length - 1 ? "Ergebnis anzeigen" : "Weiter";
  btnBack.style.visibility = current === 0 ? "hidden" : "visible";

  // Progress
  const pct = Math.round(((current) / QUESTIONS.length) * 100);
  progressFill.style.width = pct + "%";
  stepNow.textContent = current + 1;
}

btnNext.addEventListener("click", () => {
  if (!answers[QUESTIONS[current].id]) return;
  if (current < QUESTIONS.length - 1) {
    current++;
    renderQuestion();
    quizEl.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    showResult();
  }
});

btnBack.addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

/* ============================================================
   Auswertung
   ============================================================ */
function computeScores() {
  const totals = {};
  Object.keys(SERVICES).forEach(k => totals[k] = 0);
  QUESTIONS.forEach(q => {
    const a = answers[q.id];
    if (a && a.scores) {
      Object.entries(a.scores).forEach(([k, v]) => { totals[k] += v; });
    }
  });
  // Audit ist immer mindestens relevant
  if (totals.audit < 2) totals.audit = 2;
  return totals;
}

function priorityFor(score) {
  if (score >= 5) return "muss";
  if (score >= 2) return "sollte";
  return "kann";
}

const PRIO_META = {
  muss:   { label: "Muss", order: 0, cls: "is-muss",   badge: "badge-muss" },
  sollte: { label: "Sollte", order: 1, cls: "is-sollte", badge: "badge-sollte" },
  kann:   { label: "Kann", order: 2, cls: "is-kann",   badge: "badge-kann" }
};

/* Preislogik – Richtwerte aus realistischen Branchenspannen */
function computePrice() {
  const projekt = answers.projekt.value;
  const zustand = answers.zustand.value;
  const wettbewerb = answers.wettbewerb.value;
  const ziel = answers.ziel.value;
  const reichweite = answers.reichweite.value;

  // Monatliche Basis-Spanne nach Projektart
  let monthly;
  if (projekt === "lokal") monthly = [500, 1500];
  else if (projekt === "neu") monthly = [500, 1500];
  else if (projekt === "kmu") monthly = [1000, 3000];
  else monthly = [2000, 4000]; // shop

  // Einmalige Spanne (Analyse + Basis-Optimierung) nach Zustand
  let once;
  if (zustand === "solide") once = [300, 1200];
  else if (zustand === "kaum") once = [750, 2500];
  else once = [1000, 3000]; // keine / Neuaufbau

  // Aufschläge für Wettbewerb & Reichweite
  let factor = 1;
  if (wettbewerb === "mittel") factor += 0.15;
  if (wettbewerb === "stark") factor += 0.4;
  if (reichweite === "national") factor += 0.2;

  monthly = monthly.map(v => Math.round((v * factor) / 50) * 50);
  once = once.map(v => Math.round((v * factor) / 50) * 50);

  return { monthly, once, projekt, ziel };
}

function euro(n) { return n.toLocaleString("de-DE") + " €"; }

function showResult() {
  progressFill.style.width = "100%";

  // Leistungen
  const totals = computeScores();
  const items = Object.keys(SERVICES).map(key => {
    const prio = priorityFor(totals[key]);
    return { key, prio, score: totals[key], ...SERVICES[key], ...PRIO_META[prio] };
  });
  // Sortierung: Priorität, dann Score absteigend
  items.sort((a, b) => a.order - b.order || b.score - a.score);

  const list = document.getElementById("serviceList");
  list.innerHTML = items.map(it => `
    <li class="service-item ${it.cls}">
      <span class="badge ${it.badge}">${it.label}</span>
      <div>
        <p class="service-title">${it.name}</p>
        <p class="service-reason">${it.desc}</p>
      </div>
    </li>
  `).join("");

  // Preise
  const { monthly, once, projekt, ziel } = computePrice();
  document.getElementById("priceOnce").textContent = euro(once[0]) + " – " + euro(once[1]);
  document.getElementById("priceMonthly").textContent = euro(monthly[0]) + " – " + euro(monthly[1]);

  let hint;
  if (ziel === "basis") {
    hint = "Für Ihr Ziel steht zunächst die einmalige Optimierung im Vordergrund. Eine laufende Betreuung können Sie später ergänzen.";
  } else if (projekt === "shop") {
    hint = "Onlineshops haben viele technische und inhaltliche Stellschrauben – hier zahlt sich eine laufende Betreuung meist besonders aus.";
  } else {
    hint = "Für nachhaltiges Wachstum empfiehlt sich nach der Basis eine laufende monatliche Betreuung.";
  }
  document.getElementById("priceHint").textContent = hint;

  // Anzeige umschalten
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  resultEl.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("btnRestart").addEventListener("click", () => {
  current = 0;
  Object.keys(answers).forEach(k => delete answers[k]);
  resultEl.classList.add("hidden");
  quizEl.classList.remove("hidden");
  renderQuestion();
  quizEl.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Init */
renderQuestion();

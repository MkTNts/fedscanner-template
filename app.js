/* ---------------------------------------------------------------------------
   FedScanner Template — scan engine

   Everything personal lives in two places, both of them in YOUR browser:

     localStorage["fedscanner_tpl_key"]     your USAJOBS API key
     localStorage["fedscanner_tpl_email"]   your registered email
     localStorage["fedscanner_tpl_profile"] your search criteria
     localStorage["fedscanner_tpl_resume"]  your master resume text

   Nothing here is baked into the source. Ship this repo to anyone; it carries
   no credentials and no one else's criteria.
--------------------------------------------------------------------------- */

const LS = "fedscanner_tpl_";
const PER_PAGE = 100;
const MAX_PAGES = 20;

/* --------------------------- default criteria --------------------------- */

const DEFAULT_PROFILE = {
  profileName: "Untitled profile",
  location: "",
  minSalary: 30000,
  excludeHourly: true,
  series: [
    { code: "0343", lbl: "Management & program analysis" },
    { code: "0301", lbl: "Misc administration & program" },
    { code: "0201", lbl: "Human resources management" }
  ],
  keywords: ["program analyst"],
  profileKeywords: ["program", "analyst", "management", "planning", "operations"],
  preferredOrgs: [],
  excludeTitles: [],
  excludeSummary: ["phd required", "doctoral degree", "juris doctor", "medical degree"],
  excludeFields: [],
  relocationPhrases: [
    "relocation expense", "relocation authorized", "relocation incentive",
    "relocation reimburs", "permanent change of station", "moving expense",
    "pcs authorized"
  ],
  locationSignals: [],
  scoring: {
    relocation: 20,
    titleKeyword: 6,
    titleKeywordMax: 30,
    summaryKeyword: 2,
    summaryKeywordMax: 20,
    preferredOrg: 15,
    locationMatch: 20,
    hiddenLocationSignal: 15
  }
};

/* ------------------------------- helpers -------------------------------- */

const el = (id) => document.getElementById(id);
const num = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);

function eH(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function toLines(text) {
  return String(text || "").split("\n").map((l) => l.trim()).filter(Boolean);
}

function showIn(group, id, text) {
  group.forEach((i) => el(i).classList.remove("on"));
  el(id).classList.add("on");
  el(id + "T").textContent = text;
}

const SCAN_MSGS = ["mE", "mO", "mW", "mI"];
const showMsg = (id, t) => showIn(SCAN_MSGS, id, t);
const clrM = () => SCAN_MSGS.forEach((i) => el(i).classList.remove("on"));

/* ----------------------------- credentials ------------------------------ */

function getCreds() {
  return {
    key: localStorage.getItem(LS + "key") || "",
    email: localStorage.getItem(LS + "email") || ""
  };
}

function saveCreds() {
  const key = el("apiKey").value.trim();
  const email = el("apiEmail").value.trim();
  if (key) localStorage.setItem(LS + "key", key); else localStorage.removeItem(LS + "key");
  if (email) localStorage.setItem(LS + "email", email); else localStorage.removeItem(LS + "email");
  return { key, email };
}

function clearCreds() {
  localStorage.removeItem(LS + "key");
  localStorage.removeItem(LS + "email");
  el("apiKey").value = "";
  el("apiEmail").value = "";
  showIn(["cE", "cO", "cI"], "cI", "Credentials cleared from this browser.");
}

// Credentials ride as headers, never as query-string values, so they cannot
// end up in a server access log or a browser history entry.
function authHeaders() {
  const c = getCreds();
  const h = {};
  if (c.key) h["x-usajobs-key"] = c.key;
  if (c.email) h["x-usajobs-email"] = c.email;
  return h;
}

async function testConnection() {
  const { key, email } = saveCreds();
  const btn = el("testBtn");
  btn.disabled = true;
  btn.innerHTML = `<i class="ti ti-loader"></i> Testing…`;
  try {
    const res = await fetch("/api/scan?Keyword=analyst&ResultsPerPage=1", { headers: authHeaders() });
    const body = await res.json();
    if (!res.ok) throw new Error(body.error || `HTTP ${res.status}`);
    const total = body?.SearchResult?.SearchResultCountAll ?? "an unknown number of";
    const via = key && email ? "your saved key" : "the server's own credentials";
    showIn(["cE", "cO", "cI"], "cO", `Connected using ${via}. USAJOBS reports ${total} matching postings for a test query.`);
  } catch (e) {
    showIn(["cE", "cO", "cI"], "cE", `${e.message}`);
  }
  btn.disabled = false;
  btn.innerHTML = `<i class="ti ti-plug-connected"></i> Save and test connection`;
}

/* ------------------------------- profile -------------------------------- */

function getProfile() {
  const base = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  try {
    const raw = localStorage.getItem(LS + "profile");
    if (!raw) return base;
    const saved = JSON.parse(raw);
    return { ...base, ...saved, scoring: { ...base.scoring, ...(saved.scoring || {}) } };
  } catch (e) {
    return base;
  }
}

function putProfile(p) {
  localStorage.setItem(LS + "profile", JSON.stringify(p));
}

function renderProfileForm() {
  const p = getProfile();
  el("pName").value = p.profileName || "";
  el("pLoc").value = p.location || "";
  el("pMinSal").value = p.minSalary ?? 0;
  el("pHourly").checked = !!p.excludeHourly;
  el("pSeries").value = (p.series || []).map((s) => `${s.code} ${s.lbl || ""}`.trim()).join("\n");
  el("pKeywords").value = (p.keywords || []).join("\n");
  el("pProfileKw").value = (p.profileKeywords || []).join("\n");
  el("pOrgs").value = (p.preferredOrgs || []).join("\n");
  el("pReloc").value = (p.relocationPhrases || []).join("\n");
  el("pSignals").value = (p.locationSignals || []).join("\n");
  el("pExTitle").value = (p.excludeTitles || []).join("\n");
  el("pExSumm").value = (p.excludeSummary || []).join("\n");
  el("pExField").value = (p.excludeFields || []).join("\n");
}

function saveProfileForm() {
  const series = [];
  const bad = [];
  for (const line of toLines(el("pSeries").value)) {
    const m = line.match(/^(\d{4})\s*(.*)$/);
    if (!m) { bad.push(line); continue; }
    series.push({ code: m[1], lbl: m[2] || `Series ${m[1]}` });
  }
  if (bad.length) {
    showIn(["sE", "sO"], "sE", `Could not read ${bad.length} series line(s): "${bad[0]}". Each line needs a four-digit code first, e.g. "0343 Management analysis".`);
    return;
  }
  const p = getProfile();
  Object.assign(p, {
    profileName: el("pName").value.trim() || "Untitled profile",
    location: el("pLoc").value.trim(),
    minSalary: num(el("pMinSal").value, 0),
    excludeHourly: el("pHourly").checked,
    series,
    keywords: toLines(el("pKeywords").value),
    profileKeywords: toLines(el("pProfileKw").value).map((k) => k.toLowerCase()),
    preferredOrgs: toLines(el("pOrgs").value).map((k) => k.toLowerCase()),
    relocationPhrases: toLines(el("pReloc").value).map((k) => k.toLowerCase()),
    locationSignals: toLines(el("pSignals").value).map((k) => k.toLowerCase()),
    excludeTitles: toLines(el("pExTitle").value),
    excludeSummary: toLines(el("pExSumm").value),
    excludeFields: toLines(el("pExField").value)
  });
  putProfile(p);
  const searches = p.series.length + p.keywords.length;
  showIn(["sE", "sO"], "sO", `Saved "${p.profileName}". Next scan will run ${searches} search${searches === 1 ? "" : "es"}.`);
}

// Export deliberately rebuilds the object field by field. A credential can
// never ride along in an exported profile, even if one is added to storage
// later, because nothing but these keys is copied.
function exportProfile() {
  const p = getProfile();
  const safe = {
    profileName: p.profileName, location: p.location, minSalary: p.minSalary,
    excludeHourly: p.excludeHourly, series: p.series, keywords: p.keywords,
    profileKeywords: p.profileKeywords, preferredOrgs: p.preferredOrgs,
    excludeTitles: p.excludeTitles, excludeSummary: p.excludeSummary,
    excludeFields: p.excludeFields, relocationPhrases: p.relocationPhrases,
    locationSignals: p.locationSignals, scoring: p.scoring
  };
  const blob = new Blob([JSON.stringify(safe, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(safe.profileName || "profile").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
  showIn(["pE", "pO"], "pO", "Profile exported. It contains no API key, so it is safe to share.");
}

async function importProfile(ev) {
  const file = ev.target.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("that file is not a profile object");
    }
    putProfile({ ...JSON.parse(JSON.stringify(DEFAULT_PROFILE)), ...parsed });
    renderProfileForm();
    showIn(["pE", "pO"], "pO", `Imported "${parsed.profileName || file.name}". Open the Criteria tab to review it.`);
  } catch (e) {
    showIn(["pE", "pO"], "pE", `Could not import: ${e.message}`);
  }
  ev.target.value = "";
}

function resetProfile() {
  localStorage.removeItem(LS + "profile");
  renderProfileForm();
  showIn(["pE", "pO"], "pO", "Criteria reset to the built-in example.");
}

/* ----------------------------- master resume ---------------------------- */

const STOPWORDS = new Set(`about above across after against along among around because
before behind below between both during each either from have here into itself more most
must neither other over same should since some such than that their them then there these
they this those through under until upon were what when where which while will with within
without would your yours ability able also amount another applicant applicants applied apply
been being candidate candidates department division duties employee employees experience
form full incumbent individual information job knowledge level like made make many may
minimum non number office official one part per performs position positions provide
provides related requirement requirements responsible role serve serves shall skill skills
time using various very work working works year years`.split(/\s+/));

function extractKeywords(text, limit = 45) {
  const counts = new Map();
  for (const raw of String(text).toLowerCase().match(/[a-z][a-z0-9+#.\-/]{3,}/g) || []) {
    const word = raw.replace(/[.\-/]+$/, "");
    if (word.length < 4 || word.length > 24) continue;
    if (STOPWORDS.has(word)) continue;
    if (/^\d/.test(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

function saveResume() {
  localStorage.setItem(LS + "resume", el("resumeText").value);
}

async function handleResumeFile(ev) {
  const file = ev.target.files?.[0];
  if (!file) return;
  showIn(["rE", "rO"], "rO", `Reading ${file.name}…`);
  try {
    let text;
    if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") {
      text = await readPdf(file);
    } else {
      text = await file.text();
    }
    if (!text.trim()) throw new Error("no readable text found — if this is a scanned PDF, paste the text instead");
    el("resumeText").value = text;
    saveResume();
    showIn(["rE", "rO"], "rO", `Loaded ${text.length.toLocaleString()} characters from ${file.name}.`);
  } catch (e) {
    showIn(["rE", "rO"], "rE", `Could not read that file: ${e.message}`);
  }
  ev.target.value = "";
}

// pdf.js is loaded on demand, so the page costs nothing extra unless someone
// actually uploads a PDF.
let pdfLibPromise = null;
function loadPdfLib() {
  if (pdfLibPromise) return pdfLibPromise;
  pdfLibPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      const lib = window.pdfjsLib;
      if (!lib) return reject(new Error("pdf.js loaded but did not register"));
      lib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      resolve(lib);
    };
    s.onerror = () => reject(new Error("could not reach the pdf.js CDN — paste the text instead"));
    document.head.appendChild(s);
  });
  return pdfLibPromise;
}

async function readPdf(file) {
  const lib = await loadPdfLib();
  const doc = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const content = await (await doc.getPage(i)).getTextContent();
    pages.push(content.items.map((it) => it.str).join(" "));
  }
  return pages.join("\n");
}

let kwCandidates = [];
let kwSelected = new Set();

function extractResumeKeywords() {
  const text = el("resumeText").value;
  if (!text.trim()) {
    showIn(["rE", "rO"], "rE", "Add a resume first — upload a file or paste the text above.");
    return;
  }
  kwCandidates = extractKeywords(text);
  if (!kwCandidates.length) {
    showIn(["rE", "rO"], "rE", "No repeated terms found. A longer resume gives better suggestions.");
    return;
  }
  const existing = new Set(getProfile().profileKeywords || []);
  kwSelected = new Set(kwCandidates.filter((c) => existing.has(c.word)).map((c) => c.word));
  renderKwChips();
  el("kwPick").style.display = "block";
  showIn(["rE", "rO"], "rO", `Found ${kwCandidates.length} repeated terms. Tap the ones that describe your actual work.`);
}

function renderKwChips() {
  el("kwChips").innerHTML = kwCandidates.map((c) =>
    `<span class="chip${kwSelected.has(c.word) ? " on" : ""}" onclick="toggleKw('${eH(c.word)}')">${eH(c.word)}<span class="n">${c.count}</span></span>`
  ).join("");
}

function toggleKw(word) {
  if (kwSelected.has(word)) kwSelected.delete(word); else kwSelected.add(word);
  renderKwChips();
}

function applyResumeKeywords(replace) {
  if (!kwSelected.size) {
    showIn(["rE", "rO"], "rE", "Select at least one keyword first.");
    return;
  }
  const p = getProfile();
  const picked = [...kwSelected];
  p.profileKeywords = replace ? picked : [...new Set([...(p.profileKeywords || []), ...picked])];
  putProfile(p);
  renderProfileForm();
  showIn(["rE", "rO"], "rO",
    `${replace ? "Replaced" : "Added"} — your criteria now carry ${p.profileKeywords.length} scoring keywords.`);
}

/* ------------------------------ scan engine ----------------------------- */

let allResults = [];
let debugLog = [];
let showDbg = false;
let aborted = false;

function switchTab(name) {
  ["setup", "prof", "scan"].forEach((t) => {
    el(`panel-${t}`).classList.toggle("active", t === name);
    el(`tab-${t}`).classList.toggle("active", t === name);
  });
  window.scrollTo(0, 0);
}

function setProg(cur, tot, lbl) {
  el("prog").classList.add("on");
  el("pT").textContent = lbl;
  el("pC").textContent = `${cur}/${tot}`;
  el("pF").style.width = `${(cur / tot) * 100}%`;
}
const hideProg = () => el("prog").classList.remove("on");

function updS(fetched, unique, filtered, passed) {
  [["m1", "n1", fetched], ["m2", "n2", unique], ["m3", "n3", filtered], ["m4", "n4", passed]]
    .forEach(([m, n, v]) => { el(m).classList.add("on"); el(n).textContent = v; });
}

function locationConsistent(job, locFilter) {
  if (!locFilter) return true;
  const locs = (job.PositionLocation || []).map((l) => (l.LocationName || "").toLowerCase());
  if (!locs.length) return true;
  const term = locFilter.toLowerCase();
  const matches = locs.filter((l) => l.includes(term)).length;
  if (matches === 0) return false;
  if (locs.length <= 3) return true;
  return matches / locs.length >= 0.35;
}

function detectRelocation(job, profile) {
  const flag = job.UserArea?.Details?.RelocationIndicator;
  if ([true, 1, "1", "true", "True", "TRUE", "yes", "Yes", "YES"].includes(flag)) return true;
  const summary = (job.QualificationSummary || "").toLowerCase();
  return (profile.relocationPhrases || []).some((p) => p && summary.includes(p));
}

function hiddenLocationSignal(summary, locText, profile) {
  const signals = profile.locationSignals || [];
  const target = (profile.location || "").trim().toLowerCase();
  if (!signals.length) return { flagged: false, terms: [] };
  const terms = signals.filter((s) => s && summary.includes(s));
  const locationAlreadySaysSo = target && locText.includes(target);
  return { flagged: terms.length > 0 && !locationAlreadySaysSo, terms };
}

function filterJob(job, profile) {
  const title = " " + (job.PositionTitle || "").toLowerCase() + " ";
  const summary = (job.QualificationSummary || "").toLowerCase();
  const pay = job.PositionRemuneration || [];

  if (!locationConsistent(job, profile.location)) return { pass: false, reason: "Location mismatch (multi-site)" };

  if (profile.excludeHourly && pay.some((r) =>
    (r.RateIntervalCode || "").toUpperCase() === "PH" ||
    (r.Description || "").toLowerCase().includes("per hour"))) {
    return { pass: false, reason: "Hourly pay rate" };
  }

  const floor = num(profile.minSalary, 0);
  if (floor > 0) {
    for (const r of pay) {
      const v = parseFloat(r.MinimumRange || "0");
      if (v > 0 && v < floor) return { pass: false, reason: `Min $${v.toLocaleString()} < $${floor.toLocaleString()}` };
    }
  }

  for (const w of profile.excludeTitles || []) {
    if (w && title.includes(w.toLowerCase())) return { pass: false, reason: `Excluded title: "${w.trim()}"` };
  }
  for (const p of profile.excludeSummary || []) {
    if (p && summary.includes(p.toLowerCase())) return { pass: false, reason: `Excluded requirement: "${p}"` };
  }
  for (const p of profile.excludeFields || []) {
    if (p && summary.includes(p.toLowerCase())) return { pass: false, reason: `Excluded degree field: "${p}"` };
  }
  return { pass: true };
}

function scoreJob(job, profile) {
  const S = profile.scoring || {};
  const reasons = [], warnings = [];
  let score = 0;

  const title = (job.PositionTitle || "").toLowerCase();
  const summary = (job.QualificationSummary || "").toLowerCase();
  const org = (job.OrganizationName || "").toLowerCase();
  const dept = (job.DepartmentName || "").toLowerCase();
  const locText = (job.PositionLocation || []).map((l) => l.LocationName || "").join(", ").toLowerCase();
  const kws = profile.profileKeywords || [];

  const hasReloc = detectRelocation(job, profile);
  if (hasReloc) { score += num(S.relocation, 20); reasons.push("Relocation language confirmed"); }
  else warnings.push("No relocation language — verify on the listing");

  const titleHits = kws.filter((k) => k && title.includes(k));
  if (titleHits.length) {
    score += Math.min(titleHits.length * num(S.titleKeyword, 6), num(S.titleKeywordMax, 30));
    reasons.push(`${titleHits.length} profile keyword${titleHits.length > 1 ? "s" : ""} in title`);
  }

  const orgHit = (profile.preferredOrgs || []).find((o) => o && (org.includes(o) || dept.includes(o)));
  if (orgHit) { score += num(S.preferredOrg, 15); reasons.push(`Preferred organization (${orgHit})`); }

  const summaryHits = kws.filter((k) => k && summary.includes(k));
  if (summaryHits.length) {
    score += Math.min(summaryHits.length * num(S.summaryKeyword, 2), num(S.summaryKeywordMax, 20));
    if (summaryHits.length > 4) reasons.push(`${summaryHits.length} profile keywords in duties`);
  }

  const target = (profile.location || "").trim().toLowerCase();
  const locMatch = !!target && locText.includes(target);
  if (locMatch) { score += num(S.locationMatch, 20); reasons.push(`Location match (${profile.location})`); }

  const signal = hiddenLocationSignal(summary, locText, profile);
  if (signal.flagged) {
    score += num(S.hiddenLocationSignal, 15);
    reasons.push(`Hidden location signal in duties (${signal.terms.slice(0, 3).join(", ")})`);
  }

  return { score: Math.max(0, score), reasons, warnings, hasReloc, locMatch, signal };
}

async function fetchOnePage(params, page) {
  const p = new URLSearchParams(params);
  if (page > 1) p.set("Page", String(page));
  const res = await fetch(`/api/scan?${p.toString()}`, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  const d = await res.json();
  const sr = d.SearchResult || {};
  return { items: sr.SearchResultItems || [], total: parseInt(sr.SearchResultCountAll || 0, 10) || 0 };
}

// Walks every page of a result set instead of keeping only the first. Without
// this, a search matching 3,000 postings silently returns 100 of them.
async function fetchAll(params, onPage) {
  const items = [];
  let total = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    if (aborted) break;
    if (onPage) onPage(page);
    const r = await fetchOnePage(params, page);
    if (r.total) total = r.total;
    items.push(...r.items);
    if (!r.items.length) break;
    if (items.length >= total) break;
    await new Promise((res) => setTimeout(res, 150));
  }
  return { items, total, truncated: total > items.length };
}

async function runScan() {
  const profile = getProfile();
  const creds = getCreds();
  clrM();

  if (!profile.series.length && !profile.keywords.length) {
    showMsg("mE", "No search criteria. Add at least one occupational series or keyword on the Criteria tab.");
    return;
  }

  aborted = false;
  allResults = [];
  debugLog = [];
  showDbg = false;
  let hadError = false;

  el("sBtn").disabled = true;
  el("sBtn").innerHTML = `<i class="ti ti-loader"></i> Scanning…`;
  el("secBtns").style.display = "grid";
  el("aBtn").style.display = "flex";
  el("dBtn").style.display = "none";
  el("rL").innerHTML = "";
  el("rH").style.display = "none";
  el("dPanel").style.display = "none";

  const mkParams = (extra) => {
    const p = new URLSearchParams({
      ResultsPerPage: String(PER_PAGE),
      Fields: "All",
      ...extra
    });
    if (num(profile.minSalary, 0) > 0) p.set("RemunerationMinimumAmount", String(profile.minSalary));
    if (profile.location) p.set("LocationName", profile.location);
    return p.toString();
  };

  const searches = [
    ...profile.series.map((s) => ({ lbl: `Series ${s.code}`, params: mkParams({ JobCategoryCode: s.code }) })),
    ...profile.keywords.map((kw) => ({ lbl: `"${kw}"`, params: mkParams({ Keyword: kw }) }))
  ];

  const seen = new Set();
  const truncated = [];
  let fetched = 0, filtered = 0;

  showMsg("mI", `Running ${searches.length} searches${profile.location ? " · " + profile.location : " · nationwide"}…`);

  for (let i = 0; i < searches.length; i++) {
    if (aborted) break;
    const sr = searches[i];
    setProg(i + 1, searches.length, sr.lbl);
    try {
      const pr = await fetchAll(sr.params, (pg) =>
        setProg(i + 1, searches.length, pg > 1 ? `${sr.lbl} · page ${pg}` : sr.lbl));
      fetched += pr.items.length;
      if (pr.truncated) truncated.push({ lbl: sr.lbl, got: pr.items.length, total: pr.total });

      for (const item of pr.items) {
        const job = item.MatchedObjectDescriptor;
        const id = job.PositionID;
        if (seen.has(id)) continue;
        seen.add(id);

        const check = filterJob(job, profile);
        if (!check.pass) {
          filtered++;
          debugLog.push({ title: job.PositionTitle, org: job.OrganizationName, reason: check.reason });
          continue;
        }

        const { score, reasons, warnings, hasReloc, locMatch, signal } = scoreJob(job, profile);
        const pay = job.PositionRemuneration?.[0] || {};
        allResults.push({
          id, _open: false,
          title: job.PositionTitle,
          org: job.OrganizationName,
          dept: job.DepartmentName,
          locs: (job.PositionLocation || []).map((l) => l.LocationName),
          sal: { mn: parseFloat(pay.MinimumRange || 0), mx: parseFloat(pay.MaximumRange || 0) },
          closeDate: job.ApplicationCloseDate,
          url: job.PositionURI,
          qs: job.QualificationSummary || "",
          grade: job.JobGrade?.[0]?.Code || "",
          score, reasons, warnings, hasReloc, locMatch,
          hiddenSignal: signal.flagged,
          hiddenTerms: signal.terms
        });
      }

      allResults.sort((a, b) => b.score - a.score);
      updS(fetched, seen.size, filtered, allResults.length);
      renderResults(allResults);
    } catch (e) {
      const hint = /401|credential/i.test(e.message) && !creds.key
        ? " Add your USAJOBS key on the Setup tab."
        : "";
      showMsg("mE", `Error: ${e.message}${hint}`);
      hadError = true;
      break;
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  el("sBtn").disabled = false;
  el("sBtn").innerHTML = `<i class="ti ti-player-play"></i> Launch scan`;
  el("aBtn").style.display = "none";
  if (debugLog.length) el("dBtn").style.display = "flex";
  hideProg();

  if (hadError) return;

  const cap = PER_PAGE * MAX_PAGES;
  const note = truncated.length
    ? ` ⚠ ${truncated.length} search${truncated.length > 1 ? "es" : ""} hit the ${cap}-result cap (${truncated.slice(0, 3).map((t) => `${t.lbl}: ${t.got} of ${t.total}`).join("; ")}${truncated.length > 3 ? "; …" : ""}) — narrow by location or series to see the rest.`
    : "";

  if (allResults.length) {
    const reloc = allResults.filter((j) => j.hasReloc).length;
    const flagged = allResults.filter((j) => j.hiddenSignal).length;
    showMsg(truncated.length ? "mW" : "mO",
      `Scan complete — ${allResults.length} passed filters. ${reloc} with confirmed relocation language.${flagged ? ` ${flagged} flagged for a hidden location signal.` : ""}${note}`);
  } else if (!aborted) {
    showMsg("mW", `No positions passed filters. Tap "Show filtered" to see what was rejected and why.${note}`);
  }
}

/* -------------------------------- render -------------------------------- */

const scoreColor = (s) => (s >= 60 ? "var(--forest)" : s >= 40 ? "var(--amber)" : "var(--dust)");
const scoreLabel = (s) => (s >= 60 ? "STRONG" : s >= 40 ? "GOOD" : "WEAK");

function fmtSalary(mn, mx) {
  if (!mn && !mx) return "Salary not listed";
  const k = (v) => `$${Math.round(v / 1000)}K`;
  return mn && mx ? `${k(mn)} – ${k(mx)}` : k(mn || mx);
}

const reRender = () => renderResults(allResults);

function toggleDbg() {
  showDbg = !showDbg;
  el("dPanel").style.display = showDbg ? "block" : "none";
  el("dBtn").innerHTML = showDbg
    ? `<i class="ti ti-list-details"></i> Hide filtered`
    : `<i class="ti ti-list-details"></i> Show filtered`;
  if (showDbg) {
    el("dBody").innerHTML = debugLog.slice(0, 80).map((d) => `
      <div class="dbg-item">
        <div class="dbg-title">${eH((d.title || "").slice(0, 60))}</div>
        <div class="dbg-reason">${eH(d.reason)}</div>
        <div style="font-size:11px;color:var(--dust);margin-top:2px;font-style:italic">${eH(d.org || "")}</div>
      </div>`).join("");
  }
}

function toggleJob(id) {
  const j = allResults.find((x) => x.id === id);
  if (j) { j._open = !j._open; renderResults(allResults); }
}

function renderResults(results) {
  const minScore = parseInt(el("minScore").value) || 0;
  const relocMode = el("relocMode").value;

  let list = results;
  if (relocMode === "hard") list = list.filter((j) => j.hasReloc);
  list = list.filter((j) => j.score >= minScore);

  el("n4").textContent = list.length;
  const box = el("rL"), head = el("rH");

  if (!list.length) {
    box.innerHTML = results.length
      ? `<div class="card" style="text-align:center;padding:24px;color:var(--dust);font-style:italic">No results match the current filters.<br>Lower the minimum score or switch relocation to "Show all."</div>`
      : "";
    head.style.display = "none";
    return;
  }

  head.style.display = "block";
  head.textContent = `${list.length} position${list.length !== 1 ? "s" : ""} — ranked by profile fit`;

  box.innerHTML = list.map((job, i) => `
    <div class="jcard">
      <div class="jrow" onclick="toggleJob('${eH(job.id)}')">
        <div class="jnum">${i + 1}</div>
        <div class="jmain">
          <div class="jtitle">${eH(job.title)}</div>
          <div class="jorg">${eH(job.org || "")}</div>
          <div class="jmeta">
            <span class="jsal">${fmtSalary(job.sal.mn, job.sal.mx)}</span>
            ${job.hasReloc ? `<span class="bdg by">Reloc ✓</span>` : `<span class="bdg bw">Verify reloc</span>`}
            ${job.locMatch ? `<span class="bdg bi">Location ✓</span>` : ""}
            ${job.hiddenSignal ? `<span class="bdg bw" title="${eH((job.hiddenTerms || []).join(", "))}">Hidden signal</span>` : ""}
          </div>
        </div>
        <div class="jscore">
          <div class="sl" style="color:${scoreColor(job.score)}">${scoreLabel(job.score)}</div>
          <div class="sc" style="color:${scoreColor(job.score)}">${job.score}</div>
          <div class="jtog">${job._open ? "▲" : "▼"}</div>
        </div>
      </div>
      ${job._open ? `
      <div class="jdet">
        <div class="dl">Location${job.locs.length > 1 ? "s" : ""}</div>
        <div style="font-size:13px;color:var(--quill);font-style:italic">${eH(job.locs.slice(0, 4).join(" · "))}${job.locs.length > 4 ? ` +${job.locs.length - 4} more` : ""}</div>
        <div class="dl">Closes</div>
        <div style="font-size:13px">${job.closeDate ? new Date(job.closeDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "See listing"}</div>
        ${job.grade ? `<div style="font-size:12px;color:var(--dust);margin-top:4px">Grade: ${eH(job.grade)}</div>` : ""}
        <div class="dl">Fit analysis</div>
        ${job.reasons.map((r) => `<div class="fi fg"><i class="ti ti-check" style="font-size:14px;flex-shrink:0;margin-top:1px"></i>${eH(r)}</div>`).join("")}
        ${job.warnings.map((w) => `<div class="fi fw"><i class="ti ti-alert-triangle" style="font-size:14px;flex-shrink:0;margin-top:1px"></i>${eH(w)}</div>`).join("")}
        ${!job.reasons.length ? `<div style="font-size:13px;color:var(--dust);font-style:italic">No specific matches flagged</div>` : ""}
        ${job.qs ? `<div class="dl">Qualification summary</div><div class="qb">${eH(job.qs.slice(0, 600))}${job.qs.length > 600 ? "…" : ""}</div>` : ""}
        <a class="open-btn" href="${eH(job.url)}" target="_blank" rel="noopener noreferrer"><i class="ti ti-external-link" style="font-size:16px"></i> Open on USAJOBS</a>
      </div>` : ""}
    </div>`).join("");
}

/* -------------------------------- startup ------------------------------- */

(function init() {
  const c = getCreds();
  el("apiKey").value = c.key;
  el("apiEmail").value = c.email;
  el("resumeText").value = localStorage.getItem(LS + "resume") || "";
  renderProfileForm();

  if (!c.key) {
    showIn(["cE", "cO", "cI"], "cI",
      "No key saved in this browser. Add one below, or leave it blank if whoever deployed this set USAJOBS_API_KEY on the server.");
  }
})();

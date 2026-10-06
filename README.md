# FedScanner Template

A blank-slate federal job scanner. It searches USAJOBS against **your own**
occupational series, keywords, and exclusions, then ranks what comes back
against **your own** resume.

Nothing personal is baked into this code. There is no API key here, no saved
criteria, and no resume. You supply all three on first run.

---

## What ships in this template

| File | What it is |
|---|---|
| `index.html` | The page: Setup, Criteria, and Scan tabs |
| `app.js` | The scan engine — filters, scoring, resume parsing |
| `api/scan.js` | The USAJOBS proxy (the browser cannot call USAJOBS directly) |
| `profile.example.json` | A neutral starter profile to copy and edit |
| `.env.example` | Variable names only, no values |

## What does NOT ship in this template

- **No API key.** Not in the code, not in the repo history.
- **No criteria.** The built-in defaults are a generic example, not anyone's real profile.
- **No resume.** Yours is read in your browser and stored only there.

---

## Setup

**1. Get a USAJOBS API key.**
Request one free at [developer.usajobs.gov/apirequest](https://developer.usajobs.gov/apirequest/).
It arrives by email, usually within a day.

**2. Deploy it.**

```bash
# copy the template into a fresh repo of your own
cp -r template/. /path/to/your-new-repo/
cd /path/to/your-new-repo
git init && git add -A && git commit -m "FedScanner from template"
```

Then push it to GitHub and import the repo on [vercel.com/new](https://vercel.com/new).
No build step and no framework — Vercel serves `index.html` and turns
`api/scan.js` into a function automatically.

**3. Open the site and fill in the Setup tab.**
Paste your key and your registered email, then tap **Save and test connection**.

---

## Two ways to handle the key

**Bring your own key (default).**
Set no environment variables. Every visitor enters their own credentials on the
Setup tab. Those live in that visitor's `localStorage` and travel to the proxy
as request headers, never as URL parameters.

Use this when you are **sharing the deployed link** with other people.

**Server key.**
Set `USAJOBS_API_KEY` and `USAJOBS_EMAIL` in your Vercel project settings.
The proxy uses them and visitors never see a key prompt.

Use this when the deployment is **only for you**.

The server key always wins if both are present. Either way, no key is ever
written into the page, logged, or echoed back in a response.

---

## Criteria reference

Everything on the Criteria tab maps to one field in your profile JSON.

| Field | What it controls |
|---|---|
| `series` | Which occupational series get searched. **A series you don't list is never requested at all.** |
| `keywords` | Full-text searches run alongside the series searches |
| `location` | Sent to USAJOBS as `LocationName`, and used for location scoring |
| `minSalary` | Floor applied both upstream and locally |
| `profileKeywords` | Scoring terms — heavy weight in the title, light weight in the duties |
| `preferredOrgs` | Agencies or departments you want to work for |
| `relocationPhrases` | Phrases that prove relocation is on the table |
| `locationSignals` | Terms that reveal a job's real duty station when the listing shows an HQ address |
| `excludeTitles` | Title substrings that disqualify a posting outright |
| `excludeSummary` | Requirements you cannot meet, such as a licence you don't hold |
| `excludeFields` | Degree fields that rule you out |
| `scoring` | Point values for each signal above |

### The series field is the one that bites

Series coverage is the single most common reason a real posting never shows up.
The scanner only asks USAJOBS for the series you list. A job in an unlisted
series is not filtered out — it is never fetched, so it will not even appear
under **Show filtered**.

Browse the full list at
[usajobs.gov/help/faq/job-announcement/job-series](https://www.usajobs.gov/help/faq/job-announcement/job-series/)
and list every series your background could plausibly qualify for. Casting a
wide net costs you one extra API call per series.

---

## Using your resume

Go to **Setup → Master resume**.

- Upload a `.txt`, `.md`, or `.pdf`, or paste the text.
- Tap **Suggest keywords from resume**.
- Tap the terms that describe your real work.
- Tap **Add to criteria** or **Replace criteria**.

PDF text is extracted in your browser by pdf.js, loaded on demand. A scanned
PDF with no text layer will not work — paste the text instead.

Your resume never reaches the proxy or any server. It sits in `localStorage`
until you clear it.

---

## Sharing a profile without sharing a key

**Export profile** writes a JSON file containing your criteria and nothing
else. The export is built field by field from an allowlist, so a credential
cannot ride along even by accident.

Hand that file to someone else. They import it on their Setup tab and add
their own key.

---

## Result caps

Each search walks up to 20 pages of 100 records, so 2,000 postings per search.
Any search that hits that ceiling is named in the completion message.

If you see that warning, narrow the scan — add a location, or split one broad
series into several targeted keyword searches.

---

## Security notes

- Credentials are sent as `x-usajobs-key` and `x-usajobs-email` headers, so
  they stay out of server access logs and browser history.
- `api/scan.js` forwards an allowlist of query parameters and nothing else.
- The proxy only ever talks to `data.usajobs.gov`. It is not a general relay.
- In bring-your-own-key mode, anyone who finds your deployment URL can use the
  proxy with their own key. They cannot use yours, and they cannot read it.
- Add `.env` and `.env.local` to `.gitignore` before your first commit.

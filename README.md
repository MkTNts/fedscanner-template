# FedScanner

**A free tool that searches USAJOBS for federal jobs that fit you.**

You tell it what kind of work you do. It searches every matching job on
USAJOBS and ranks them, best fit first. It can also read your resume and
suggest search words for you.

Nothing personal comes with it. You add your own details, and they stay on
your own device. The one exception is the **optional AI review**, which you
switch on yourself and which says plainly what it sends.

---

# Start here

Setting this up takes about **30 minutes of clicking**, spread over two days.
You do **not** need to know how to code. You will not type any commands.

It works on a computer, a tablet, or a phone. A **computer or tablet is
easier**, because some screens are crowded on a small phone.

### What you will end up with

- **Your own private website**, with an address like `yourname-fedscanner.vercel.app`.
- It is **free**. None of the three services below will ask for a card.
- You can bookmark it and use it any time.

### The three free accounts you need

| Service | What it does for you |
|---|---|
| **USAJOBS developer key** | Gives you permission to search USAJOBS |
| **GitHub** | Stores your copy of this tool |
| **Vercel** | Turns your copy into a working website |

Think of it like opening a shop. USAJOBS is the supplier. GitHub is the
storeroom. Vercel is the shopfront that customers walk into.

---

## Step 1 — Request your USAJOBS key

Do this first. **The key can take up to a day to arrive.**

1. Open **[developer.usajobs.gov/apirequest](https://developer.usajobs.gov/apirequest/)**.
2. Fill in your **name** and **email address**.
3. Submit the form.
4. Wait for an email from USAJOBS.
5. **Keep that email.** It holds a long code called your **API key**.

You can do Steps 2 to 4 while you wait.

---

## Step 2 — Create a GitHub account

Skip this step if you already have one.

1. Open **[github.com/signup](https://github.com/signup)**.
2. Enter your email, a password, and a username.
3. Follow the prompts to verify your email.

---

## Step 3 — Make your own copy

Use a **web browser** for this step, such as Chrome or Safari.
The GitHub phone app does not have the button you need.

1. Sign in to GitHub.
2. Come back to **this page**.
3. Near the top right, tap the green **Use this template** button.
4. Tap **Create a new repository**.
5. In **Repository name**, type `fedscanner`.
6. Choose **Private**. ⚠️ **Do not skip this.**
7. Tap **Create repository**.

You now have your own copy. A *repository* is just GitHub's word for a
project folder.

> **Why private?** A public repository can be read by anyone on the internet.
> Your copy holds no secrets today. But if you ever change it, a private
> repository keeps any mistake out of public view.

> **Can't see "Use this template"?** On a phone, turn your screen sideways
> or switch your browser to **Desktop site**. Still missing? Open
> **[this link](https://github.com/MkTNts/fedscanner-template/generate)** instead.
> It goes straight to the same screen.
>
> **Do not use the Fork button.** GitHub does not let a fork of a public
> repository be made private.

---

## Step 4 — Turn your copy into a website

1. Open **[vercel.com/signup](https://vercel.com/signup)**.
2. Choose **Hobby**. This is the free plan.
3. Type your name.
4. Tap **Continue with GitHub**.
5. Tap **Authorize** when GitHub asks.

Vercel now shows a page called **Import Git Repository**.

6. Find **fedscanner** in the list.
   - **Not in the list?** Tap **Adjust GitHub App Permissions**.
   - Choose your copy, then tap **Save**. You'll return to the list.
7. Tap **Import** next to **fedscanner**.
8. **Do not change any settings.**
9. Tap **Deploy**.
10. Wait about a minute, until you see **Congratulations**.
11. Tap **Continue to Dashboard**.

Look for the heading **Domains**. The address under it is **your website**.
**Bookmark it now.** You can always find it again on your Vercel dashboard.

---

## Step 5 — Connect your key

Once the USAJOBS email arrives:

1. Open **your website** from Step 4.
2. Stay on the **Setup** tab.
3. Paste the **API key** from the email.
4. Type the **email address** you used in Step 1.
5. Tap **Save and test connection**.

A green message starting **"Connected"** means it worked.
If you see an error instead, check **Something went wrong?** below.

---

## Step 6 — Tell it what jobs you want

1. Tap the **Criteria** tab.
2. Fill in your **location** and **minimum salary**.
3. Fill in **series**. See the box below, because this one matters most.
4. Fill in **keywords**. These are job titles you would apply for, one per line.
5. Tap **Save criteria**.

> **What is a "series"?** Every federal job has a four-digit series number.
> For example, `0343` is Management and Program Analysis.
> **The tool only searches the series you list.** A job in an unlisted
> series will never appear, even if it is perfect for you.
>
> Look up yours on the
> [USAJOBS series list](https://www.usajobs.gov/help/faq/job-announcement/job-series/).
> When in doubt, **add more series rather than fewer**.

**Shortcut: let your resume do the work.**

1. Go back to the **Setup** tab.
2. Find **Master resume**.
3. Upload your resume, or paste its text.
4. Tap **Suggest keywords from resume**.
5. Tap the words that describe your real work.
6. Tap **Add to criteria**.

Your resume stays **on your device only**. It is never sent anywhere.

---

## Step 7 — Search

1. Tap the **Scan** tab.
2. Tap **Launch scan**.
3. Wait. A large search can take a minute or two.
4. Tap **Open on USAJOBS** on any job to read it and apply.

That's it. Come back any time and tap **Launch scan** again.

---

# Optional extras

Both extras use Vercel's **Environment Variables** screen. You fill it in the
same way each time, so here are the steps once.

### How to add an environment variable

1. Open your project on **[vercel.com](https://vercel.com)**.
2. Tap **Settings**.
3. Tap **Environment Variables**.
4. In **Key**, type the name exactly as shown, in capital letters.
5. In **Value**, paste the secret.
6. Tap **Save**.
7. Tap **Deployments**, then the **⋯** menu on the top one, then **Redeploy**.

**Step 7 matters.** Your site only notices new settings after a redeploy.

---

## Extra A — Lock your site

Right now, anyone who finds your website address can use it. A lock is like a
deadbolt on that front door. Visitors need a token, which works like a
password, before the site will do anything.

**Turn it on when:**

- you put your USAJOBS key into Vercel instead of the Setup tab, or
- you want AI review (Extra B). **AI review will not run without the lock.**

**Steps:**

1. Make up a long password, at least 20 characters.
   A password manager can generate one for you.
2. Add it in Vercel as **`APP_TOKEN`**, then redeploy.
3. Open your website and go to the **Setup** tab.
4. Paste the same password into **Site access token**.
5. Tap **Save and test connection**.

Anyone you want to let in needs that password too. Send it **separately**
from the link, for example the link by email and the password by text.

---

## Extra B — Add AI review

The keyword scan is fast, but it only spots exact words. It can miss a
requirement written as an ordinary sentence. A duty might quietly assume a
licence you don't hold, for example.

AI review reads the **whole posting** against **your resume**. It then tells
you three things:

- **Qualified, Stretch, or Blocked**, with your honest odds of referral
- **Blockers**: requirements you can't meet, and why
- **Strengths and gaps**: what a hiring panel would notice

You tap **Review with AI** on one job at a time. Nothing is sent until you tap.

### Before you turn it on

- **It costs money.** You pay the AI company for each review, using your own
  account. Expect a few cents per review. A long posting costs more.
- **Your resume leaves your device.** Each review sends that job and your
  resume to the AI company you choose. Read their privacy policy first.
- **AI can be wrong.** Treat the verdict as a second opinion. Always read the
  posting yourself before you apply.

### Which AI to use

**Recommended: Claude, made by Anthropic.** This tool was built and tested
with Claude. The request is tuned for it, and Claude's replies are held to an
exact format, so they come back clean.

**Other choices work too.** Any provider that offers the common
"OpenAI-compatible" format will do. That includes OpenAI, Google Gemini,
Mistral, Groq, and OpenRouter. These have been tested less, so check the
first few reviews closely.

### Steps — with Claude (recommended)

1. **Do Extra A first.** AI review refuses to run without the lock.
2. Sign up at **[console.anthropic.com](https://console.anthropic.com)**.
3. Add a small amount of credit, such as $5.
4. **Set a monthly spending limit**, so a mistake can never cost much.
5. Create an **API key** and copy it.
6. Add it in Vercel as **`AI_API_KEY`**, then redeploy.

That's all. Claude is the default, so nothing else is needed.

### Steps — with another provider

1. **Do Extra A first.**
2. Create an API key on your provider's website.
   **Set a spending limit** there too.
3. Add these four variables in Vercel, then redeploy:

| Key | Value |
|---|---|
| `AI_PROVIDER` | `openai-compatible` |
| `AI_API_KEY` | the key you just created |
| `AI_BASE_URL` | your provider's address — see below |
| `AI_MODEL` | the model name your provider lists |

Common addresses for **`AI_BASE_URL`**:

| Provider | Address |
|---|---|
| OpenAI | `https://api.openai.com/v1` |
| Google Gemini | `https://generativelanguage.googleapis.com/v1beta/openai` |
| Mistral | `https://api.mistral.ai/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| OpenRouter | `https://openrouter.ai/api/v1` |

### Using it

1. Run a scan.
2. Tap a job to open it.
3. Tap **Review with AI**.
4. Wait up to a minute.

---

## Keep it safe

Your **API key** works like a password. Treat it the same way.

**Do these once, during setup:**

- ✅ Make your GitHub copy **Private**. Step 3 covers this.
- ✅ Turn on **two-factor sign-in** for GitHub and for Vercel.
  It is under **Settings → Password and authentication** on GitHub.
  On Vercel, look under **Account Settings → Authentication**.

**Rules to follow every time:**

- ❌ **Never type your API key into a file on GitHub.**
  The only places it belongs are the **Setup** tab of your website, or
  Vercel's **Environment Variables** screen if you choose that option.
- ❌ **Never email, text, or post your API key** to anyone.
- ✅ On a **shared or public computer**, tap **Forget key** on the Setup tab
  when you finish.
- ✅ Want to share your criteria with a friend? Use **Export profile**.
  That file never contains your key or your resume.

**Sharing your website link:**

Your link is safe to share **as long as you only typed your key on the Setup
tab**. Each visitor must paste their own key, and nobody can see yours.

There is one exception. If you put any key into Vercel's **Environment
Variables** screen, **lock your site** with Extra A. Without the lock, anyone
with the link would be spending your key.

**If you use AI review:**

- ✅ Set a **monthly spending limit** with your AI provider.
- ✅ Keep the site **locked**. AI review refuses to run otherwise.
- ❌ Never paste your **AI key** anywhere except Vercel's
  **Environment Variables** screen.

**If a key or token ever leaks:**

1. Stop using it.
2. Get a new one:
   - **USAJOBS key:** request a new key at
     [developer.usajobs.gov/apirequest](https://developer.usajobs.gov/apirequest/).
   - **AI key:** delete the old key on your provider's website, then create a new one.
   - **Access token:** make up a new password.
3. Put the new one where the old one was, then redeploy if it lives in Vercel.

---

## Something went wrong?

**"Connected" never appears.**
Check that you pasted the **whole** key, with no spaces at either end.
Check that the email is the **same one** you gave USAJOBS.

**A job I know exists does not show up.**
Its series is probably missing from your criteria. Add it on the
**Criteria** tab, save, and scan again.

**My resume upload found no words.**
Your PDF is probably a scanned picture of a page. Paste the text in
instead.

**I see a message about a search hitting its limit.**
That search returned too many jobs to show them all. Add a location,
or swap a broad series for a few specific keywords.

**I see "This site is locked."**
The site has an access token. Paste it into **Site access token** on the
Setup tab, then tap **Save and test connection**.

**"Review with AI" says it is not turned on, or needs a token.**
Follow **Extra B**, and do **Extra A** first. Remember to **redeploy** after
adding each setting.

**AI review shows an error mentioning HTTP 401 or 403.**
Your AI key is wrong or has been deleted. Create a new one and replace
**`AI_API_KEY`** in Vercel, then redeploy.

**I changed devices and my settings are gone.**
Settings are saved in each browser separately. Before switching, tap
**Export profile** on the old device. On the new one, use **Import a profile** on the Setup tab.

---

## Words you might see

| Word | Plain meaning |
|---|---|
| **API key** | A password that lets a program search USAJOBS for you |
| **Repository** | A project folder stored on GitHub |
| **Template** | A starting copy you can make your own |
| **Fork** | A linked copy on GitHub. Avoid it here, because it cannot be made private |
| **Deploy** | Turning files into a live website |
| **Series** | The four-digit number that groups federal jobs by type of work |
| **Access token** | A password that locks your website to people you choose |
| **Environment variable** | A private setting stored in Vercel, never in your files |
| **AI provider** | The company whose AI reads postings for you, such as Anthropic |
| **Redeploy** | Rebuilding your website so it picks up new settings |

---
---

# For the technically curious

Everything below is reference material. **You do not need it to use the
tool.**

## Files in this repository

| File | What it is |
|---|---|
| `index.html` | The page: Setup, Criteria, and Scan tabs |
| `app.js` | The scan engine — filters, scoring, resume parsing |
| `api/scan.js` | The USAJOBS proxy (the browser cannot call USAJOBS directly) |
| `api/review.js` | Optional AI review, provider-neutral, off until `AI_API_KEY` is set |
| `api/_lib/auth.js` | Optional access lock, on when `APP_TOKEN` is set |
| `vercel.json` | Gives the AI review function up to 60 seconds to answer |
| `profile.example.json` | A neutral starter profile to copy and edit |
| `.env.example` | Variable names only, no values |
| `.gitignore` | Blocks real `.env` files from being committed |

There is no build step, no framework, and no dependencies. Vercel serves
`index.html` and turns each file in `api/` into a serverless function
automatically. The leading underscore keeps `api/_lib/` from becoming a route.

## What does NOT ship in this repository

- **No API key.** Not in the code, not in the repo history. That covers
  USAJOBS keys and AI keys alike.
- **No criteria.** The built-in defaults are a generic example, not anyone's real profile.
- **No resume.** Yours is read in your browser and stored only there.

## Two ways to handle the key

**Bring your own key (default).**
Set no environment variables. Every visitor enters their own credentials on the
Setup tab. Those live in that visitor's `localStorage` and travel to the proxy
as request headers, never as URL parameters.

Use this when you are **sharing the deployed link** with other people.

**Server key.**
Set `USAJOBS_API_KEY` and `USAJOBS_EMAIL` in your Vercel project settings.
The proxy uses them and visitors never see a key prompt.

Use this when the deployment is **only for you**. Set `APP_TOKEN` as well.
Without it, every visitor would be searching on your key and your rate limit.

The server key always wins if both are present. Either way, no key is ever
written into the page, logged, or echoed back in a response.

---

## Access lock

`api/_lib/auth.js` compares an `x-app-token` header against `APP_TOKEN`. The
browser sends it percent-encoded, and the server compares SHA-256 digests in
constant time. Leave `APP_TOKEN` unset and every route stays open, as before.

## AI review

`api/review.js` accepts one posting plus the resume text by POST, and returns
a verdict, referral odds, blockers, strengths, gaps, and a summary.

| Variable | Meaning |
|---|---|
| `AI_API_KEY` | Turns the feature on. Unset means a 503 with a plain explanation. |
| `AI_PROVIDER` | `anthropic` (default) or `openai-compatible` |
| `AI_MODEL` | Defaults to `claude-opus-5-5` for Anthropic. Required otherwise. |
| `AI_BASE_URL` | Required for `openai-compatible`, e.g. `https://api.openai.com/v1` |

Design notes:

- **Refuses to run without `APP_TOKEN`.** An open endpoint holding a paid key
  would let any visitor spend it.
- **Anthropic path:** schema-constrained output via `output_config.format`,
  effort `medium`, and server-side refusal fallback.
- **OpenAI-compatible path:** asks for `json_schema` output. If the provider
  answers 400, it retries once without the constraint and parses the first
  JSON object from the reply.
- **Hard caps:** the resume is clipped at 40,000 characters, and each posting
  field at 12,000. One request cannot become an expensive one.
- **Untrusted input:** posting and resume text are wrapped in tags. The system
  prompt tells the model to treat them as data, never as instructions.
- **Nothing stored or logged.** Upstream error messages are trimmed, and no
  key is ever echoed back.

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

Your resume never reaches the scan proxy. It sits in `localStorage` until
you clear it. It leaves the device only when you tap **Review with AI**, and
then only to the AI provider the site owner configured.

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

- Keep your copy of this repository **private**. Create it with
  **Use this template**, not **Fork**: a fork of a public repository cannot be
  made private.
- Enable two-factor authentication on GitHub and Vercel. Whoever controls
  those accounts controls the deployed site and its environment variables.
- Set `APP_TOKEN` whenever the server holds any key of its own. AI review
  enforces this and will not run without it.
- Set a monthly spending limit with your AI provider.

- Credentials are sent as `x-usajobs-key` and `x-usajobs-email` headers, so
  they stay out of server access logs and browser history.
- `api/scan.js` forwards an allowlist of query parameters and nothing else.
- The proxy only ever talks to `data.usajobs.gov`. It is not a general relay.
- In bring-your-own-key mode with no lock, anyone who finds your deployment
  URL can use the proxy with their own key. They cannot use yours, and they
  cannot read it.

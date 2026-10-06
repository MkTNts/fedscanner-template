# FedScanner

**A free tool that searches USAJOBS for federal jobs that fit you.**

You tell it what kind of work you do. It searches every matching job on
USAJOBS and ranks them, best fit first. It can also read your resume and
suggest search words for you.

Nothing personal comes with it. You add your own details, and they stay on
your own device.

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
6. Choose **Public** or **Private**. Either works.
7. Tap **Create repository**.

You now have your own copy. A *repository* is just GitHub's word for a
project folder.

> **Can't see "Use this template"?** On a phone, turn your screen sideways
> or switch your browser to **Desktop site**. If it is still missing, tap
> **Fork**, then **Create fork**. That works just as well.

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
| **Fork** | Another way to make your own copy on GitHub |
| **Deploy** | Turning files into a live website |
| **Series** | The four-digit number that groups federal jobs by type of work |

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
| `profile.example.json` | A neutral starter profile to copy and edit |
| `.env.example` | Variable names only, no values |
| `.gitignore` | Blocks real `.env` files from being committed |

There is no build step and no framework. Vercel serves `index.html` and turns
`api/scan.js` into a serverless function automatically.

## What does NOT ship in this repository

- **No API key.** Not in the code, not in the repo history.
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

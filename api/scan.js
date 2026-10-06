// USAJOBS search proxy.
//
// The USAJOBS API does not send CORS headers, so the browser cannot call it
// directly. This function is the only thing standing between the page and
// data.usajobs.gov.
//
// Credentials come from ONE of two places, in this order:
//
//   1. Server environment (USAJOBS_API_KEY + USAJOBS_EMAIL). Best when you
//      deploy this for yourself and nobody else touches it.
//   2. Request headers sent by the browser (x-usajobs-key + x-usajobs-email).
//      This is "bring your own key" mode: each visitor pastes their own
//      credentials on the Setup tab and they live in that visitor's
//      localStorage. Nothing is stored server-side.
//
// No key is ever committed to this repository, logged, or echoed back in a
// response. Get your own free key at https://developer.usajobs.gov/apirequest/

const UPSTREAM = "https://data.usajobs.gov/api/search";

// Only these query parameters are forwarded upstream. Anything else the
// browser sends is dropped, so a malformed or hostile query string cannot be
// smuggled through to USAJOBS.
const ALLOWED_PARAMS = new Set([
  "Keyword",
  "PositionTitle",
  "JobCategoryCode",
  "LocationName",
  "Organization",
  "PayGradeLow",
  "PayGradeHigh",
  "WhoMayApply",
  "RemunerationMinimumAmount",
  "RemunerationMaximumAmount",
  "DatePosted",
  "PositionScheduleTypeCode",
  "ResultsPerPage",
  "Page",
  "Fields",
  "SortField",
  "SortDirection"
]);

module.exports = async function handler(req, res) {
  const header = (name) => {
    const v = req.headers[name];
    return (Array.isArray(v) ? v[0] : v || "").trim();
  };

  const apiKey = process.env.USAJOBS_API_KEY || header("x-usajobs-key");
  const email = process.env.USAJOBS_EMAIL || header("x-usajobs-email");

  if (!apiKey || !email) {
    res.status(401).json({
      error:
        "No USAJOBS credentials available. Either set USAJOBS_API_KEY and " +
        "USAJOBS_EMAIL on the server, or enter your own key and email on the " +
        "Setup tab. Request a free key at https://developer.usajobs.gov/apirequest/"
    });
    return;
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(req.query || {})) {
    if (!ALLOWED_PARAMS.has(key)) continue;
    params.set(key, Array.isArray(value) ? value[0] : value);
  }

  try {
    const upstream = await fetch(`${UPSTREAM}?${params.toString()}`, {
      headers: {
        "User-Agent": email,
        "Authorization-Key": apiKey
      }
    });

    if (upstream.status === 401 || upstream.status === 403) {
      res.status(upstream.status).json({
        error:
          "USAJOBS rejected the credentials. Check that the email matches the " +
          "one you registered and that the API key was copied in full."
      });
      return;
    }

    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    // e.message never contains the key: it is only ever sent as a header.
    res.status(502).json({ error: `Upstream request failed: ${e.message}` });
  }
};

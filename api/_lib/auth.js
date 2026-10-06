// Optional access lock for every /api route.
//
// Set APP_TOKEN in your Vercel project settings and the site refuses any
// request that does not carry the same value in an x-app-token header.
// Leave it unset and the site stays open, exactly as before.
//
// The lock matters most when the server holds keys of its own: without it,
// anyone who finds the URL can spend your USAJOBS quota or your AI credits.
// That is why /api/review refuses to run at all unless APP_TOKEN is set.

const crypto = require("crypto");

const HEADER = "x-app-token";

// Copying a token out of a dashboard can pick up spaces or invisible
// characters. Both sides drop them so a paste still matches.
function clean(t) {
  return String(t || "").replace(/[​-‍⁠﻿]/g, "").trim();
}

// The browser percent-encodes the token, because headers only carry
// Latin-1 and a generated password may not.
function decode(v) {
  try {
    return decodeURIComponent(v);
  } catch (e) {
    return v;
  }
}

function tokenConfigured() {
  return Boolean(clean(process.env.APP_TOKEN));
}

// Constant-time compare, so response timing leaks nothing about the token.
function matches(given, expected) {
  const a = crypto.createHash("sha256").update(String(given)).digest();
  const b = crypto.createHash("sha256").update(String(expected)).digest();
  return crypto.timingSafeEqual(a, b);
}

// Returns true when the request may proceed. Otherwise it has already sent
// the error response and the handler should return.
function authorize(req, res) {
  const expected = clean(process.env.APP_TOKEN);
  if (!expected) return true;

  const raw = (req && req.headers && req.headers[HEADER]) || "";
  const given = clean(decode(Array.isArray(raw) ? raw[0] : raw));
  if (!given || !matches(given, expected)) {
    res.status(401).json({
      error: "This site is locked. Enter the access token on the Setup tab.",
      code: "bad_token"
    });
    return false;
  }
  return true;
}

module.exports = { authorize, tokenConfigured, HEADER };

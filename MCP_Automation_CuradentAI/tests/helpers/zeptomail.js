// helpers/zeptomail.js
// ZeptoMail helper for Playwright E2E tests
// Requires: ZEPTO_API_URL, ZEPTO_API_KEY in .env

async function fetchJson(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }
  return res.json().catch(() => null);
}

function extractMessagesFromResponse(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.messages)) return json.messages;

  for (const key of Object.keys(json)) {
    if (Array.isArray(json[key])) return json[key];
  }
  return [];
}

// ---------- HTML extractors ----------

function extractSetupLink(html) {
  if (!html) return null;
  const match = html.match(
    /<a[^>]+href=["']([^"']+)["'][^>]*>\s*Complete Your Setup\s*<\/a>/i
  );
  return match ? match[1] : null;
}

function extractTempPassword(html) {
  if (!html) return null;
  const match = html.match(
    /Temporary Password:\s*<\/[^>]+>\s*([^<\s]+)/i
  );
  return match ? match[1] : null;
}

function extractUserEmail(html) {
  if (!html) return null;
  const match = html.match(
    /Email:\s*<\/[^>]+>\s*([^<\s]+)/i
  );
  return match ? match[1] : null;
}

/**
 * Poll ZeptoMail until invitation email is received
 */
export async function waitForEmail({
  apiUrl,
  apiKey,
  to,
  subjectRegex,
  timeout = 90000,
  interval = 3000,
}) {
  if (!apiUrl) throw new Error('apiUrl is required');

  const start = Date.now();

  while (Date.now() - start < timeout) {
    let json = null;

    try {
      const headers = {
        Accept: 'application/json',
        Authorization: `Zoho-enczapikey ${apiKey}`,
      };

      json = await fetchJson(apiUrl, { headers });
    } catch {
      // Ignore temporary failures
    }

    const messages = extractMessagesFromResponse(json);

    for (const msg of messages) {
      const recipients = (msg.to || msg.recipients || '').toString();
      const subject = (msg.subject || '').toString();

      const body =
        msg?.content?.html_body ||
        msg?.content?.text_body ||
        '';

      if (to && !recipients.includes(to)) continue;
      if (subjectRegex && !subjectRegex.test(subject)) continue;

      return {
        raw: msg,
        subject,
        body,
        userEmail: extractUserEmail(body),
        tempPassword: extractTempPassword(body),
        setupLink: extractSetupLink(body),
      };
    }

    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error('Timed out waiting for invitation email');
}

export default { waitForEmail };







// // Lightweight ZeptoMail helper for Playwright tests.
// // Usage: set ZEPTO_API_URL and ZEPTO_API_KEY in environment.
// // The helper will poll the provided API URL and look for messages
// // that match the `to` address and optional subject/body regex.

// async function fetchJson(url, opts) {
//   const res = await fetch(url, opts);
//   if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
//   return res.json().catch(() => null);
// }

// function extractMessagesFromResponse(json) {
//   if (!json) return [];
//   // Common shapes: { messages: [...] } or { data: [...] } or array
//   if (Array.isArray(json)) return json;
//   if (Array.isArray(json.messages)) return json.messages;
//   if (Array.isArray(json.data)) return json.data;
//   // Try to find first array property
//   for (const k of Object.keys(json)) {
//     if (Array.isArray(json[k])) return json[k];
//   }
//   return [];
// }

// function findResetLink(text) {
//   if (!text) return null;
//   const urlMatch = text.match(/https?:\/\/[^\s'"<>]+/i);
//   return urlMatch ? urlMatch[0] : null;
// }

// /**
//  * Poll ZeptoMail (or any provided API URL that returns a list of messages)
//  * until an email for `to` matching `subjectRegex` or containing `bodyRegex` is found.
//  *
//  * Options:
//  * - apiUrl: full URL to query (required)
//  * - apiKey: API key to send as header (optional) — header name: Zoho-enczapikey
//  * - to: recipient email address to match (optional)
//  * - subjectRegex: RegExp to match subject (optional)
//  * - bodyRegex: RegExp to match body (optional)
//  * - timeout: ms (default 60000)
//  * - interval: ms (default 3000)
//  */
// export async function waitForEmail({
//   apiUrl,
//   apiKey,
//   to,
//   subjectRegex,
//   bodyRegex,
//   timeout = 60000,
//   interval = 3000,
// }) {
//   if (!apiUrl) throw new Error('apiUrl is required for waitForEmail');

//   const start = Date.now();
//   while (Date.now() - start < timeout) {
//     let json = null;
//     try {
//       const headers = {};
//       if (apiKey) headers['Zoho-enczapikey'] = apiKey;
//       headers['Accept'] = 'application/json';
//       json = await fetchJson(apiUrl, { headers });
//     } catch (e) {
//       // ignore transient fetch errors and retry
//     }

//     const messages = extractMessagesFromResponse(json);
//     for (const msg of messages) {
//       const msgTo = (msg.to || msg.recipients || msg.to_address || '').toString();
//       const subject = (msg.subject || msg.title || msg.headers?.subject || '').toString();
//       const body = (msg.body || msg.html || msg.plain || msg.content || '').toString();

//       if (to && msgTo && !msgTo.includes(to)) continue;
//       if (subjectRegex && subject && !subject.match(subjectRegex)) continue;
//       if (bodyRegex && body && !body.match(bodyRegex)) continue;

//       const link = findResetLink(body) || findResetLink(subject);
//       return { raw: msg, link, subject, body };
//     }

//     await new Promise((r) => setTimeout(r, interval));
//   }

//   throw new Error('Timed out waiting for email');
// }

// export default { waitForEmail };

/**
 * Lightweight input sanitizer to prevent basic XSS attacks.
 * Removes dangerous tags like <script>, <iframe>, etc., and escapes others unless allowed.
 *
 * @param {string} input - Raw user input string.
 * @param {Object} [options] - Optional config to allow safe tags.
 * @param {string[]} [options.allowedTags] - Tags you want to allow without escaping.
 * @returns {string} - Sanitized and safe string.
 */
function sanitizeInput(input, options = {}) {
  if (typeof input !== "string") return "";

  const allowedTags = options.allowedTags || [];

  // Always remove completely dangerous tags
  const dangerousTags = ["script", "iframe", "object", "embed", "style"];
  const tagPattern = new RegExp(
    `<(?:${dangerousTags.join("|")})[^>]*?>.*?<\\/\\s*(?:${dangerousTags.join("|")})\\s*>`,
    "gis",
  );
  let sanitized = input.replace(tagPattern, "");

  // Escape other HTML tags unless explicitly allowed
  sanitized = sanitized.replace(
    /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    function (match, tagName) {
      tagName = tagName.toLowerCase();
      if (allowedTags.includes(tagName)) {
        return match; // Keep allowed tags as-is
      }
      return match.replace(/</g, "&lt;").replace(/>/g, "&gt;"); // Escape disallowed tags
    },
  );

  return sanitized.trim();
}

/**
 * Recursively sanitize all string fields inside an object, array, or single string.
 *
 * @param {any} data - Object, array, or string to sanitize.
 * @param {Object} [options] - Optional config for sanitizeInput.
 * @returns {any} - Sanitized data with all strings cleaned.
 */
function sanitizeObject(data, options = {}) {
  if (typeof data === "string") {
    return sanitizeInput(data, options);
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item, options));
  }

  if (typeof data === "object" && data !== null) {
    const sanitizedObj = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitizedObj[key] = sanitizeObject(data[key], options);
      }
    }
    return sanitizedObj;
  }

  return data;
}

export { sanitizeInput, sanitizeObject };

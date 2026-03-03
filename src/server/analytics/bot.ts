const botPatterns = [/bot/i, /spider/i, /crawler/i, /curl/i, /wget/i, /python-requests/i];

export function isLikelyBot(userAgent?: string | null) {
  if (!userAgent) return false;
  return botPatterns.some((pattern) => pattern.test(userAgent));
}

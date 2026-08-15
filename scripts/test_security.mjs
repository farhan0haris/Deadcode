import assert from "node:assert";
import { z } from "zod";

console.log("🔒 Starting Security Verification Test Suite...\n");

// 1. Test Zod Schemas
const githubUsernameSchema = z
  .string()
  .trim()
  .min(1)
  .max(39)
  .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/);

// Valid usernames
assert.strictEqual(githubUsernameSchema.safeParse("farhan0haris").success, true);
assert.strictEqual(githubUsernameSchema.safeParse("octocat").success, true);
assert.strictEqual(githubUsernameSchema.safeParse("dead-code-2026").success, true);

// Invalid/Malicious usernames
assert.strictEqual(githubUsernameSchema.safeParse("-invalid").success, false);
assert.strictEqual(githubUsernameSchema.safeParse("invalid-").success, false);
assert.strictEqual(githubUsernameSchema.safeParse("../../../etc/passwd").success, false);
assert.strictEqual(githubUsernameSchema.safeParse("<script>alert(1)</script>").success, false);
assert.strictEqual(githubUsernameSchema.safeParse("user@domain.com").success, false);
assert.strictEqual(githubUsernameSchema.safeParse("a".repeat(40)).success, false);
console.log("✅ 1. GitHub Username & Input Validation Schemas: PASSED");

// 2. Test CSV Formula Injection Sanitization
function sanitizeCsvCell(value) {
  const str = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str.replace(/"/g, '""')}`;
  }
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

assert.strictEqual(sanitizeCsvCell("=SUM(A1:A10)"), "'=SUM(A1:A10)");
assert.strictEqual(sanitizeCsvCell("+cmd|' /C calc'!A0"), "'+cmd|' /C calc'!A0");
assert.strictEqual(sanitizeCsvCell("-2+3*cmd|' /C calc'!A0"), "'-2+3*cmd|' /C calc'!A0");
assert.strictEqual(sanitizeCsvCell("@SUM(1+1)"), "'@SUM(1+1)");
assert.strictEqual(sanitizeCsvCell("Normal Repo"), "Normal Repo");
console.log("✅ 2. CSV Formula Injection Sanitization: PASSED");

// 3. Test In-Memory Sliding Window Rate Limiter
class MockRateLimiter {
  constructor() {
    this.store = new Map();
  }
  check(key, limit, windowMs) {
    const now = Date.now();
    let record = this.store.get(key) || { timestamps: [] };
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
    if (record.timestamps.length >= limit) {
      return { success: false, remaining: 0 };
    }
    record.timestamps.push(now);
    this.store.set(key, record);
    return { success: true, remaining: limit - record.timestamps.length };
  }
}

const limiter = new MockRateLimiter();
const key = "test_ip_1";
for (let i = 0; i < 5; i++) {
  const res = limiter.check(key, 5, 60000);
  assert.strictEqual(res.success, true);
}
// 6th request should fail with 429
const overflowRes = limiter.check(key, 5, 60000);
assert.strictEqual(overflowRes.success, false);
console.log("✅ 3. Sliding Window Rate Limiter & Exhaustion: PASSED");

// 4. Test Secret Redaction in Logger
const SENSITIVE_KEYS = new Set([
  "password", "confirmpassword", "token", "secret", "authorization", "apikey"
]);
function sanitizeLogData(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeLogData);
  const res = {};
  for (const [k, v] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(k.toLowerCase())) {
      res[k] = "[REDACTED]";
    } else if (typeof v === "object") {
      res[k] = sanitizeLogData(v);
    } else {
      res[k] = v;
    }
  }
  return res;
}

const testPayload = {
  username: "farhan0haris",
  password: "super_secret_password_123",
  nested: {
    apiKey: "ghp_1234567890abcdef",
    status: "ok",
  },
};

const redacted = sanitizeLogData(testPayload);
assert.strictEqual(redacted.password, "[REDACTED]");
assert.strictEqual(redacted.nested.apiKey, "[REDACTED]");
assert.strictEqual(redacted.username, "farhan0haris");
assert.strictEqual(redacted.nested.status, "ok");
console.log("✅ 4. Structured Security Logger Auto-Redaction: PASSED");

console.log("\n🎉 ALL 4/4 SECURITY TESTS PASSED SUCCESSFULLY!");

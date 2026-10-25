import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Flag from "./models/Flag.js";
import AuditLog from "./models/AuditLog.js";

const ago = (h) => new Date(Date.now() - h * 3600 * 1000);
const e = ([enabled, rollout]) => ({ enabled, rollout });
const flag = (name, key, description, type, hours, dev, stg, prod) => ({
  name, key, description, type,
  createdAt: ago(hours + 24), updatedAt: ago(hours),
  environments: { development: e(dev), staging: e(stg), production: e(prod) },
});
const ON = [true, 100];
const OFF = [false, 0];

const flags = [
  flag("New checkout flow", "new-checkout", "Single-page checkout with saved addresses.", "release", 2, ON, ON, [true, 10]),
  flag("New product URLs", "new-product-url", "Serve products from /shop/products/:id.", "release", 5, ON, [true, 50], OFF),
  flag("AI recommendations", "ai-recommendations", "Personalised carousel on the home page.", "experiment", 26, ON, ON, [true, 25]),
  flag("Dark mode", "dark-mode", "Theme switcher in the account menu.", "release", 70, ON, ON, ON),
  flag("Express delivery badge", "express-badge", "Show same-day delivery badge on product cards.", "experiment", 96, ON, OFF, OFF),
  flag("Read-only mode", "read-only-mode", "Kill switch: block writes during maintenance.", "ops", 200, OFF, OFF, OFF),
  flag("UPI autopay", "upi-autopay", "Recurring payments through UPI mandates.", "release", 30, ON, ON, [true, 50]),
  flag("Search v2", "search-v2", "Typo-tolerant search with filters.", "experiment", 8, ON, [true, 25], OFF),
  flag("Cached price API", "cached-price-api", "Serve prices from the edge cache.", "ops", 150, ON, ON, [true, 75]),
  flag("Gift cards", "gift-cards", "Buy and redeem digital gift cards.", "release", 300, ON, OFF, OFF),
  flag("Wishlist sharing", "wishlist-sharing", "Share a wishlist with a public link.", "release", 48, ON, ON, [true, 10]),
  flag("Reviews with photos", "review-photos", "Let buyers attach photos to reviews.", "experiment", 120, ON, [true, 50], OFF),
];

const priya = { name: "Priya Nair", role: "Admin" };
const arjun = { name: "Arjun Mehta", role: "Developer" };
const sana = { name: "Sana Khan", role: "Developer" };
const log = (user, action, flagKey, flagName, env, change, hours) => ({ user, action, flagKey, flagName, env, change, at: ago(hours) });

const audit = [
  log(arjun, "ROLLOUT", "new-checkout", "New checkout flow", "production", "5% → 10%", 2),
  log(sana, "ENABLED", "search-v2", "Search v2", "staging", "off → on", 8),
  log(priya, "ROLLOUT", "ai-recommendations", "AI recommendations", "production", "10% → 25%", 26),
  log(priya, "ENABLED", "upi-autopay", "UPI autopay", "production", "off → on", 30),
  log(arjun, "UPDATED", "new-product-url", "New product URLs", null, "Details edited", 40),
  log(sana, "CREATED", "review-photos", "Reviews with photos", null, "Flag created", 120),
  log(arjun, "ROLLOUT", "cached-price-api", "Cached price API", "production", "50% → 75%", 150),
  log(priya, "DISABLED", "read-only-mode", "Read-only mode", "production", "on → off", 200),
];

await connectDB();
await Flag.deleteMany({});
await AuditLog.deleteMany({});
await Flag.create(flags, { timestamps: false });
await AuditLog.insertMany(audit, { timestamps: false });
console.log(`Seeded ${flags.length} flags and ${audit.length} audit entries.`);
await mongoose.disconnect();

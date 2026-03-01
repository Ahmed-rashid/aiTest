export const kpis = [
  { label: "Active Members", value: "3,284", change: "+6.4%" },
  { label: "Today's Check-ins", value: "612", change: "+11.2%" },
  { label: "MRR", value: "$146,420", change: "+8.1%" },
  { label: "Collection Rate", value: "97.2%", change: "+1.9%" }
];

export const bookings = [
  { className: "HIIT Express", instructor: "Maya", time: "06:30", occupancy: "22/24", waitlist: 3 },
  { className: "Power Yoga", instructor: "Noah", time: "08:00", occupancy: "18/20", waitlist: 0 },
  { className: "Spin Intervals", instructor: "Iris", time: "12:00", occupancy: "26/26", waitlist: 6 },
  { className: "Evening Strength", instructor: "Liam", time: "18:30", occupancy: "19/24", waitlist: 1 }
];

export const accessFeed = [
  { member: "Sophia Reed", gate: "North Gate", status: "ALLOW", timestamp: "09:14:22" },
  { member: "Unknown Card", gate: "Turnstile B", status: "DENY", timestamp: "09:13:58" },
  { member: "Mason Cole", gate: "North Gate", status: "ALLOW", timestamp: "09:13:27" },
  { member: "Evelyn Diaz", gate: "Studio Door", status: "ALLOW", timestamp: "09:12:44" }
];

export const billingAlerts = [
  "12 subscriptions are due for renewal in the next 24 hours.",
  "3 payment webhooks are in retry queue.",
  "1 invoice failed due to card expiration.",
  "2 chargebacks pending evidence submission."
];

export const workflows = [
  {
    title: "Member Lifecycle",
    description: "Onboarding, profile governance, contract lifecycle, and consent management.",
    maturity: "Enterprise ready"
  },
  {
    title: "Packages & Billing",
    description: "Tiered packages, recurring invoices, debt recovery, and payment reconciliations.",
    maturity: "Automated"
  },
  {
    title: "Front-Desk Operations",
    description: "Fast check-ins, access denials routing, and smart queue handling.",
    maturity: "Low latency"
  },
  {
    title: "Reporting & Compliance",
    description: "Audit logs, role-scoped exports, and operational SLA dashboards.",
    maturity: "Policy driven"
  }
];

export const systemPrinciples = [
  "Security-first multi-tenant architecture with least-privilege defaults.",
  "Event-driven reliability using idempotent workflows and replay-safe processing.",
  "Operational excellence through observability, SLOs, and actionable alerts.",
  "Product ergonomics: keyboard-friendly UX, role-aware navigation, and dark mode.",
  "Continuous improvement via analytics-ready data model and experimentation hooks."
];

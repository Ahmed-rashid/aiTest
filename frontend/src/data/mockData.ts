export const kpis = [
  { label: "Active Members", value: "2,184", change: "+3.2%" },
  { label: "Today's Check-ins", value: "426", change: "+8.1%" },
  { label: "MRR", value: "$96,420", change: "+4.7%" },
  { label: "Pending Invoices", value: "17", change: "-2.4%" }
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
  "1 invoice failed due to card expiration."
];

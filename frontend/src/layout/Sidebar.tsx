const navItems = [
  "Overview",
  "Members",
  "Bookings",
  "Access Control",
  "Billing",
  "POS",
  "Analytics",
  "Integrations",
  "Audit"
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>FitOps</h1>
      <p className="tenant-pill">Tenant: north-star-fitness</p>
      <nav>
        {navItems.map((item, index) => (
          <button key={item} className={index === 0 ? "nav-item active" : "nav-item"} type="button">
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}

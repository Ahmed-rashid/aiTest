const navigationGroups = [
  {
    label: "Operations",
    items: ["Overview", "Members", "Packages", "Check-ins", "Reservations"]
  },
  {
    label: "Finance",
    items: ["Billing", "POS", "Daily Expenses", "Payroll"]
  },
  {
    label: "Control Center",
    items: ["Reports", "Integrations", "Audit", "System Settings"]
  }
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <h1>FitOps Pro</h1>
        <p className="tenant-pill">Tenant: fat-to-fit-gym</p>
      </div>

      <nav>
        {navigationGroups.map((group) => (
          <div key={group.label} className="nav-group">
            <p className="nav-group-label">{group.label}</p>
            {group.items.map((item, index) => (
              <button key={item} className={index === 0 && group.label === "Operations" ? "nav-item active" : "nav-item"} type="button">
                {item}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Platform status</p>
        <strong>All core services operational</strong>
      </div>
    </aside>
  );
}

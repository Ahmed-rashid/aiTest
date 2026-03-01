export function TopBar() {
  return (
    <header className="topbar">
      <div>
        <h2>Fitness & Gym Management</h2>
        <p>Real-time operations dashboard</p>
      </div>
      <div className="topbar-actions">
        <button type="button">Sync Integrations</button>
        <button type="button" className="primary">
          New Member
        </button>
      </div>
    </header>
  );
}

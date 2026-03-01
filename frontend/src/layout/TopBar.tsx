type TopBarProps = {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
};

export function TopBar({ isDarkMode, onToggleDarkMode }: TopBarProps) {
  return (
    <header className="topbar">
      <div>
        <h2>Fitness & Gym Management</h2>
        <p>Enterprise command center for members, billing, access, and growth</p>
      </div>
      <div className="topbar-actions">
        <button type="button" onClick={onToggleDarkMode}>
          {isDarkMode ? "Light mode" : "Dark mode"}
        </button>
        <button type="button">Sync Integrations</button>
        <button type="button" className="primary">
          New Member
        </button>
      </div>
    </header>
  );
}

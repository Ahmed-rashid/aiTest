type KpiCardProps = {
  label: string;
  value: string;
  change: string;
};

export function KpiCard({ label, value, change }: KpiCardProps) {
  const positive = change.startsWith("+");

  return (
    <article className="card kpi-card">
      <p className="card-label">{label}</p>
      <p className="card-value">{value}</p>
      <p className={positive ? "trend trend-positive" : "trend trend-negative"}>{change} vs last period</p>
    </article>
  );
}

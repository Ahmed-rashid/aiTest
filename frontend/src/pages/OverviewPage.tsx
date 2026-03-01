import { KpiCard } from "../components/KpiCard";
import { SectionTitle } from "../components/SectionTitle";
import { accessFeed, billingAlerts, bookings, kpis } from "../data/mockData";

export function OverviewPage() {
  return (
    <main className="content">
      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="card">
        <SectionTitle
          title="Class Booking Pressure"
          subtitle="Hold/confirm utilization and waitlist behavior"
          action={<button type="button">Release Extra Slot</button>}
        />
        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Instructor</th>
              <th>Time</th>
              <th>Occupancy</th>
              <th>Waitlist</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={`${booking.className}-${booking.time}`}>
                <td>{booking.className}</td>
                <td>{booking.instructor}</td>
                <td>{booking.time}</td>
                <td>{booking.occupancy}</td>
                <td>{booking.waitlist}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="split-layout">
        <article className="card">
          <SectionTitle title="Access Events" subtitle="Latest turnstile authorization decisions" />
          <ul className="feed-list">
            {accessFeed.map((event) => (
              <li key={`${event.member}-${event.timestamp}`}>
                <div>
                  <strong>{event.member}</strong>
                  <p>
                    {event.gate} · {event.timestamp}
                  </p>
                </div>
                <span className={event.status === "ALLOW" ? "status ok" : "status deny"}>{event.status}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <SectionTitle title="Billing Attention" subtitle="Webhook retries and subscription risk" />
          <ul className="alert-list">
            {billingAlerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

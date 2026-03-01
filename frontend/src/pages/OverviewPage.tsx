import { KpiCard } from "../components/KpiCard";
import { SectionTitle } from "../components/SectionTitle";
import { accessFeed, billingAlerts, bookings, kpis, systemPrinciples, workflows } from "../data/mockData";

export function OverviewPage() {
  return (
    <main className="content">
      <section className="card status-banner">
        <div>
          <p className="status-banner-label">Operational posture</p>
          <h3>Professional-grade gym platform, engineered for scale and reliability</h3>
        </div>
        <button type="button" className="primary">
          Run Readiness Check
        </button>
      </section>

      <section className="kpi-grid">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="card">
        <SectionTitle
          title="Core System Principles"
          subtitle="Architecture and product standards embedded into day-to-day operations"
        />
        <ul className="principles-list">
          {systemPrinciples.map((principle) => (
            <li key={principle}>{principle}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <SectionTitle
          title="Class Booking Pressure"
          subtitle="Hold/confirm utilization, waitlist behavior, and release recommendations"
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

      <section className="workflow-grid">
        {workflows.map((workflow) => (
          <article className="card" key={workflow.title}>
            <h3>{workflow.title}</h3>
            <p>{workflow.description}</p>
            <span className="pill">{workflow.maturity}</span>
          </article>
        ))}
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
          <SectionTitle title="Billing Attention" subtitle="Webhook retries, debt risk, and required interventions" />
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

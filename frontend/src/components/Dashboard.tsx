import styles from './Dashboard.module.css'

type DashboardProps = {
  onOpenSimulator: () => void
}

export default function Dashboard({
  onOpenSimulator,
}: DashboardProps) {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div>
          <span className={styles.label}>OVERVIEW</span>
          <h1>Marketing Dashboard</h1>
          <p>Monitor your advertising performance and manage campaigns.</p>
        </div>

        <button onClick={onOpenSimulator}>
          Open Ad Simulator →
        </button>
      </div>

      <div className={styles.cards}>
        <article className={styles.card}>
          <span>Advertising Tools</span>
          <strong>01</strong>
          <small>Simulation workspace</small>
        </article>

        <article className={styles.card}>
          <span>Analysis Tools</span>
          <strong>03</strong>
          <small>Heatmap, Monte Carlo, Goal Seek</small>
        </article>

        <article className={styles.card}>
          <span>Reports</span>
          <strong>Coming soon</strong>
          <small>Campaign performance reports</small>
        </article>
      </div>

      <div className={styles.panel}>
        <h2>Quick Access</h2>
        <p>
          Start a new advertising simulation to estimate clicks,
          conversions, revenue and profit.
        </p>

        <button onClick={onOpenSimulator}>
          Start New Simulation →
        </button>
      </div>
    </section>
  )
}
import styles from './Dashboard.module.css'

type DashboardProps = {
  onOpenSimulator: () => void
}

const stats = [
  { title: 'Total Simulations', value: '—', description: 'Campaign simulations' },
  { title: 'Total Ad Spend', value: '—', description: 'Total advertising cost' },
  { title: 'Total Revenue', value: '—', description: 'Estimated campaign revenue' },
  { title: 'Total Profit', value: '—', description: 'Estimated profit after ads' },
]

export default function Dashboard({ onOpenSimulator }: DashboardProps) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.label}>MARKETING OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Track your advertising performance and campaign insights.</p>
        </div>

        <button onClick={onOpenSimulator}>
          + New Simulation
        </button>
      </header>

      <div className={styles.cards}>
        {stats.map((stat) => (
          <article className={styles.card} key={stat.title}>
            <span>{stat.title}</span>
            <strong>{stat.value}</strong>
            <small>{stat.description}</small>
          </article>
        ))}
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Campaign Performance</h2>
              <p>Your advertising performance overview.</p>
            </div>
            <span className={styles.status}>Overview</span>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.chartIcon}>↗</div>
            <h3>No performance data yet</h3>
            <p>
              Run your first advertising simulation to see campaign
              performance and marketing insights here.
            </p>
            <button onClick={onOpenSimulator}>
              Start Simulation →
            </button>
          </div>
        </section>

        <section className={styles.panel}>
          <h2>Quick Access</h2>
          <p>Continue working with your marketing tools.</p>

          <button className={styles.quickAction} onClick={onOpenSimulator}>
            <span className={styles.actionIcon}>◎</span>
            <span>
              <strong>Ad Simulator</strong>
              <small>Estimate campaign results</small>
            </span>
            <span className={styles.arrow}>→</span>
          </button>

          <div className={styles.toolInfo}>
            <strong>Analysis Tools</strong>
            <p>CPA Heatmap, Monte Carlo and Goal Seek are available inside the simulator.</p>
          </div>

          <div className={styles.toolInfo}>
            <strong>Reports</strong>
            <p>View and export your simulation reports.</p>
          </div>
        </section>
      </div>
    </section>
  )
}

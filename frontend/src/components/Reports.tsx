
import styles from './Reports.module.css'

type ReportsProps = {
  result: {
    inputs: {
      businessCategory: string
      budget: number
    }
    results: {
      clicks: number
      conversions: number
      cpa: number
      revenue: number
      productCost: number
      grossProfit: number
      roas: number
      roi: number
    }
  }
}

function Reports({ result }: ReportsProps) {
  const { inputs, results } = result

  const yen = (value: number) =>
    `¥${Math.round(value).toLocaleString('ja-JP')}`

  const metrics = [
    { label: 'Ad Budget', value: yen(inputs.budget) },
    { label: 'Clicks', value: results.clicks.toLocaleString() },
    { label: 'Conversions', value: results.conversions.toLocaleString() },
    { label: 'CPA', value: yen(results.cpa) },
    { label: 'Revenue', value: yen(results.revenue) },
    { label: 'Product Cost', value: yen(results.productCost) },
    { label: 'Profit after Ads', value: yen(results.grossProfit) },
    { label: 'ROAS', value: `${results.roas}%` },
    { label: 'ROI', value: `${results.roi}%` },
  ]

  return (
    <main className={styles.reports}>
      <header className={styles.header}>
        <div>
          <h1>Campaign Report</h1>
          <p>Latest advertising simulation results.</p>
          <p>
            Business Category: {{
              automobile: 'Automobile',
              flower: 'Flower',
              fashion: 'Fashion',
              food: 'Food & Restaurant',
              electronics: 'Electronics',
              other: 'Other',
            }[inputs.businessCategory] ?? inputs.businessCategory}
          </p>
        </div>

        <button
          className={styles.exportButton}
          type="button"
          onClick={() => window.print()}
        >
          Export PDF
        </button>
      </header>

      <section className={styles.metrics}>
        {metrics.map((metric) => (
          <article className={styles.metricCard} key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Reports

import styles from './CPAHeatmap.module.css'

type CPAHeatmapProps = {
  businessCategory: string
  budget: number
  cpc: number
  cvr: number
}

function CPAHeatmap({ businessCategory, budget, cpc, cvr }: CPAHeatmapProps) {
  const categoryLabels: Record<string, string> = {
    automobile: "Automobile",
    flower: "Flower",
    fashion: "Fashion",
    food: "Food & Restaurant",
    electronics: "Electronics",
    other: "Other",
  }
  const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max)

  const cpcValues = [
    cpc * 0.6,
    cpc * 0.8,
    cpc,
    cpc * 1.2,
    cpc * 1.4,
  ].map((value) => clamp(value, 10, 1000))

  const cvrValues = [
    cvr * 1.4,
    cvr * 1.2,
    cvr,
    cvr * 0.8,
    cvr * 0.6,
  ].map((value) => clamp(value, 0.1, 10))

  const calculateCPA = (costPerClick: number, conversionRate: number) =>
    costPerClick / (conversionRate / 100)

  const baselineCPA = calculateCPA(cpc, cvr)

  const getCellClass = (cpa: number) => {
    if (cpa <= baselineCPA * 0.8) return styles.good
    if (cpa <= baselineCPA * 1.2) return styles.medium
    return styles.bad
  }

  const formatYen = (value: number) =>
    `¥${Math.round(value).toLocaleString('ja-JP')}`

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>CPA Heatmap</h2>
          <p className={styles.description}>
            Business Category: {categoryLabels[businessCategory] ?? businessCategory}<br />
            See how CPC and conversion rate changes affect your cost per acquisition.
          </p>
        </div>
        <span className={styles.baseline}>
          Current CPA: {formatYen(baselineCPA)}
        </span>
      </div>

      <div className={styles.legend}>
        <span><i className={styles.legendGood} /> Lower CPA</span>
        <span><i className={styles.legendMedium} /> Similar CPA</span>
        <span><i className={styles.legendBad} /> Higher CPA</span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>CVR ↓ / CPC →</th>
              {cpcValues.map((value, index) => (
                <th key={index}>{formatYen(value)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cvrValues.map((rate, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rate.toFixed(2)}%</th>
                {cpcValues.map((cost, colIndex) => {
                  const cpa = calculateCPA(cost, rate)
                  const isCurrent = rowIndex === 2 && colIndex === 2

                  return (
                    <td
                      key={colIndex}
                      className={`${styles.cell} ${getCellClass(cpa)} ${isCurrent ? styles.current : ''}`}
                      title={`CPC: ${formatYen(cost)}, CVR: ${rate.toFixed(2)}%`}
                    >
                      {formatYen(cpa)}
                      {isCurrent && (
                        <span className={styles.currentLabel}>Current</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className={styles.note}>
        The highlighted cell represents your current CPC and CVR.
        Colors compare each result with the current CPA.
        Monthly budget: {formatYen(budget)}.
      </p>
    </section>
  )
}

export default CPAHeatmap

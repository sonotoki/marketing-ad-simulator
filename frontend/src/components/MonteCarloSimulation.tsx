import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import styles from './MonteCarloSimulation.module.css'

type Props = {
  businessCategory: string
  budget: number
  cpc: number
  cvr: number
  sellingPrice: number
  productCostRate: number
}

type Distribution = {
  p10: number
  p50: number
  p90: number
}

type MonteCarloResponse = {
  simulationCount: number
  variation: number
  results: {
    profit: Distribution
    cpa: Distribution
    revenue: Distribution
  }
}

function MonteCarloSimulation({
  businessCategory,
  budget,
  cpc,
  cvr,
  sellingPrice,
  productCostRate,
}: Props) {
  const [result, setResult] = useState<MonteCarloResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const formatYen = (value: number) =>
    `¥${Math.round(value).toLocaleString('ja-JP')}`

  const runSimulation = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/simulation/monte-carlo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessCategory,
          budget,
          cpc,
          cvr,
          sellingPrice,
          productCostRate,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Monte Carlo simulation failed',
        )
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const charts = result
    ? [
        { title: 'Profit after Ads', data: result.results.profit },
        { title: 'CPA', data: result.results.cpa },
        { title: 'Revenue', data: result.results.revenue },
      ]
    : []

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Monte Carlo Simulation</h2>
          <p className={styles.description}>
            Analyze 1,000 possible campaign outcomes with CPC and CVR variation.
          </p>
        </div>

        <button
          className={styles.runButton}
          onClick={runSimulation}
          disabled={loading}
        >
          {loading ? 'Simulating...' : 'Run Monte Carlo'}
        </button>
      </div>

      <div className={styles.info}>
        <span>1,000 simulations</span>
        <span>CPC variation: ±20%</span>
        <span>CVR variation: ±20%</span>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {!result ? (
        <div className={styles.empty}>
          <strong>Ready to analyze campaign uncertainty</strong>
          <p>
            Run the simulation to explore possible profit, CPA and revenue outcomes.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.resultsHeader}>
            <h3>Simulation Results</h3>
            <span>{result.simulationCount.toLocaleString()} runs completed</span>
          </div>

          <div className={styles.chartGrid}>
            {charts.map((chart) => {
              const chartData = [
                { percentile: 'P10', value: chart.data.p10 },
                { percentile: 'P50', value: chart.data.p50 },
                { percentile: 'P90', value: chart.data.p90 },
              ]

              return (
                <article className={styles.chartCard} key={chart.title}>
                  <h4>{chart.title}</h4>
                  <ResponsiveContainer width="100%" height={230}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="percentile" />
                      <YAxis
                        tickFormatter={(value) =>
                          `${Math.round(value / 1000)}k`
                        }
                      />
                      <Tooltip
                        formatter={(value) => formatYen(Number(value))}
                      />
                      <Bar
                        dataKey="value"
                        name={chart.title}
                        fill="#4778d5"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </article>
              )
            })}
          </div>

          <p className={styles.note}>
            P10 represents a lower outcome, P50 the median outcome, and P90 a
            higher outcome. These are simulated estimates, not guarantees.
          </p>
        </>
      )}
    </section>
  )
}

export default MonteCarloSimulation

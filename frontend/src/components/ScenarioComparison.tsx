import { useState } from 'react'
import styles from './ScenarioComparison.module.css'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

type Scenario = {
  name: string
  budget: string
  cpc: string
  cvr: string
  sellingPrice: string
  productCostRate: string
}

type ScenarioResult = {
  name: string
  results: {
    clicks: number
    conversions: number
    cpa: number
    revenue: number
    productCost: number
    profit: number
    roas: number
    roi: number
  }
}

const createScenario = (name: string): Scenario => ({
  name,
  budget: '100000',
  cpc: '100',
  cvr: '2',
  sellingPrice: '10000',
  productCostRate: '40',
})

const yen = (value: number) =>
  `¥${Math.round(value).toLocaleString('ja-JP')}`

const formatNumber = (value: number) =>
  value.toLocaleString('ja-JP', { maximumFractionDigits: 2 })

type ScenarioComparisonProps = {
  businessCategory: string
}

function ScenarioComparison({ businessCategory }: ScenarioComparisonProps) {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    createScenario('Scenario A'),
    createScenario('Scenario B'),
  ])
  const [results, setResults] = useState<ScenarioResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const chartData = results.map((scenario) => ({
    name: scenario.name,
    revenue: scenario.results.revenue,
    profit: scenario.results.profit,
    roas: scenario.results.roas,
    roi: scenario.results.roi,
  }))

  const updateScenario = (
    index: number,
    field: keyof Scenario,
    value: string,
  ) => {
    setScenarios((current) =>
      current.map((scenario, i) =>
        i === index ? { ...scenario, [field]: value } : scenario,
      ),
    )
    setResults([])
  }

  const addScenario = () => {
    if (scenarios.length >= 3) return

    setScenarios((current) => [
      ...current,
      createScenario('Scenario C'),
    ])
  }

  const removeScenario = (index: number) => {
    if (scenarios.length <= 2) return

    setScenarios((current) =>
      current.filter((_, i) => i !== index),
    )
    setResults([])
  }

  const handleCompare = async () => {
    setLoading(true)
    setError('')
    setResults([])

    try {
      const response = await fetch('/api/scenarios/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessCategory,
          scenarios: scenarios.map((scenario) => ({
            ...scenario,
            budget: Number(scenario.budget),
            cpc: Number(scenario.cpc),
            cvr: Number(scenario.cvr),
            sellingPrice: Number(scenario.sellingPrice),
            productCostRate: Number(scenario.productCostRate),
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Comparison failed',
        )
      }

      setResults(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong',
      )
    } finally {
      setLoading(false)
    }
  }

  const bestScenario = results.reduce<ScenarioResult | null>(
    (best, current) =>
      best === null || current.results.profit > best.results.profit
        ? current
        : best,
    null,
  )

  const fields = [
    ['budget', 'Monthly Budget (JPY)'],
    ['cpc', 'Cost Per Click (JPY)'],
    ['cvr', 'Conversion Rate (%)'],
    ['sellingPrice', 'Selling Price (JPY)'],
    ['productCostRate', 'Product Cost Rate (%)'],
  ] as const

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Scenario Comparison</h2>
        <p className={styles.description}>
          Compare 2–3 advertising campaign plans and find the most profitable option.
        </p>
      </div>

      <div className={styles.scenarioGrid}>
        {scenarios.map((scenario, index) => (
          <div className={styles.scenarioCard} key={scenario.name}>
            <div className={styles.scenarioHeader}>
              <div>
                <span className={styles.scenarioBadge}>
                  OPTION {index + 1}
                </span>
                <h3 className={styles.scenarioTitle}>{scenario.name}</h3>
              </div>

              {scenarios.length > 2 && (
                <button
                  className={styles.removeButton}
                  type="button"
                  onClick={() => removeScenario(index)}
                >
                  Remove
                </button>
              )}
            </div>

            {fields.map(([field, label]) => (
              <label className={styles.field} key={field}>
                <span className={styles.fieldLabel}>{label}</span>
                <input
                  className={styles.input}
                  type="number"
                  min="0"
                  value={scenario[field]}
                  onChange={(event) =>
                    updateScenario(index, field, event.target.value)
                  }
                />
              </label>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {scenarios.length < 3 && (
          <button
            className={styles.button}
            type="button"
            onClick={addScenario}
          >
            + Add Scenario
          </button>
        )}

        <button
          className={`${styles.button} ${styles.primaryButton}`}
          type="button"
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? 'Comparing...' : 'Compare Scenarios'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {results.length > 0 && (
        <div className={styles.resultsSection}>
          <h3 className={styles.sectionTitle}>Comparison Results</h3>

          {bestScenario && (
            <p className={styles.description}>
              Best option by profit after ads: <strong>{bestScenario.name}</strong>
              {' — '}
              {yen(bestScenario.results.profit)}
              {bestScenario.results.profit < 0
                ? ' (all options may still be unprofitable).'
                : ' (highest profit among compared options).'}
            </p>
          )}

          <div className={styles.tableWrapper}>
            <table className={styles.resultsTable}>
              <thead>
                <tr>
                  <th align="left">Metric</th>
                  {results.map((result) => (
                    <th key={result.name} align="right">
                      {result.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Revenue', (r: ScenarioResult) => yen(r.results.revenue)],
                  ['Profit after Ads', (r: ScenarioResult) => yen(r.results.profit)],
                  ['CPA', (r: ScenarioResult) => yen(r.results.cpa)],
                  ['Conversions', (r: ScenarioResult) => formatNumber(r.results.conversions)],
                  ['ROAS', (r: ScenarioResult) => `${formatNumber(r.results.roas)}%`],
                  ['ROI', (r: ScenarioResult) => `${formatNumber(r.results.roi)}%`],
                ].map(([label, getValue]) => (
                  <tr key={label as string}>
                    <td className={styles.metricName}>{label as string}</td>
                    {results.map((result) => (
                      <td key={result.name} align="right">
                        {(getValue as (r: ScenarioResult) => string)(result)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.chartGrid}>
            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Revenue Comparison</h3>
              <p className={styles.chartDescription}>
                Total sales revenue generated by each campaign.
              </p>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                    <CartesianGrid stroke="#e9eef5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `¥${Number(value) / 1000}k`}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                    />
                    <Tooltip formatter={(value) => yen(Number(value))} />
                    <Bar
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Revenue"
                      radius={[7, 7, 0, 0]}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>Profit Comparison</h3>
              <p className={styles.chartDescription}>
                Profit remaining after product costs and advertising expenses.
              </p>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                    <CartesianGrid stroke="#e9eef5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `¥${Number(value) / 1000}k`}
                      tickLine={false}
                      axisLine={false}
                      width={65}
                    />
                    <Tooltip formatter={(value) => yen(Number(value))} />
                    <Bar
                      dataKey="profit"
                      fill="#10b981"
                      name="Profit after Ads"
                      radius={[7, 7, 0, 0]}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>ROAS Comparison</h3>
              <p className={styles.chartDescription}>
                Revenue earned for every ¥100 spent on advertising.
              </p>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                    <CartesianGrid stroke="#e9eef5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${value}%`}
                      tickLine={false}
                      axisLine={false}
                      width={55}
                    />
                    <Tooltip formatter={(value) => `${formatNumber(Number(value))}%`} />
                    <Bar
                      dataKey="roas"
                      fill="#06b6d4"
                      name="ROAS"
                      radius={[7, 7, 0, 0]}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.chartCard}>
              <h3 className={styles.chartTitle}>ROI Comparison</h3>
              <p className={styles.chartDescription}>
                Return on investment after advertising and product costs.
              </p>
              <div className={styles.chart}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 4 }}>
                    <CartesianGrid stroke="#e9eef5" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `${value}%`}
                      tickLine={false}
                      axisLine={false}
                      width={55}
                    />
                    <Tooltip formatter={(value) => `${formatNumber(Number(value))}%`} />
                    <Bar
                      dataKey="roi"
                      fill="#8b5cf6"
                      name="ROI"
                      radius={[7, 7, 0, 0]}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ScenarioComparison

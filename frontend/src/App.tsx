import ScenarioComparison from './components/ScenarioComparison'
import MonteCarloSimulation from './components/MonteCarloSimulation'
import { useState } from 'react'
import styles from './App.module.css'

type Inputs = {
  budget: string
  cpc: string
  cvr: string
  sellingPrice: string
  productCostRate: string
}

type Results = {
  clicks: number
  conversions: number
  cpa: number
  revenue: number
  productCost: number
  grossProfit: number
  roas: number
  roi: number
}

type ApiResponse = {
  inputs: { [K in keyof Inputs]: number }
  results: Results
}

const initialInputs: Inputs = {
  budget: '100000',
  cpc: '100',
  cvr: '2',
  sellingPrice: '10000',
  productCostRate: '40',
}

const yen = (value: number) =>
  `¥${Math.round(value).toLocaleString('ja-JP')}`

function App() {
  const [inputs, setInputs] = useState<Inputs>(initialInputs)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateInput = (name: keyof Inputs, value: string) => {
    const normalizedValue = value.replace(/^0+(?=\d)/, '')
    setInputs((current) => ({ ...current, [name]: normalizedValue }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: Number(inputs.budget),
          cpc: Number(inputs.cpc),
          cvr: Number(inputs.cvr),
          sellingPrice: Number(inputs.sellingPrice),
          productCostRate: Number(inputs.productCostRate),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message || 'Simulation failed',
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

  const metrics = result
    ? [
        { label: 'Clicks', value: result.results.clicks.toLocaleString(), note: 'Estimated traffic' },
        { label: 'Conversions', value: result.results.conversions.toLocaleString(), note: 'Estimated sales' },
        { label: 'CPA', value: yen(result.results.cpa), note: 'Cost per acquisition' },
        { label: 'Revenue', value: yen(result.results.revenue), note: 'Total sales revenue' },
        { label: 'Product Cost', value: yen(result.results.productCost), note: 'Cost of goods' },
        { label: 'Profit after Ads', value: yen(result.results.grossProfit), note: 'Revenue − product cost − ads' },
        { label: 'ROAS', value: `${result.results.roas}%`, note: 'Return on ad spend' },
        { label: 'ROI', value: `${result.results.roi}%`, note: 'Return on investment' },
      ]
    : []

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>M</div>
          <span>Marketing<span className={styles.brandLight}>Lab</span></span>
        </div>

        <div className={styles.navLabel}>WORKSPACE</div>
        <div className={styles.navItem}>
          <span>▦</span> Dashboard
        </div>
        <div className={`${styles.navItem} ${styles.active}`}>
          <span>◈</span> Ad Simulator
        </div>
        <div className={styles.navItem}>
          <span>▤</span> Reports
        </div>

        <div className={styles.sidebarBottom}>
          <div className={styles.avatar}>A</div>
          <div>
            <strong>Administrator</strong>
            <small>Marketing Team</small>
          </div>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.header}>
          <div>
            <div className={styles.breadcrumb}>Workspace / Ad Simulator</div>
            <h1>Advertising Simulator</h1>
            <p>Plan your advertising budget and estimate campaign performance.</p>
          </div>
          <div className={styles.status}>
            <span className={styles.statusDot}></span>
            Simulation Engine Ready
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <section className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <h2>Campaign Parameters</h2>
                <p>Enter your campaign assumptions below.</p>
              </div>
              <span className={styles.step}>01 / INPUT</span>
            </div>

            <div className={styles.formGrid}>
              <label className={styles.field}>
                <span>Monthly Ad Budget <small>(JPY)</small></span>
                <input
                  type="number"
                  min="100000"
                  max="5000000"
                  step="10000"
                  value={inputs.budget}
                  onChange={(e) => updateInput('budget', e.target.value)}
                  required
                />
                <small>¥100,000 – ¥5,000,000</small>
              </label>

              <label className={styles.field}>
                <span>Cost Per Click <small>(JPY)</small></span>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  value={inputs.cpc}
                  onChange={(e) => updateInput('cpc', e.target.value)}
                  required
                />
                <small>¥10 – ¥1,000</small>
              </label>

              <label className={styles.field}>
                <span>Conversion Rate <small>(%)</small></span>
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={inputs.cvr}
                  onChange={(e) => updateInput('cvr', e.target.value)}
                  required
                />
                <small>0.1% – 10%</small>
              </label>

              <label className={styles.field}>
                <span>Selling Price <small>(JPY)</small></span>
                <input
                  type="number"
                  min="1"
                  value={inputs.sellingPrice}
                  onChange={(e) => updateInput('sellingPrice', e.target.value)}
                  required
                />
                <small>Price per product</small>
              </label>

              <label className={styles.field}>
                <span>Product Cost Rate <small>(%)</small></span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={inputs.productCostRate}
                  onChange={(e) => updateInput('productCostRate', e.target.value)}
                  required
                />
                <small>0% – 100% of revenue</small>
              </label>
            </div>

            <div className={styles.formFooter}>
              <span>All values are estimates.</span>
              <button type="submit" disabled={loading}>
                {loading ? 'Calculating...' : 'Run Simulation →'}
              </button>
            </div>
          </section>
        </form>

        {error && <div className={styles.error}>⚠ {error}</div>}

        <section className={styles.results}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.step}>02 / RESULTS</span>
              <h2>Performance Overview</h2>
              <p>Your estimated campaign performance.</p>
            </div>
            {result && <span className={styles.completed}>✓ Calculation complete</span>}
          </div>

          {result ? (
            <div className={styles.metrics}>
              {metrics.map((metric) => (
                <article className={styles.metricCard} key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.note}</small>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>◈</div>
              <strong>No simulation results yet</strong>
              <p>Enter your campaign parameters and run the simulation to see results.</p>
            </div>
          )}
        </section>
          {Number(inputs.cpc) >= 10 &&
          Number(inputs.cpc) <= 1000 &&
          Number(inputs.cvr) >= 0.1 &&
          Number(inputs.cvr) <= 10 &&
          Number(inputs.budget) >= 100000 &&
          Number(inputs.budget) <= 5000000 &&
          Number(inputs.sellingPrice) >= 1 &&
          Number(inputs.productCostRate) >= 0 &&
          Number(inputs.productCostRate) <= 100 && (
            <MonteCarloSimulation
              budget={Number(inputs.budget)}
              cpc={Number(inputs.cpc)}
              cvr={Number(inputs.cvr)}
              sellingPrice={Number(inputs.sellingPrice)}
              productCostRate={Number(inputs.productCostRate)}
            />
          )}

          <ScenarioComparison />
        <footer className={styles.footer}>
          MarketingLab <span>•</span> Ad Performance Simulator
          <span className={styles.version}>Version 0.1.0</span>
        </footer>
      </section>
    </main>
  )
}

export default App

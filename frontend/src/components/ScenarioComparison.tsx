import { useState } from 'react'

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

function ScenarioComparison() {
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

  return (
    <section style={{ marginTop: '32px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Scenario Comparison</h2>
        <p>Compare 2–3 advertising campaign plans.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            style={{
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3>{scenario.name}</h3>
              {scenarios.length > 2 && (
                <button type="button" onClick={() => removeScenario(index)}>
                  Remove
                </button>
              )}
            </div>

            {(
              [
                ['budget', 'Monthly Budget (JPY)'],
                ['cpc', 'Cost Per Click (JPY)'],
                ['cvr', 'Conversion Rate (%)'],
                ['sellingPrice', 'Selling Price (JPY)'],
                ['productCostRate', 'Product Cost Rate (%)'],
              ] as const
            ).map(([field, label]) => (
              <label
                key={field}
                style={{ display: 'block', marginTop: '12px' }}
              >
                <span style={{ display: 'block', marginBottom: '4px' }}>
                  {label}
                </span>
                <input
                  type="number"
                  min="0"
                  value={scenario[field]}
                  onChange={(event) =>
                    updateScenario(index, field, event.target.value)
                  }
                  style={{ width: '100%', padding: '8px' }}
                />
              </label>
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        {scenarios.length < 3 && (
          <button type="button" onClick={addScenario}>
            + Add Scenario
          </button>
        )}

        <button type="button" onClick={handleCompare} disabled={loading}>
          {loading ? 'Comparing...' : 'Compare Scenarios'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '24px' }}>
          <h3>Comparison Results</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Metric</th>
                {results.map((result) => (
                  <th key={result.name} align="right">{result.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Revenue', (r: ScenarioResult) => yen(r.results.revenue)],
                ['Profit after Ads', (r: ScenarioResult) => yen(r.results.profit)],
                ['CPA', (r: ScenarioResult) => yen(r.results.cpa)],
                ['Conversions', (r: ScenarioResult) => r.results.conversions.toLocaleString()],
                ['ROAS', (r: ScenarioResult) => `${r.results.roas}%`],
                ['ROI', (r: ScenarioResult) => `${r.results.roi}%`],
              ].map(([label, getValue]) => (
                <tr key={label as string}>
                  <td style={{ padding: '10px 0' }}>{label as string}</td>
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
      )}

      {results.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginTop: '30px',
          }}
        >
          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
            <h3>Revenue Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => yen(Number(value))} />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
            <h3>Profit Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => yen(Number(value))} />
                <Bar dataKey="profit" fill="#16a34a" name="Profit after Ads" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
            <h3>ROAS Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="roas" fill="#0891b2" name="ROAS" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px' }}>
            <h3>ROI Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar dataKey="roi" fill="#9333ea" name="ROI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

    </section>
  )
}

export default ScenarioComparison

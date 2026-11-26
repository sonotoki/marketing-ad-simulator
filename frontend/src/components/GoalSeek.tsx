
import { useState } from 'react'
import styles from './GoalSeek.module.css'

type GoalSeekResult = {
  success: boolean
  message?: string
  inputs?: {
    targetProfit: number
  }
  results?: {
    requiredBudget: number
    targetProfit: number
    expectedRevenue: number
    profitRate: number
  }
}

type GoalSeekProps = {
  businessCategory: string
  cpc: number
  cvr: number
  sellingPrice: number
  productCostRate: number
}

export default function GoalSeek({
  businessCategory,
  cpc,
  cvr,
  sellingPrice,
  productCostRate,
}: GoalSeekProps) {
  const [targetProfit, setTargetProfit] = useState('100000')
  const [result, setResult] = useState<GoalSeekResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCalculate = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/simulation/goal-seek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessCategory,
          targetProfit: Number(targetProfit),
          cpc,
          cvr,
          sellingPrice,
          productCostRate,
        }),
      })

      const data: GoalSeekResult = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Calculation failed')
      }

      setResult(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Something went wrong',
      )
    } finally {
      setLoading(false)
    }
  }

  const formatYen = (value: number) =>
    `¥${Math.round(value).toLocaleString('ja-JP')}`

  return (
    <section className={styles.container}>
      <h2>Goal Seek</h2>
      <p>Calculate the advertising budget required to reach your target profit.</p>

      <div className={styles.form}>
        <label htmlFor="targetProfit">Target Profit (¥)</label>
        <input
          id="targetProfit"
          type="number"
          min="1"
          value={targetProfit}
          onChange={(event) => setTargetProfit(event.target.value)}
        />

        <button
          type="button"
          onClick={handleCalculate}
          disabled={loading || Number(targetProfit) <= 0}
        >
          {loading ? 'Calculating...' : 'Calculate Required Budget'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {result && result.success && result.results && (
        <div className={styles.results}>
          <div>
            <span>Required Budget</span>
            <strong>{formatYen(result.results.requiredBudget)}</strong>
          </div>

          <div>
            <span>Target Profit</span>
            <strong>{formatYen(result.results.targetProfit)}</strong>
          </div>

          <div>
            <span>Expected Revenue</span>
            <strong>{formatYen(result.results.expectedRevenue)}</strong>
          </div>

          <div>
            <span>Profit Rate</span>
            <strong>{result.results.profitRate}%</strong>
          </div>
        </div>
      )}

      {result && !result.success && (
        <p className={styles.error}>
          {result.message || 'Target profit cannot be achieved with these parameters.'}
        </p>
      )}
    </section>
  )
}

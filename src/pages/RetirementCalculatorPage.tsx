import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { WpRecord } from '../types'

interface RetirementCalculatorPageProps {
  entity: WpRecord | null
  loading: boolean
  error: string | null
}

type RiskProfile = 'conservative' | 'balanced' | 'growth'

interface CalculatorInputs {
  currentAge: number
  retirementAge: number
  lifeExpectancy: number
  annualIncome: number
  incomeGrowthRate: number
  currentSavings: number
  annualSavingsRate: number
  annualRetirementSpend: number
  socialSecurityAnnual: number
  oneTimeGoal: number
  includeNonWorkingSpouse: boolean
}

interface ProfileConfig {
  label: string
  expectedReturn: number
  inflation: number
  withdrawalRate: number
  description: string
}

interface ProjectionPoint {
  year: number
  age: number
  income: number
  contribution: number
  balance: number
}

interface ProjectionResult {
  projectedSavings: number
  requiredLumpSum: number
  shortfall: number
  surplus: number
  yearsToRetirement: number
  yearsOfRunway: number
  targetRunwayYears: number
  monthlyPortfolioIncome: number
  monthlyTotalIncome: number
  incomeReplacementRatio: number
  netRetirementSpend: number
  recommendedSavingsRate: number
  annualContributionGap: number
  confidenceScore: number
  onTrack: boolean
  timeline: ProjectionPoint[]
}

const PROFILE_CONFIG: Record<RiskProfile, ProfileConfig> = {
  conservative: {
    label: 'Conservative',
    expectedReturn: 0.055,
    inflation: 0.03,
    withdrawalRate: 0.035,
    description: 'Lower volatility and tighter withdrawal assumptions.',
  },
  balanced: {
    label: 'Balanced',
    expectedReturn: 0.07,
    inflation: 0.03,
    withdrawalRate: 0.04,
    description: 'Balanced long-term assumptions for most households.',
  },
  growth: {
    label: 'Growth',
    expectedReturn: 0.082,
    inflation: 0.032,
    withdrawalRate: 0.042,
    description: 'Higher-growth assumption with more market sensitivity.',
  },
}

const SPOUSE_BUFFER_MULTIPLIER = 1.15

const DEFAULT_INPUTS: CalculatorInputs = {
  currentAge: 35,
  retirementAge: 67,
  lifeExpectancy: 92,
  annualIncome: 90000,
  incomeGrowthRate: 3,
  currentSavings: 75000,
  annualSavingsRate: 12,
  annualRetirementSpend: 70000,
  socialSecurityAnnual: 26000,
  oneTimeGoal: 100000,
  includeNonWorkingSpouse: false,
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.max(0, value))

const clampNumber = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min
  }

  return Math.max(min, Math.min(max, value))
}

const projectBalanceAtRate = (
  inputs: CalculatorInputs,
  profile: ProfileConfig,
  savingsRate: number
): number => {
  const years = Math.max(1, Math.floor(inputs.retirementAge - inputs.currentAge))
  let income = inputs.annualIncome
  let balance = inputs.currentSavings

  for (let year = 0; year < years; year += 1) {
    const annualContribution = income * (savingsRate / 100)
    balance = (balance + annualContribution) * (1 + profile.expectedReturn)
    income *= 1 + inputs.incomeGrowthRate / 100
  }

  return balance
}

const calculateProjection = (inputs: CalculatorInputs, profile: ProfileConfig): ProjectionResult => {
  const yearsToRetirement = Math.max(1, Math.floor(inputs.retirementAge - inputs.currentAge))

  let income = inputs.annualIncome
  let balance = inputs.currentSavings
  const timeline: ProjectionPoint[] = []

  for (let year = 1; year <= yearsToRetirement; year += 1) {
    const annualContribution = income * (inputs.annualSavingsRate / 100)
    balance = (balance + annualContribution) * (1 + profile.expectedReturn)
    timeline.push({
      year,
      age: inputs.currentAge + year,
      income,
      contribution: annualContribution,
      balance,
    })
    income *= 1 + inputs.incomeGrowthRate / 100
  }

  const projectedSavings = balance
  const netRetirementSpend = Math.max(0, inputs.annualRetirementSpend - inputs.socialSecurityAnnual)
  let requiredLumpSum = netRetirementSpend / profile.withdrawalRate + inputs.oneTimeGoal
  if (inputs.includeNonWorkingSpouse) {
    requiredLumpSum *= SPOUSE_BUFFER_MULTIPLIER
  }

  const shortfall = requiredLumpSum - projectedSavings
  const surplus = projectedSavings - requiredLumpSum
  const onTrack = shortfall <= 0

  const targetRunwayYears = Math.max(1, inputs.lifeExpectancy - inputs.retirementAge)
  let yearsOfRunway = 0
  let retirementBalance = projectedSavings
  let retirementSpend = netRetirementSpend

  for (let year = 0; year < 60; year += 1) {
    retirementBalance = retirementBalance * (1 + profile.expectedReturn) - retirementSpend
    if (retirementBalance <= 0) {
      break
    }

    yearsOfRunway += 1
    retirementSpend *= 1 + profile.inflation
  }

  let recommendedSavingsRate = 0
  if (projectBalanceAtRate(inputs, profile, 0) < requiredLumpSum) {
    let low = 0
    let high = 60

    for (let index = 0; index < 45; index += 1) {
      const mid = (low + high) / 2
      const projectedAtMid = projectBalanceAtRate(inputs, profile, mid)
      if (projectedAtMid >= requiredLumpSum) {
        high = mid
      } else {
        low = mid
      }
    }

    recommendedSavingsRate = high
  }

  const annualContributionGap =
    inputs.annualIncome * Math.max(0, recommendedSavingsRate - inputs.annualSavingsRate) / 100
  const monthlyPortfolioIncome = (projectedSavings * profile.withdrawalRate) / 12
  const monthlyTotalIncome = (projectedSavings * profile.withdrawalRate + inputs.socialSecurityAnnual) / 12
  const incomeReplacementRatio =
    inputs.annualIncome > 0
      ? ((projectedSavings * profile.withdrawalRate + inputs.socialSecurityAnnual) / inputs.annualIncome) * 100
      : 0

  const coverageRatio = requiredLumpSum > 0 ? projectedSavings / requiredLumpSum : 1
  const runwayRatio = yearsOfRunway / targetRunwayYears
  const confidenceScore = clampNumber(
    Math.round(coverageRatio * 70 + runwayRatio * 25 + (yearsToRetirement >= 20 ? 5 : 0)),
    1,
    99
  )

  return {
    projectedSavings,
    requiredLumpSum,
    shortfall,
    surplus,
    yearsToRetirement,
    yearsOfRunway,
    targetRunwayYears,
    monthlyPortfolioIncome,
    monthlyTotalIncome,
    incomeReplacementRatio,
    netRetirementSpend,
    recommendedSavingsRate,
    annualContributionGap,
    confidenceScore,
    onTrack,
    timeline,
  }
}

const RetirementCalculatorPage = ({ entity, loading, error }: RetirementCalculatorPageProps) => {
  const [profile, setProfile] = useState<RiskProfile>('balanced')
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS)

  const activeProfile = PROFILE_CONFIG[profile]
  const result = useMemo(() => calculateProjection(inputs, activeProfile), [inputs, activeProfile])

  const summary =
    'A strategy-grade retirement model with scenario presets, contribution guidance, and runway confidence so you can decide faster.'

  const milestones = useMemo(() => {
    const years = result.timeline.length
    if (years === 0) {
      return []
    }

    const indexes = new Set([
      1,
      Math.ceil(years * 0.25),
      Math.ceil(years * 0.5),
      Math.ceil(years * 0.75),
      years,
    ])

    return result.timeline.filter((point) => indexes.has(point.year))
  }, [result.timeline])

  const actionItems = useMemo(() => {
    if (result.onTrack) {
      return [
        `Keep saving at or above ${inputs.annualSavingsRate.toFixed(1)}% annually.`,
        'Review this model every 12 months or after major life changes.',
        'Stress-test tax strategy and sequence-of-returns risk before retirement.',
      ]
    }

    const neededRate = Math.max(result.recommendedSavingsRate, inputs.annualSavingsRate)
    const spendReduction = Math.max(0, result.shortfall * activeProfile.withdrawalRate)

    return [
      `Increase savings rate toward ${neededRate.toFixed(1)}% to close the projected gap.`,
      `Bridge the gap with approximately ${formatCurrency(result.annualContributionGap)} additional annual contributions.`,
      `Reducing retirement spending by about ${formatCurrency(spendReduction)} per year also improves viability.`,
    ]
  }, [
    activeProfile.withdrawalRate,
    inputs.annualSavingsRate,
    result.annualContributionGap,
    result.onTrack,
    result.recommendedSavingsRate,
    result.shortfall,
  ])

  if (loading) {
    return (
      <section className="page-state container">
        <h1>Loading Retirement Calculator...</h1>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page-state container">
        <h1>Unable to load calculator data</h1>
        <p>{error}</p>
      </section>
    )
  }

  const projectedVsRequiredMax = Math.max(result.projectedSavings, result.requiredLumpSum, 1)
  const projectedPct = (result.projectedSavings / projectedVsRequiredMax) * 100
  const requiredPct = (result.requiredLumpSum / projectedVsRequiredMax) * 100
  const netSpendPct = (result.netRetirementSpend / Math.max(inputs.annualRetirementSpend, 1)) * 100
  const coveragePct = clampNumber((result.projectedSavings / Math.max(result.requiredLumpSum, 1)) * 100, 0, 100)

  const updateNumber = (key: keyof CalculatorInputs, value: string) => {
    const parsed = Number(value)
    setInputs((current) => {
      switch (key) {
        case 'currentAge':
          return { ...current, currentAge: clampNumber(parsed, 18, 85) }
        case 'retirementAge':
          return { ...current, retirementAge: clampNumber(parsed, 45, 90) }
        case 'lifeExpectancy':
          return { ...current, lifeExpectancy: clampNumber(parsed, 65, 105) }
        case 'incomeGrowthRate':
          return { ...current, incomeGrowthRate: clampNumber(parsed, 0, 12) }
        case 'annualSavingsRate':
          return { ...current, annualSavingsRate: clampNumber(parsed, 0, 60) }
        default:
          return { ...current, [key]: clampNumber(parsed, 0, 20_000_000) }
      }
    })
  }

  return (
    <article className="ret-calc-page page2026 page2026-retcalc">
      <section className="container ret-calc-hero ret-calc-hero-grid page2026-hero">
        <div className="ret-calc-hero-copy">
          <p className="eyebrow">Retirement Intelligence</p>
          <h1>{entity?.title ?? 'Retirement Calculator'}</h1>
          <p>{summary}</p>
        </div>

        <div className="ret-calc-hero-controls">
          <p className="ret-calc-mini-title">Assumption Profile</p>
          <div className="ret-calc-profile-row">
            {(Object.keys(PROFILE_CONFIG) as RiskProfile[]).map((option) => (
              <button
                key={option}
                type="button"
                className={`ret-calc-profile-btn ${profile === option ? 'active' : ''}`}
                onClick={() => setProfile(option)}
              >
                {PROFILE_CONFIG[option].label}
              </button>
            ))}
          </div>

          <div className="ret-calc-assumption-grid">
            <article>
              <span>Expected Return</span>
              <strong>{(activeProfile.expectedReturn * 100).toFixed(1)}%</strong>
            </article>
            <article>
              <span>Inflation</span>
              <strong>{(activeProfile.inflation * 100).toFixed(1)}%</strong>
            </article>
            <article>
              <span>Withdrawal Rule</span>
              <strong>{(activeProfile.withdrawalRate * 100).toFixed(1)}%</strong>
            </article>
          </div>
          <p className="ret-calc-profile-note">{activeProfile.description}</p>
        </div>
      </section>

      <section className="container ret-calc-shell">
        <div className="ret-calc-panel ret-calc-form-panel">
          <h2>Plan Inputs</h2>
          <p className="ret-calc-panel-subtitle">Adjust assumptions and your projection updates instantly.</p>

          <div className="ret-calc-field-grid">
            <label>
              Current Age
              <input
                type="number"
                value={inputs.currentAge}
                onChange={(event) => updateNumber('currentAge', event.target.value)}
              />
            </label>
            <label>
              Retirement Age
              <input
                type="number"
                value={inputs.retirementAge}
                onChange={(event) => updateNumber('retirementAge', event.target.value)}
              />
            </label>

            <label>
              Life Expectancy
              <input
                type="number"
                value={inputs.lifeExpectancy}
                onChange={(event) => updateNumber('lifeExpectancy', event.target.value)}
              />
            </label>
            <label>
              Income Growth (%)
              <input
                type="number"
                value={inputs.incomeGrowthRate}
                onChange={(event) => updateNumber('incomeGrowthRate', event.target.value)}
              />
            </label>

            <label>
              Annual Income
              <input
                type="number"
                value={inputs.annualIncome}
                onChange={(event) => updateNumber('annualIncome', event.target.value)}
              />
            </label>
            <label>
              Current Savings
              <input
                type="number"
                value={inputs.currentSavings}
                onChange={(event) => updateNumber('currentSavings', event.target.value)}
              />
            </label>

            <label>
              Savings Rate (%)
              <input
                type="number"
                value={inputs.annualSavingsRate}
                onChange={(event) => updateNumber('annualSavingsRate', event.target.value)}
              />
            </label>
            <label>
              Annual Retirement Spend
              <input
                type="number"
                value={inputs.annualRetirementSpend}
                onChange={(event) => updateNumber('annualRetirementSpend', event.target.value)}
              />
            </label>

            <label>
              Social Security (Annual)
              <input
                type="number"
                value={inputs.socialSecurityAnnual}
                onChange={(event) => updateNumber('socialSecurityAnnual', event.target.value)}
              />
            </label>
            <label>
              One-Time Goal / Legacy
              <input
                type="number"
                value={inputs.oneTimeGoal}
                onChange={(event) => updateNumber('oneTimeGoal', event.target.value)}
              />
            </label>
          </div>

          <label className="ret-calc-checkbox">
            <input
              type="checkbox"
              checked={inputs.includeNonWorkingSpouse}
              onChange={(event) =>
                setInputs((current) => ({
                  ...current,
                  includeNonWorkingSpouse: event.target.checked,
                }))
              }
            />
            Include non-working spouse adjustment
          </label>

          <div className="ret-calc-action-row">
            <button type="button" className="btn btn-outline" onClick={() => setInputs(DEFAULT_INPUTS)}>
              Reset Inputs
            </button>
            <Link to="/contact-us" className="btn btn-primary">
              Book Strategy Review
            </Link>
          </div>
        </div>

        <div className="ret-calc-panel ret-calc-results-panel">
          <div className="ret-calc-results-head">
            <p className="eyebrow">Live Projection</p>
            <span className={`ret-calc-pill ${result.onTrack ? 'is-good' : 'is-risk'}`}>
              {result.onTrack ? 'On Track' : 'Gap Detected'}
            </span>
          </div>

          <div className="ret-calc-kpi-grid">
            <article>
              <span>Projected at Retirement</span>
              <strong>{formatCurrency(result.projectedSavings)}</strong>
            </article>
            <article>
              <span>Required Target</span>
              <strong>{formatCurrency(result.requiredLumpSum)}</strong>
            </article>
            <article>
              <span>Monthly Retirement Income</span>
              <strong>{formatCurrency(result.monthlyTotalIncome)}</strong>
            </article>
            <article>
              <span>Income Replacement</span>
              <strong>{result.incomeReplacementRatio.toFixed(1)}%</strong>
            </article>
          </div>

          <div className="ret-calc-gauge-wrap">
            <div className="ret-calc-gauge" style={{ ['--gauge' as string]: `${coveragePct}%` }}>
              <strong>{Math.round(coveragePct)}%</strong>
              <span>Target Coverage</span>
            </div>
            <div className="ret-calc-gauge-copy">
              <h3>Confidence Score: {result.confidenceScore}/99</h3>
              <p>
                {result.onTrack
                  ? `Projected surplus of ${formatCurrency(result.surplus)} with runway for ${result.yearsOfRunway} years.`
                  : `Projected shortfall of ${formatCurrency(result.shortfall)}. Raise savings and/or adjust retirement assumptions.`}
              </p>
            </div>
          </div>

          <div className="ret-calc-bars">
            <div className="ret-calc-bar">
              <div className="ret-calc-bar-meta">
                <span>Projected Savings</span>
                <strong>{formatCurrency(result.projectedSavings)}</strong>
              </div>
              <div className="ret-calc-track">
                <div className="ret-calc-fill is-projected" style={{ width: `${projectedPct}%` }} />
              </div>
            </div>
            <div className="ret-calc-bar">
              <div className="ret-calc-bar-meta">
                <span>Required Savings</span>
                <strong>{formatCurrency(result.requiredLumpSum)}</strong>
              </div>
              <div className="ret-calc-track">
                <div className="ret-calc-fill is-needed" style={{ width: `${requiredPct}%` }} />
              </div>
            </div>
            <div className="ret-calc-bar">
              <div className="ret-calc-bar-meta">
                <span>Net Annual Spend Need</span>
                <strong>{formatCurrency(result.netRetirementSpend)}</strong>
              </div>
              <div className="ret-calc-track">
                <div className="ret-calc-fill is-neutral" style={{ width: `${netSpendPct}%` }} />
              </div>
            </div>
          </div>

          <div className="ret-calc-stats">
            <article>
              <span>Years to Retirement</span>
              <strong>{result.yearsToRetirement}</strong>
            </article>
            <article>
              <span>Runway in Retirement</span>
              <strong>
                {result.yearsOfRunway}/{result.targetRunwayYears} years
              </strong>
            </article>
            <article>
              <span>Recommended Savings Rate</span>
              <strong>{Math.max(inputs.annualSavingsRate, result.recommendedSavingsRate).toFixed(1)}%</strong>
            </article>
            <article>
              <span>Extra Annual Contribution</span>
              <strong>{formatCurrency(result.annualContributionGap)}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="container ret-calc-timeline">
        <h3>Milestone Projection</h3>
        <div className="ret-calc-timeline-grid">
          {milestones.map((point) => (
            <article key={point.year}>
              <span>Age {point.age}</span>
              <strong>{formatCurrency(point.balance)}</strong>
              <small>Contribution: {formatCurrency(point.contribution)}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="container ret-calc-notes">
        <div className="ret-calc-note">
          <h3>Recommended Next Moves</h3>
          <ul>
            {actionItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ret-calc-note">
          <h3>Assumptions &amp; Disclosure</h3>
          <p>
            This model uses scenario-based return, inflation, and withdrawal assumptions. It is a
            planning estimator only, not investment advice or a guarantee of future outcomes.
          </p>
          <Link to="/contact-us" className="btn btn-outline">
            Build a Personalized Plan
          </Link>
        </div>
      </section>
    </article>
  )
}

export default RetirementCalculatorPage

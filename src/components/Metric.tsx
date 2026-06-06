type MetricProps = {
  label: string
  value: string
}

export function Metric({ label, value }: MetricProps) {
  return (
    <article className="metric-card">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  )
}

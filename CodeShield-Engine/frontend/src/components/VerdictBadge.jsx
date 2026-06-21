const VERDICT_STYLES = {
  Accepted: 'bg-shield-success-bg text-shield-success border-shield-success-border',
  'Wrong Answer': 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
  'Compilation Error': 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  'Runtime Error': 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
  'Time Limit Exceeded': 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  'Memory Limit Exceeded': 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  Queued: 'bg-shield-bg-inset text-shield-text-secondary border-shield-border',
  Evaluating: 'bg-shield-accent/10 text-shield-accent border-shield-border-glow animate-shield-pulse',
  Pending: 'bg-shield-bg-inset text-shield-text-secondary border-shield-border',
};

const VERDICT_ABBREVIATIONS = {
  'Time Limit Exceeded': 'TLE',
  'Memory Limit Exceeded': 'MLE',
};

export default function VerdictBadge({ status, className = '' }) {
  const style = VERDICT_STYLES[status] || VERDICT_STYLES.Pending;
  const label = status || 'Pending';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${style} ${className}`}
      title={VERDICT_ABBREVIATIONS[label] ? label : undefined}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

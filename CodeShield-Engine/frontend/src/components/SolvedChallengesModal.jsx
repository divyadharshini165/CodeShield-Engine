import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const DIFFICULTY_STYLES = {
  Easy: 'bg-shield-success-bg text-shield-success border-shield-success-border',
  Medium: 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  Hard: 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
};

const DIFFICULTY_BAR_STYLES = {
  Easy: 'bg-shield-success',
  Medium: 'bg-shield-warning',
  Hard: 'bg-shield-danger',
};

function DifficultyBar({ label, solved, total }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs font-mono text-shield-text-secondary shrink-0">{label}</span>
      <div className="flex-1 h-2.5 rounded-full bg-shield-bg-inset overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${DIFFICULTY_BAR_STYLES[label]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-16 text-right text-xs font-mono text-shield-text shrink-0">
        {solved}/{total}
      </span>
    </div>
  );
}

export default function SolvedChallengesModal({ solvedProblemsList, difficultyBreakdown, streak, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const list = solvedProblemsList || [];
  const breakdown = difficultyBreakdown || {
    Easy: { solved: 0, total: 0 },
    Medium: { solved: 0, total: 0 },
    Hard: { solved: 0, total: 0 },
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-shield-bg-panel border border-shield-border-glow shield-glow rounded-2xl shadow-2xl shadow-shield-shadow w-full max-w-lg max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-shield-border">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-shield-text">Your Solved Challenges</h3>
            {streak && streak.current > 0 && (
              <span className="flex items-center gap-1 text-xs font-mono text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full px-2 py-0.5">
                🔥 {streak.current} day{streak.current === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-shield-text-muted hover:text-shield-danger text-2xl leading-none transition cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Difficulty breakdown */}
        <div className="px-5 py-4 border-b border-shield-border space-y-2.5">
          <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono mb-1">
            Difficulty Breakdown
          </p>
          <DifficultyBar label="Easy" solved={breakdown.Easy.solved} total={breakdown.Easy.total} />
          <DifficultyBar label="Medium" solved={breakdown.Medium.solved} total={breakdown.Medium.total} />
          <DifficultyBar label="Hard" solved={breakdown.Hard.solved} total={breakdown.Hard.total} />
        </div>

        {/* Solved list */}
        <div className="flex-1 overflow-y-auto shield-scroll p-3">
          {list.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-shield-text-secondary text-sm">
                You haven't solved any challenges yet.
              </p>
              <Link
                to="/"
                onClick={onClose}
                className="mt-3 inline-block text-shield-accent hover:underline text-sm font-medium"
              >
                Browse Challenges →
              </Link>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {list.map((problem) => (
                <li key={problem._id}>
                  <Link
                    to={`/problems/${problem._id}`}
                    onClick={onClose}
                    className="group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border border-shield-border bg-shield-bg-inset hover:border-shield-accent/50 hover:bg-shield-accent/5 transition"
                  >
                    <span className="text-sm font-medium text-shield-text group-hover:text-shield-accent transition truncate">
                      {problem.title}
                    </span>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${DIFFICULTY_STYLES[problem.difficulty]}`}
                    >
                      {problem.difficulty}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-shield-border text-xs text-shield-text-muted font-mono">
          {list.length} challenge{list.length === 1 ? '' : 's'} solved
        </div>
      </div>
    </div>
  );
}

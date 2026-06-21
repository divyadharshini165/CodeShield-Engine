import { useEffect } from 'react';
import VerdictBadge from './VerdictBadge';

const LANGUAGE_LABELS = {
  python: 'Python 3',
  javascript: 'JavaScript (Node)',
  c: 'C',
  cpp: 'C++',
  java: 'Java',
  bash: 'Bash',
};

export default function CodeViewModal({ submission, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!submission) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-shield-bg-panel border border-shield-border rounded-2xl shadow-2xl shadow-shield-shadow w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-shield-border">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-semibold text-shield-text">Submission Source</h3>
            <VerdictBadge status={submission.status} />
            <span className="text-xs font-mono text-shield-text-muted border border-shield-border rounded px-2 py-0.5">
              {LANGUAGE_LABELS[submission.language] || submission.language}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-shield-text-muted hover:text-shield-text transition cursor-pointer text-xl leading-none px-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto shield-scroll p-5">
          <pre className="text-sm font-mono text-shield-text whitespace-pre-wrap break-words bg-shield-bg-inset border border-shield-border rounded-lg p-4">
            {submission.code}
          </pre>

          {submission.output && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono mb-2">
                Diagnostic Output
              </p>
              <pre className="text-xs font-mono text-shield-danger whitespace-pre-wrap break-words bg-shield-danger-bg border border-shield-danger-border rounded-lg p-4">
                {submission.output}
              </pre>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-shield-border text-xs text-shield-text-muted font-mono">
          Submitted {new Date(submission.submittedAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

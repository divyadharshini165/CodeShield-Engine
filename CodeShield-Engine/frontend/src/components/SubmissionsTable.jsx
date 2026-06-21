import { useState } from 'react';
import VerdictBadge from './VerdictBadge';
import CodeViewModal from './CodeViewModal';

const LANGUAGE_LABELS = {
  python: 'Python 3',
  javascript: 'JavaScript',
  c: 'C',
  cpp: 'C++',
  java: 'Java',
  bash: 'Bash',
};

export default function SubmissionsTable({ submissions, loading, isAuthenticated }) {
  const [activeSubmission, setActiveSubmission] = useState(null);

  if (loading) {
    return (
      <div className="py-10 text-center text-shield-text-secondary text-sm animate-shield-pulse">
        Loading submission history…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="py-10 text-center text-shield-text-secondary text-sm">
        Log in to view your personal submission history for this challenge.
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="py-10 text-center text-shield-text-secondary text-sm">
        No submissions yet. Run your code to populate your history.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto shield-scroll">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-shield-text-muted font-mono border-b border-shield-border">
              <th className="py-2.5 pr-4 font-medium">Date / Time</th>
              <th className="py-2.5 pr-4 font-medium">Language</th>
              <th className="py-2.5 pr-4 font-medium">Verdict</th>
              <th className="py-2.5 pr-4 font-medium text-right">Code</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s._id} className="border-b border-shield-border/60 hover:bg-shield-bg-inset/60 transition">
                <td className="py-2.5 pr-4 text-shield-text-secondary font-mono text-xs whitespace-nowrap">
                  {new Date(s.submittedAt).toLocaleString()}
                </td>
                <td className="py-2.5 pr-4 text-shield-text">
                  {LANGUAGE_LABELS[s.language] || s.language}
                </td>
                <td className="py-2.5 pr-4">
                  <VerdictBadge status={s.status} />
                </td>
                <td className="py-2.5 pr-4 text-right">
                  <button
                    onClick={() => setActiveSubmission(s)}
                    className="text-shield-accent hover:underline text-xs font-medium cursor-pointer"
                  >
                    View Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CodeViewModal submission={activeSubmission} onClose={() => setActiveSubmission(null)} />
    </>
  );
}

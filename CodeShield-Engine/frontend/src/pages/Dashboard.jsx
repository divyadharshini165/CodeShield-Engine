import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SolvedChallengesModal from '../components/SolvedChallengesModal';
import ProgressionChart from '../components/ProgressionChart';

const DIFFICULTY_STYLES = {
  Easy: 'bg-shield-success-bg text-shield-success border-shield-success-border',
  Medium: 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  Hard: 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
};

function StatCard({ label, value, accent, onClick, interactive, badge }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      className={`text-left bg-shield-bg-panel border rounded-xl p-5 transition duration-200 ${
        interactive
          ? 'border-shield-border-glow/50 shield-glow cursor-pointer hover:border-shield-accent hover:shadow-[0_0_28px_-6px_var(--shield-border-glow)] hover:-translate-y-0.5 group'
          : 'border-shield-border shield-glow'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono">{label}</p>
        {interactive && (
          <span className="text-shield-accent text-xs opacity-0 group-hover:opacity-100 transition translate-x-[-4px] group-hover:translate-x-0">
            View →
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <p className={`text-3xl font-display font-bold ${accent || 'text-shield-text'}`}>{value}</p>
        {badge}
      </div>
    </Tag>
  );
}

function StreakFlame({ streak }) {
  if (!streak || streak.current <= 0) return null;
  return (
    <span
      className="flex items-center gap-1 text-sm font-mono text-orange-400"
      title={`Longest streak: ${streak.longest} day${streak.longest === 1 ? '' : 's'}`}
    >
      <span className="text-lg animate-shield-pulse">🔥</span>
      {streak.current}
    </span>
  );
}

const VERDICT_BAR_STYLES = {
  'Accepted': 'bg-shield-success',
  'Wrong Answer': 'bg-shield-danger',
  'Time Limit Exceeded': 'bg-shield-warning',
  'Memory Limit Exceeded': 'bg-shield-warning',
  'Compilation Error': 'bg-shield-text-muted',
  'Runtime Error': 'bg-shield-danger',
};

const VERDICT_LABELS = {
  'Accepted': 'Accepted',
  'Wrong Answer': 'Wrong Answer',
  'Time Limit Exceeded': 'TLE',
  'Memory Limit Exceeded': 'MLE',
  'Compilation Error': 'Compile Error',
  'Runtime Error': 'Runtime Error',
};

function VerdictBreakdownChart({ breakdown }) {
  const rows = Object.entries(VERDICT_LABELS)
    .map(([key, label]) => ({ key, label, count: breakdown[key] || 0 }));
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-3">
          <span className="w-28 text-xs font-mono text-shield-text-secondary shrink-0">{row.label}</span>
          <div className="flex-1 h-2.5 rounded-full bg-shield-bg-inset overflow-hidden">
            <div className={`h-full rounded-full ${VERDICT_BAR_STYLES[row.key]}`} style={{ width: `${(row.count / max) * 100}%` }} />
          </div>
          <span className="w-12 text-right text-xs font-mono text-shield-text">{row.count}</span>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, user, stats, refreshProfile } = useAuth();

  const [problems, setProblems] = useState([]);
  const [platformStats, setPlatformStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState(new Set());
  const [solvedModalOpen, setSolvedModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [problemsRes, statsRes] = await Promise.all([
          api.get('/problems'),
          api.get('/problems/stats'),
        ]);
        if (!isMounted) return;
        setProblems(problemsRes.data);
        setPlatformStats(statsRes.data);
      } catch {
        if (!isMounted) return;
        setError('Unable to reach the CodeShield judging engine. Confirm the backend server is running on port 5000.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    if (isAuthenticated) refreshProfile();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const categories = useMemo(() => {
    const set = new Set(problems.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [problems]);

  // Collect all unique tags across all problems, sorted alphabetically.
  const allTags = useMemo(() => {
    const set = new Set();
    problems.forEach((p) => (p.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [problems]);

  const solvedSet = useMemo(() => new Set((user?.solvedProblems || []).map((id) => id.toString())), [user]);

  const toggleTag = (tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch('');
    setDifficultyFilter('All');
    setCategoryFilter('All');
    setActiveTags(new Set());
  };

  const hasActiveFilters = search.trim() || difficultyFilter !== 'All' || categoryFilter !== 'All' || activeTags.size > 0;

  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (search.trim() && !p.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      // Multi-tag filter: problem must contain ALL active tags.
      if (activeTags.size > 0) {
        const pTags = new Set(p.tags || []);
        for (const t of activeTags) {
          if (!pTags.has(t)) return false;
        }
      }
      return true;
    });
  }, [problems, difficultyFilter, categoryFilter, search, activeTags]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-shield-text">
          Assessment Dashboard
        </h1>
        <p className="text-shield-text-secondary mt-2 max-w-2xl text-sm sm:text-base">
          Select a challenge below to enter the proctored coding workspace. Every submission is
          compiled and executed in an isolated sandbox across our six-language matrix.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Submissions Evaluated" value={platformStats ? platformStats.totalSubmissions.toLocaleString() : '—'} />
        <StatCard
          label="Your Solved Challenges"
          value={isAuthenticated ? (stats?.yourSolvedChallenges ?? solvedSet.size) : '—'}
          accent="text-shield-success"
          interactive={isAuthenticated}
          onClick={isAuthenticated ? () => setSolvedModalOpen(true) : undefined}
          badge={
            isAuthenticated ? (
              <div className="flex items-center gap-2 bg-orange-950/30 border border-orange-900/40 rounded-full px-3 py-1 shadow-sm">
                <span className="text-base animate-pulse">🔥</span>
                <span className="text-xs font-mono font-bold text-orange-400">
                  {stats?.streak?.current ?? 1} Day Streak
                </span>
              </div>
            ) : null
          }
        />
        <StatCard label="Overall Platform Accuracy" value={platformStats ? `${platformStats.platformAccuracy}%` : '—'} accent="text-shield-accent" />
      </div>

      {/* Progression Graph */}
      {isAuthenticated && (
        <div className="bg-shield-bg-panel border border-shield-border rounded-xl p-5 mb-6 shield-glow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono">
                Your Progression Matrix
              </p>
              <p className="text-xs text-shield-text-muted font-mono mt-0.5">
                Cumulative challenges solved over time
              </p>
            </div>
            <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-shield-accent/10 border border-shield-accent/20 text-shield-accent">
              Live Tracker Active
            </div>
          </div>
          <div className="mt-4 min-h-[160px] flex flex-col justify-center">
            <ProgressionChart timeline={stats?.solvedTimeline || [{ date: new Date().toLocaleDateString(), count: solvedSet.size || 1 }]} />
          </div>
        </div>
      )}

      {/* Verdict Breakdown + Language Stats */}
      {platformStats?.verdictBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
          <div className="bg-shield-bg-panel border border-shield-border rounded-xl p-5 shield-glow">
            <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono mb-4">Verdict Breakdown</p>
            <VerdictBreakdownChart breakdown={platformStats.verdictBreakdown} />
          </div>
          {platformStats.languageStats && platformStats.languageStats.length > 0 && (
            <div className="bg-shield-bg-panel border border-shield-border rounded-xl p-5 shield-glow">
              <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono mb-4">Language Usage</p>
              <div className="space-y-2.5">
                {[...platformStats.languageStats].sort((a, b) => b.totalSubmissions - a.totalSubmissions).map((ls) => {
                  const rate = ls.totalSubmissions > 0 ? Math.round((ls.acceptedSubmissions / ls.totalSubmissions) * 100) : 0;
                  return (
                    <div key={ls.language} className="flex items-center gap-3">
                      <span className="w-24 text-xs font-mono text-shield-text-secondary shrink-0 capitalize">{ls.language}</span>
                      <div className="flex-1 h-2.5 rounded-full bg-shield-bg-inset overflow-hidden">
                        <div className="h-full rounded-full bg-shield-accent" style={{ width: `${rate}%` }} />
                      </div>
                      <span className="w-14 text-right text-xs font-mono text-shield-text">{rate}% AC</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {!isAuthenticated && (
        <div className="mb-8 bg-shield-bg-panel border border-shield-border rounded-xl px-5 py-4 text-sm text-shield-text-secondary flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span>
            <Link to="/login" className="text-shield-accent font-semibold hover:underline">Log in</Link>
            {' '}or{' '}
            <Link to="/signup" className="text-shield-accent font-semibold hover:underline">create an account</Link>
            {' '}to track solved challenges and view your personal submission history.
          </span>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Search + Difficulty + Category filters                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search challenges by title…"
          className="flex-1 px-3.5 py-2.5 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text placeholder:text-shield-text-muted focus:outline-none focus:ring-2 focus:ring-shield-accent/40 transition text-sm"
        />
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text focus:outline-none focus:ring-2 focus:ring-shield-accent/40 transition text-sm cursor-pointer"
        >
          {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
            <option key={d} value={d}>{d === 'All' ? 'All Difficulties' : d}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text focus:outline-none focus:ring-2 focus:ring-shield-accent/40 transition text-sm cursor-pointer"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3.5 py-2.5 text-sm text-shield-text-muted border border-shield-border rounded-lg hover:text-shield-danger hover:border-shield-danger/40 transition cursor-pointer whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Multi-tag chip row                                                  */}
      {/* ------------------------------------------------------------------ */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => {
            const active = activeTags.has(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition cursor-pointer ${
                  active
                    ? 'bg-shield-accent text-white border-shield-accent shadow-sm shadow-shield-accent/30'
                    : 'bg-shield-bg-inset text-shield-text-secondary border-shield-border hover:border-shield-accent/50 hover:text-shield-accent'
                }`}
              >
                {active && <span className="mr-1">✓</span>}
                {tag}
              </button>
            );
          })}
        </div>
      )}

      {/* Problem List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-shield-accent font-medium animate-shield-pulse">Syncing with database engine…</p>
        </div>
      ) : error ? (
        <div className="bg-shield-danger-bg border border-shield-danger-border text-shield-danger rounded-xl px-5 py-4 text-sm">
          {error}
        </div>
      ) : (
        <>
          <p className="text-xs text-shield-text-muted font-mono mb-3">
            {filteredProblems.length} of {problems.length} challenges
            {activeTags.size > 0 && <span className="ml-2 text-shield-accent">· filtered by {activeTags.size} tag{activeTags.size > 1 ? 's' : ''}</span>}
          </p>
          <div className="grid gap-3">
            {filteredProblems.map((problem) => {
              const isSolved = solvedSet.has(problem._id);
              return (
                <Link
                  key={problem._id}
                  to={`/problems/${problem._id}`}
                  className="group p-5 bg-shield-bg-panel rounded-xl border border-shield-border hover:border-shield-accent/50 hover:shield-glow transition duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-base font-semibold text-shield-text group-hover:text-shield-accent transition truncate">
                        {problem.title}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border border-shield-border text-shield-text-muted">
                        {problem.category}
                      </span>
                      {isSolved && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-shield-success-bg text-shield-success border-shield-success-border">
                          ✓ Solved
                        </span>
                      )}
                    </div>
                    <p className="text-shield-text-secondary text-sm max-w-2xl line-clamp-2">
                      {problem.description}
                    </p>
                    {/* Tag chips on the card (read-only) */}
                    {problem.tags && problem.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {problem.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                              activeTags.has(tag)
                                ? 'bg-shield-accent/20 text-shield-accent border-shield-accent/40'
                                : 'bg-shield-bg-inset text-shield-text-muted border-shield-border'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {problem.tags.length > 6 && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono border bg-shield-bg-inset text-shield-text-muted border-shield-border">
                            +{problem.tags.length - 6}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 px-5 py-2.5 bg-shield-accent text-white text-sm font-semibold rounded-lg shadow-lg shadow-shield-accent/20 group-hover:bg-shield-accent-strong transition text-center">
                    Solve Challenge
                  </span>
                </Link>
              );
            })}
            {filteredProblems.length === 0 && (
              <div className="text-center py-16 text-shield-text-secondary text-sm">
                No challenges match your filters.{' '}
                <button onClick={clearFilters} className="text-shield-accent hover:underline cursor-pointer">Clear all filters</button>
              </div>
            )}
          </div>
        </>
      )}

      {solvedModalOpen && (
        <SolvedChallengesModal
          solvedProblemsList={stats?.solvedProblemsList}
          difficultyBreakdown={stats?.difficultyBreakdown}
          streak={stats?.streak}
          onClose={() => setSolvedModalOpen(false)}
        />
      )}
    </div>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { getSocket } from '../api/socket';
import { useAuth } from '../context/AuthContext';

const RANK_STYLES = {
  1: 'text-yellow-400',
  2: 'text-slate-300',
  3: 'text-amber-600',
};

const RANK_MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

function RankBadge({ rank }) {
  return (
    <span className={`font-display font-bold text-lg w-8 text-center shrink-0 ${RANK_STYLES[rank] || 'text-shield-text-muted'}`}>
      {RANK_MEDALS[rank] || `#${rank}`}
    </span>
  );
}

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaderboard = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/leaderboard', { params: { limit: 50 } });
      setEntries(res.data);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError('Unable to fetch leaderboard. Ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Listen for leaderboard update events from the server (emitted when a
  // new Accepted submission is graded by the BullMQ worker).
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => fetchLeaderboard(true);
    socket.on('leaderboard:update', handleUpdate);
    return () => socket.off('leaderboard:update', handleUpdate);
  }, [fetchLeaderboard]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-shield-text">
            Leaderboard
          </h1>
          <p className="mt-1 text-sm text-shield-text-muted">
            Ranked by total solved challenges · acceptance rate as tiebreaker
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {lastUpdated && (
            <span className="text-xs text-shield-text-muted font-mono">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchLeaderboard()}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium bg-shield-bg-panel border border-shield-border rounded-lg text-shield-text-secondary hover:border-shield-accent hover:text-shield-accent transition cursor-pointer"
          >
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-2 mb-6 text-xs text-shield-text-muted font-mono">
        <span className="w-1.5 h-1.5 rounded-full bg-shield-accent animate-shield-pulse" />
        Live — refreshes automatically when new solutions are accepted
      </div>

      {error && (
        <div className="bg-shield-danger-bg border border-shield-danger-border text-shield-danger rounded-xl px-5 py-4 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <p className="text-shield-accent font-medium animate-shield-pulse">Computing rankings…</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-shield-bg-panel border border-shield-border rounded-xl p-10 text-center">
          <p className="text-shield-text-muted text-sm">
            No submissions yet. Be the first to solve a challenge!
          </p>
          <Link to="/" className="mt-4 inline-block text-shield-accent hover:underline text-sm">
            Browse Challenges →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden sm:grid sm:grid-cols-[2rem_1fr_7rem_7rem_7rem_7rem] items-center gap-4 px-5 py-2 text-xs font-mono text-shield-text-muted uppercase tracking-wider">
            <span>#</span>
            <span>Competitor</span>
            <span className="text-right">Solved</span>
            <span className="text-right">Submissions</span>
            <span className="text-right">Accepted</span>
            <span className="text-right">AC%</span>
          </div>

          {entries.map((entry) => {
            const isCurrentUser = user && String(user._id) === String(entry.userId);
            return (
              <div
                key={String(entry.userId)}
                className={`grid grid-cols-[2rem_1fr] sm:grid-cols-[2rem_1fr_7rem_7rem_7rem_7rem] items-center gap-4 px-5 py-4 rounded-xl border transition ${
                  isCurrentUser
                    ? 'bg-shield-accent/10 border-shield-border-glow shadow-[0_0_20px_-8px_var(--shield-border-glow)]'
                    : 'bg-shield-bg-panel border-shield-border hover:border-shield-border-strong'
                }`}
              >
                <RankBadge rank={entry.rank} />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm truncate ${isCurrentUser ? 'text-shield-accent' : 'text-shield-text'}`}>
                      {entry.username}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs text-shield-accent border border-shield-border-glow rounded px-1.5 py-0.5 font-mono shrink-0">You</span>
                    )}
                  </div>
                  <div className="sm:hidden mt-1 flex gap-4 text-xs text-shield-text-muted font-mono">
                    <span>{entry.totalSolved} solved</span>
                    <span>{entry.acceptanceRate}% AC</span>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-lg font-display font-bold text-shield-accent">{entry.totalSolved}</span>
                </div>
                <div className="hidden sm:block text-right text-sm text-shield-text-secondary font-mono">
                  {entry.totalSubmissions}
                </div>
                <div className="hidden sm:block text-right text-sm text-shield-success font-mono">
                  {entry.acceptedSubmissions}
                </div>
                <div className="hidden sm:block text-right">
                  <span className={`text-sm font-mono font-semibold ${
                    entry.acceptanceRate >= 70 ? 'text-shield-success'
                      : entry.acceptanceRate >= 40 ? 'text-shield-warning'
                      : 'text-shield-danger'
                  }`}>
                    {entry.acceptanceRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

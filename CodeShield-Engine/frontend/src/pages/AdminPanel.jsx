import { useEffect, useState, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VerdictBadge from '../components/VerdictBadge';

// ---------------------------------------------------------------------------
// Reusable primitives
// ---------------------------------------------------------------------------
function AdminSection({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="text-lg font-display font-semibold text-shield-text mb-4 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-shield-accent inline-block" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Pill({ label, variant = 'default' }) {
  const styles = {
    default: 'bg-shield-bg-inset text-shield-text-muted border-shield-border',
    success: 'bg-shield-success-bg text-shield-success border-shield-success-border',
    danger: 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
    accent: 'bg-shield-accent/10 text-shield-accent border-shield-border-glow',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]}`}>
      {label}
    </span>
  );
}

const DIFFICULTY_VARIANTS = { Easy: 'success', Medium: 'default', Hard: 'danger' };

// ---------------------------------------------------------------------------
// Problem Form Modal (Create + Edit)
// ---------------------------------------------------------------------------
const EMPTY_FORM = {
  title: '', description: '', difficulty: 'Easy', category: 'General',
  tags: '', timeLimit: 2000, memoryLimit: 512,
  sampleInput: '', sampleOutput: '',
  testCases: [{ input: '', expectedOutput: '' }],
};

function ProblemModal({ initial, onClose, onSaved }) {
  const [form, setForm] = useState(() =>
    initial
      ? { ...initial, tags: (initial.tags || []).join(', '), testCases: initial.testCases?.length ? initial.testCases : EMPTY_FORM.testCases }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const setTC = (idx, field, value) => {
    const tcs = [...form.testCases];
    tcs[idx] = { ...tcs[idx], [field]: value };
    setForm((f) => ({ ...f, testCases: tcs }));
  };

  const addTC = () => setForm((f) => ({ ...f, testCases: [...f.testCases, { input: '', expectedOutput: '' }] }));
  const removeTC = (idx) => setForm((f) => ({ ...f, testCases: f.testCases.filter((_, i) => i !== idx) }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        timeLimit: Number(form.timeLimit),
        memoryLimit: Number(form.memoryLimit),
      };
      let res;
      if (initial?._id) {
        res = await api.put(`/admin/problems/${initial._id}`, payload);
      } else {
        res = await api.post('/admin/problems', payload);
      }
      onSaved(res.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-shield-bg-elevated border border-shield-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-shield-border shrink-0">
          <h3 className="font-display font-semibold text-shield-text">
            {initial ? 'Edit Problem' : 'Create Problem'}
          </h3>
          <button onClick={onClose} className="text-shield-text-muted hover:text-shield-danger cursor-pointer text-xl leading-none">✕</button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4 shield-scroll">
          {error && <p className="text-sm text-shield-danger bg-shield-danger-bg border border-shield-danger-border rounded-lg px-3 py-2">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Title *</label>
              <input value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40" />
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Difficulty *</label>
              <select value={form.difficulty} onChange={(e) => set('difficulty', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 cursor-pointer">
                {['Easy', 'Medium', 'Hard'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Category</label>
              <input value={form.category} onChange={(e) => set('category', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Tags (comma-separated)</label>
              <input value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Arrays, Hash Map, Two Pointers" className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40" />
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Time Limit (ms)</label>
              <input type="number" value={form.timeLimit} onChange={(e) => set('timeLimit', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40" />
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Memory Limit (MB)</label>
              <input type="number" value={form.memoryLimit} onChange={(e) => set('memoryLimit', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Description *</label>
              <textarea rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 resize-y font-mono" />
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Sample Input</label>
              <textarea rows={3} value={form.sampleInput} onChange={(e) => set('sampleInput', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 resize-y font-mono" />
            </div>
            <div>
              <label className="block text-xs text-shield-text-muted font-mono mb-1">Sample Output</label>
              <textarea rows={3} value={form.sampleOutput} onChange={(e) => set('sampleOutput', e.target.value)} className="w-full px-3 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 resize-y font-mono" />
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-shield-text-muted font-mono">Test Cases * (min 1)</label>
              <button onClick={addTC} className="text-xs text-shield-accent hover:underline cursor-pointer">+ Add Test Case</button>
            </div>
            <div className="space-y-3">
              {form.testCases.map((tc, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-3 p-3 bg-shield-bg-inset rounded-lg border border-shield-border relative">
                  <div>
                    <p className="text-[10px] text-shield-text-muted font-mono mb-1">Input</p>
                    <textarea rows={2} value={tc.input} onChange={(e) => setTC(idx, 'input', e.target.value)} className="w-full px-2 py-1.5 bg-shield-bg-panel border border-shield-border rounded text-shield-text text-xs font-mono focus:outline-none focus:ring-1 focus:ring-shield-accent/40 resize-none" />
                  </div>
                  <div>
                    <p className="text-[10px] text-shield-text-muted font-mono mb-1">Expected Output</p>
                    <textarea rows={2} value={tc.expectedOutput} onChange={(e) => setTC(idx, 'expectedOutput', e.target.value)} className="w-full px-2 py-1.5 bg-shield-bg-panel border border-shield-border rounded text-shield-text text-xs font-mono focus:outline-none focus:ring-1 focus:ring-shield-accent/40 resize-none" />
                  </div>
                  {form.testCases.length > 1 && (
                    <button onClick={() => removeTC(idx)} className="absolute top-2 right-2 text-shield-text-muted hover:text-shield-danger text-xs cursor-pointer">✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-shield-border shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm text-shield-text-secondary border border-shield-border rounded-lg hover:border-shield-danger/40 hover:text-shield-danger transition cursor-pointer">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 text-sm font-semibold bg-shield-accent text-white rounded-lg hover:bg-shield-accent-strong transition cursor-pointer disabled:opacity-50">
            {saving ? 'Saving…' : initial ? 'Update Problem' : 'Create Problem'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin Panel page
// ---------------------------------------------------------------------------
export default function AdminPanel() {
  const { user, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('problems');

  // Problems state
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [probSearch, setProbSearch] = useState('');
  const [modalProblem, setModalProblem] = useState(undefined); // undefined = closed, null = new, obj = edit

  // Submissions state
  const [submissions, setSubmissions] = useState([]);
  const [subPage, setSubPage] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [subTotalPages, setSubTotalPages] = useState(1);
  const [subLoading, setSubLoading] = useState(false);
  const [subStatusFilter, setSubStatusFilter] = useState('');

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Platform stats
  const [platformStats, setPlatformStats] = useState(null);

  // ---- Data fetchers ---------------------------------------------------

  const fetchProblems = useCallback(async () => {
    setProblemsLoading(true);
    try {
      const res = await api.get('/admin/problems', { params: { search: probSearch || undefined } });
      setProblems(res.data);
    } catch { /* swallow */ }
    finally { setProblemsLoading(false); }
  }, [probSearch]);

  const fetchSubmissions = useCallback(async () => {
    setSubLoading(true);
    try {
      const res = await api.get('/admin/submissions', {
        params: { page: subPage, limit: 20, status: subStatusFilter || undefined }
      });
      setSubmissions(res.data.submissions);
      setSubTotal(res.data.pagination.total);
      setSubTotalPages(res.data.pagination.totalPages);
    } catch { /* swallow */ }
    finally { setSubLoading(false); }
  }, [subPage, subStatusFilter]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch { /* swallow */ }
    finally { setUsersLoading(false); }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setPlatformStats(res.data);
    } catch { /* swallow */ }
  }, []);

  // Load data for the active tab
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === 'problems') fetchProblems(); }, [activeTab, probSearch]);
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === 'submissions') fetchSubmissions(); }, [activeTab, subPage, subStatusFilter]);
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === 'users') fetchUsers(); }, [activeTab]);
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { if (activeTab === 'stats') fetchStats(); }, [activeTab]);

  // Guard: non-admin users are redirected silently.
  // This must come AFTER all hooks so React's hook order is stable.
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleDeleteProblem = async (id, title) => {
    if (!window.confirm(`Permanently delete "${title}" and all its submissions?`)) return;
    try {
      await api.delete(`/admin/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed.');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const next = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change this user's role to "${next}"?`)) return;
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: next });
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role: next } : u));
    } catch (err) {
      alert(err.response?.data?.error || 'Role update failed.');
    }
  };

  const TABS = [
    { key: 'problems', label: 'Problems' },
    { key: 'submissions', label: 'Submission Log' },
    { key: 'users', label: 'Users' },
    { key: 'stats', label: 'Platform Stats' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-bold text-shield-text">Admin Panel</h1>
            <Pill label="ADMIN" variant="accent" />
          </div>
          <p className="text-sm text-shield-text-muted">
            Full platform control — CRUD on problems, live submission log, user management.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-shield-border mb-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.key
                ? 'border-shield-accent text-shield-accent'
                : 'border-transparent text-shield-text-secondary hover:text-shield-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* PROBLEMS TAB                                                       */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'problems' && (
        <AdminSection title="Problem Bank">
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              value={probSearch}
              onChange={(e) => setProbSearch(e.target.value)}
              placeholder="Search problems by title…"
              className="flex-1 min-w-48 px-3.5 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40"
            />
            <button
              onClick={() => setModalProblem(null)}
              className="px-4 py-2 bg-shield-accent text-white text-sm font-semibold rounded-lg hover:bg-shield-accent-strong transition cursor-pointer shadow-lg shadow-shield-accent/20"
            >
              + New Problem
            </button>
          </div>

          {problemsLoading ? (
            <p className="text-shield-accent animate-shield-pulse text-sm py-8 text-center">Loading problems…</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-shield-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-shield-border bg-shield-bg-inset text-left">
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Tags</th>
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Test Cases</th>
                    <th className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-shield-border">
                  {problems.map((p) => (
                    <tr key={p._id} className="bg-shield-bg-panel hover:bg-shield-bg-elevated transition">
                      <td className="px-4 py-3 font-medium text-shield-text max-w-xs truncate">{p.title}</td>
                      <td className="px-4 py-3"><Pill label={p.difficulty} variant={DIFFICULTY_VARIANTS[p.difficulty]} /></td>
                      <td className="px-4 py-3 text-shield-text-secondary text-xs font-mono">{p.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(p.tags || []).slice(0, 3).map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-shield-accent/10 text-shield-accent border border-shield-border-glow/40">{t}</span>
                          ))}
                          {(p.tags || []).length > 3 && <span className="text-[10px] text-shield-text-muted">+{p.tags.length - 3}</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-shield-text-muted text-xs font-mono">{p.testCases?.length || 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setModalProblem(p)} className="text-xs text-shield-accent hover:underline cursor-pointer">Edit</button>
                          <span className="text-shield-border">|</span>
                          <button onClick={() => handleDeleteProblem(p._id, p.title)} className="text-xs text-shield-danger hover:underline cursor-pointer">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {problems.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-shield-text-muted text-sm">No problems found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </AdminSection>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* SUBMISSIONS TAB                                                    */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'submissions' && (
        <AdminSection title="Live Submission Log">
          <div className="flex gap-3 mb-4 flex-wrap items-center">
            <select
              value={subStatusFilter}
              onChange={(e) => { setSubStatusFilter(e.target.value); setSubPage(1); }}
              className="px-3.5 py-2 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 cursor-pointer"
            >
              <option value="">All Verdicts</option>
              {['Accepted','Wrong Answer','Time Limit Exceeded','Memory Limit Exceeded','Compilation Error','Runtime Error','Queued','Evaluating'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="text-xs text-shield-text-muted font-mono ml-auto">{subTotal} submissions</span>
          </div>

          {subLoading ? (
            <p className="text-shield-accent animate-shield-pulse text-sm py-8 text-center">Loading submissions…</p>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-shield-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-shield-border bg-shield-bg-inset text-left">
                      {['Submitted At','User','Problem','Language','Verdict','Time'].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-shield-border">
                    {submissions.map((s) => (
                      <tr key={s._id} className="bg-shield-bg-panel hover:bg-shield-bg-elevated transition">
                        <td className="px-4 py-3 text-xs font-mono text-shield-text-muted whitespace-nowrap">
                          {new Date(s.submittedAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-shield-text-secondary text-xs font-mono">
                          {s.userId?.username || <span className="text-shield-text-muted italic">anon</span>}
                        </td>
                        <td className="px-4 py-3 text-shield-text text-xs max-w-xs truncate">
                          {s.problemId?.title || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-shield-text-secondary capitalize">{s.language}</td>
                        <td className="px-4 py-3"><VerdictBadge status={s.status} /></td>
                        <td className="px-4 py-3 text-xs font-mono text-shield-text-muted">
                          {s.executionTime != null ? `${s.executionTime}ms` : '—'}
                        </td>
                      </tr>
                    ))}
                    {submissions.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-10 text-center text-shield-text-muted text-sm">No submissions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              {subTotalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <button disabled={subPage <= 1} onClick={() => setSubPage((p) => p - 1)} className="px-3 py-1.5 text-xs border border-shield-border rounded-lg text-shield-text-secondary hover:border-shield-accent hover:text-shield-accent transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">← Prev</button>
                  <span className="text-xs text-shield-text-muted font-mono">Page {subPage} / {subTotalPages}</span>
                  <button disabled={subPage >= subTotalPages} onClick={() => setSubPage((p) => p + 1)} className="px-3 py-1.5 text-xs border border-shield-border rounded-lg text-shield-text-secondary hover:border-shield-accent hover:text-shield-accent transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">Next →</button>
                </div>
              )}
            </>
          )}
        </AdminSection>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* USERS TAB                                                          */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <AdminSection title="User Management">
          {usersLoading ? (
            <p className="text-shield-accent animate-shield-pulse text-sm py-8 text-center">Loading users…</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-shield-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-shield-border bg-shield-bg-inset text-left">
                    {['Username','Email','Role','Solved','Joined','Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-xs font-mono text-shield-text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-shield-border">
                  {users.map((u) => (
                    <tr key={u._id} className="bg-shield-bg-panel hover:bg-shield-bg-elevated transition">
                      <td className="px-4 py-3 font-medium text-shield-text">{u.username}</td>
                      <td className="px-4 py-3 text-shield-text-secondary text-xs font-mono">{u.email}</td>
                      <td className="px-4 py-3">
                        <Pill label={u.role.toUpperCase()} variant={u.role === 'admin' ? 'accent' : 'default'} />
                      </td>
                      <td className="px-4 py-3 text-shield-text font-mono text-xs">{u.solvedProblems?.length || 0}</td>
                      <td className="px-4 py-3 text-shield-text-muted text-xs font-mono">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {u._id !== user?._id && (
                          <button onClick={() => handleToggleRole(u._id, u.role)} className={`text-xs hover:underline cursor-pointer ${u.role === 'admin' ? 'text-shield-danger' : 'text-shield-accent'}`}>
                            {u.role === 'admin' ? 'Demote' : 'Promote to Admin'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-shield-text-muted text-sm">No users found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </AdminSection>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* STATS TAB                                                          */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'stats' && (
        <AdminSection title="Platform Statistics">
          {!platformStats ? (
            <p className="text-shield-accent animate-shield-pulse text-sm py-8 text-center">Loading stats…</p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Total Users', value: platformStats.totalUsers },
                  { label: 'Total Problems', value: platformStats.totalProblems },
                  { label: 'Total Submissions', value: platformStats.totalSubmissions },
                ].map((s) => (
                  <div key={s.label} className="bg-shield-bg-panel border border-shield-border rounded-xl p-5 shield-glow">
                    <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono">{s.label}</p>
                    <p className="mt-2 text-3xl font-display font-bold text-shield-accent">{s.value?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              {platformStats.submissionsByDate && Object.keys(platformStats.submissionsByDate).length > 0 && (
                <div className="bg-shield-bg-panel border border-shield-border rounded-xl p-5">
                  <p className="text-xs uppercase tracking-wider text-shield-text-muted font-mono mb-4">Recent Submission Activity (by date)</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="text-shield-text-muted border-b border-shield-border">
                          <th className="pb-2 text-left">Date</th>
                          <th className="pb-2 text-right">Accepted</th>
                          <th className="pb-2 text-right">Wrong Answer</th>
                          <th className="pb-2 text-right">TLE</th>
                          <th className="pb-2 text-right">CE</th>
                          <th className="pb-2 text-right">RE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-shield-border">
                        {Object.entries(platformStats.submissionsByDate)
                          .sort(([a], [b]) => b.localeCompare(a))
                          .slice(0, 14)
                          .map(([date, counts]) => (
                            <tr key={date} className="text-shield-text-secondary">
                              <td className="py-2">{date}</td>
                              <td className="py-2 text-right text-shield-success">{counts['Accepted'] || 0}</td>
                              <td className="py-2 text-right text-shield-danger">{counts['Wrong Answer'] || 0}</td>
                              <td className="py-2 text-right text-shield-warning">{counts['Time Limit Exceeded'] || 0}</td>
                              <td className="py-2 text-right text-shield-warning">{counts['Compilation Error'] || 0}</td>
                              <td className="py-2 text-right text-shield-danger">{counts['Runtime Error'] || 0}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </AdminSection>
      )}

      {/* Problem Create/Edit Modal */}
      {modalProblem !== undefined && (
        <ProblemModal
          initial={modalProblem}
          onClose={() => setModalProblem(undefined)}
          onSaved={(saved) => {
            if (modalProblem?._id) {
              setProblems((prev) => prev.map((p) => p._id === saved._id ? saved : p));
            } else {
              setProblems((prev) => [saved, ...prev]);
            }
          }}
        />
      )}
    </div>
  );
}

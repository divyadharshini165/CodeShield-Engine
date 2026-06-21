import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api, { API_BASE_URL } from '../api/axios';
import { getSocket } from '../api/socket';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LANGUAGES, LANGUAGE_MAP, DEFAULT_LANGUAGE } from '../constants/languages';
import VerdictBadge from '../components/VerdictBadge';
import SubmissionsTable from '../components/SubmissionsTable';

const DIFFICULTY_STYLES = {
  Easy: 'bg-shield-success-bg text-shield-success border-shield-success-border',
  Medium: 'bg-shield-warning-bg text-shield-warning border-shield-warning-border',
  Hard: 'bg-shield-danger-bg text-shield-danger border-shield-danger-border',
};

export default function Workspace() {
  const { id } = useParams();
  const { isAuthenticated, refreshProfile } = useAuth();
  const { theme } = useTheme();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [code, setCode] = useState(LANGUAGE_MAP[DEFAULT_LANGUAGE].boilerplate);
  // Tracks which languages the user has manually edited, so we don't
  // clobber their work when switching back and forth.
  const editedLanguages = useRef(new Set());

  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);
  const [progress, setProgress] = useState(null); // { index, total, status, hidden }
  const activeSubmissionId = useRef(null);

  const [activeTab, setActiveTab] = useState('description');
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  const [proctorAlert, setProctorAlert] = useState(false);

  // ---- AI state ---------------------------------------------------------
  // Hint panel (inline in description tab)
  const [hintOpen, setHintOpen] = useState(false);
  const [hintText, setHintText] = useState('');
  const [hintLoading, setHintLoading] = useState(false);
  const [hintError, setHintError] = useState('');
  // Review slide-out panel
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const hintAbortRef = useRef(null);
  const reviewAbortRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await api.get(`/problems/${id}`);
        if (!isMounted) return;
        setProblem(res.data);
      } catch {
        if (!isMounted) return;
        setError('Unable to load this challenge. It may have been removed or the backend is unreachable.');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [id]);

  const loadSubmissions = async () => {
    setSubmissionsLoading(true);
    try {
      const res = await api.get('/submissions', { params: { problemId: id, limit: 25 } });
      setSubmissions(res.data);
    } catch {
      setSubmissions([]);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'submissions') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadSubmissions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const next = e.target.value;
    // Only auto-inject boilerplate if the user hasn't customized this
    // language's editor content yet.
    if (!editedLanguages.current.has(next)) {
      setCode(LANGUAGE_MAP[next].boilerplate);
    }
    setLanguage(next);
    setVerdict(null);
  };

  const handleCodeChange = (value) => {
    setCode(value ?? '');
    editedLanguages.current.add(language);
  };

  // ---- Live grading updates via Socket.io ----
  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (update) => {
      if (update.submissionId !== activeSubmissionId.current) return;

      if (update.done) {
        setProgress(null);
        setSubmitting(false);
        if (update.submission) {
          setVerdict(update.submission);
        } else {
          // Worker failed before producing a submission doc; refetch.
          api.get(`/submissions/${update.submissionId}`)
            .then((res) => setVerdict(res.data))
            .catch(() => setVerdict({ status: update.status || 'Runtime Error', output: update.error || '' }));
        }
        if (activeTab === 'submissions') loadSubmissions();
        if (isAuthenticated) refreshProfile();
        activeSubmissionId.current = null;
        return;
      }

      setProgress(update);
    };

    socket.on('submission:update', handleUpdate);
    return () => {
      socket.off('submission:update', handleUpdate);
      if (activeSubmissionId.current) {
        socket.emit('unsubscribe', activeSubmissionId.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated]);

  // Safety net: if Socket.io updates don't arrive (e.g. the WebSocket
  // connection failed), poll the submission endpoint until it reaches a
  // terminal state so the UI never gets stuck on "Running Tests...".
  const pollForCompletion = (submissionId) => {
    const TERMINAL_STATUSES = [
      'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Memory Limit Exceeded',
      'Compilation Error', 'Runtime Error'
    ];
    const interval = setInterval(async () => {
      if (activeSubmissionId.current !== submissionId) {
        clearInterval(interval);
        return;
      }
      try {
        const res = await api.get(`/submissions/${submissionId}`);
        if (TERMINAL_STATUSES.includes(res.data.status)) {
          clearInterval(interval);
          if (activeSubmissionId.current === submissionId) {
            setVerdict(res.data);
            setProgress(null);
            setSubmitting(false);
            activeSubmissionId.current = null;
            if (activeTab === 'submissions') loadSubmissions();
            if (isAuthenticated) refreshProfile();
          }
        }
      } catch {
        // ignore transient errors, keep polling
      }
    }, 2000);

    // Stop polling after 60s regardless to avoid a runaway interval.
    setTimeout(() => clearInterval(interval), 60000);
  };

  const handleSubmit = async () => {
    if (!problem) return;
    setSubmitting(true);
    setVerdict(null);
    setProgress(null);

    try {
      const res = await api.post('/submissions', {
        problemId: problem._id,
        language,
        code,
      });

      if (res.data.queued) {
        // Async path: subscribe to live updates for this submission. The
        // `submission:update` handler above will set `verdict` once the
        // worker reports `done`.
        activeSubmissionId.current = res.data._id;
        getSocket().emit('subscribe', res.data._id);
        setProgress({ index: -1, total: res.data.totalTestCases, status: 'Queued' });
        pollForCompletion(res.data._id);
      } else {
        // Synchronous fallback path: result is already final.
        setVerdict(res.data);
        setSubmitting(false);
        if (activeTab === 'submissions') loadSubmissions();
        if (isAuthenticated) refreshProfile();
      }
    } catch (err) {
      setVerdict({
        status: 'Runtime Error',
        output: err.response?.data?.error || 'Failed to connect to the judging engine.',
      });
      setSubmitting(false);
    }
  };

  // ---- AI helpers -------------------------------------------------------
  const API_BASE = API_BASE_URL;

  /**
   * Streams an SSE endpoint, calling onToken for each text token and
   * onDone when the stream ends. Returns an AbortController so the
   * caller can cancel the stream.
   */
  function streamSSE(url, body, onToken, onDone, onError) {
    const ctrl = new AbortController();
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(localStorage.getItem('codeshield_token')
          ? { Authorization: `Bearer ${localStorage.getItem('codeshield_token')}` }
          : {})
      },
      body: JSON.stringify(body),
      signal: ctrl.signal
    })
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          onError(json.reason || json.error || `HTTP ${res.status}`);
          onDone();
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buf = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split('\n');
          buf = lines.pop();
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            try {
              const payload = JSON.parse(line.slice(5).trim());
              if (payload.token) onToken(payload.token);
              if (payload.done) { onDone(); return; }
              if (payload.error) { onError(payload.error); onDone(); return; }
            } catch { /* malformed line */ }
          }
        }
        onDone();
      })
      .catch((err) => {
        if (err.name !== 'AbortError') onError(err.message);
        onDone();
      });
    return ctrl;
  }

  const handleGetHint = () => {
    if (hintAbortRef.current) hintAbortRef.current.abort();
    setHintOpen(true);
    setHintText('');
    setHintError('');
    setHintLoading(true);
    hintAbortRef.current = streamSSE(
      `${API_BASE}/ai/hint`,
      {
        problemTitle: problem?.title,
        problemDescription: problem?.description,
        language,
        code,
        failingOutput: verdict && verdict.status !== 'Accepted' ? verdict.output : undefined
      },
      (token) => setHintText((t) => t + token),
      () => setHintLoading(false),
      (err) => { setHintError(err); setHintLoading(false); }
    );
  };

  const handleAIReview = (submittedCode, submittedLanguage, submittedVerdict) => {
    if (reviewAbortRef.current) reviewAbortRef.current.abort();
    setReviewOpen(true);
    setReviewText('');
    setReviewError('');
    setReviewLoading(true);
    reviewAbortRef.current = streamSSE(
      `${API_BASE}/ai/review`,
      {
        problemTitle: problem?.title,
        problemDescription: problem?.description,
        language: submittedLanguage,
        code: submittedCode,
        verdict: submittedVerdict?.status,
        executionTime: submittedVerdict?.executionTime
      },
      (token) => setReviewText((t) => t + token),
      () => setReviewLoading(false),
      (err) => { setReviewError(err); setReviewLoading(false); }
    );
  };

  // ---- Proctor Shield: block copy/paste/cut shortcuts inside the editor ----
  const handleEditorMount = (editor) => {
    const domNode = editor.getDomNode();
    if (!domNode) return;

    const blockClipboard = (e) => {
      const key = e.key?.toLowerCase();
      const isModifier = e.ctrlKey || e.metaKey;
      if (isModifier && ['c', 'v', 'x'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        setProctorAlert(true);
        setTimeout(() => setProctorAlert(false), 2000);
      }
    };

    domNode.addEventListener('keydown', blockClipboard, true);
    domNode.addEventListener('copy', (e) => e.preventDefault());
    domNode.addEventListener('paste', (e) => e.preventDefault());
    domNode.addEventListener('cut', (e) => e.preventDefault());
    domNode.addEventListener('contextmenu', (e) => e.preventDefault());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-shield-accent font-medium animate-shield-pulse">Loading challenge workspace…</p>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-shield-danger mb-4">{error}</p>
        <Link to="/" className="text-shield-accent hover:underline text-sm">← Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Sub-navbar */}
      <div className="px-4 sm:px-6 py-3 border-b border-shield-border bg-shield-bg-elevated flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="px-3 py-1.5 bg-shield-bg-inset hover:bg-shield-border border border-shield-border rounded-lg text-xs font-medium transition cursor-pointer text-shield-text-secondary whitespace-nowrap"
          >
            ← Dashboard
          </Link>
          <h1 className="text-sm sm:text-base font-semibold text-shield-text truncate">{problem.title}</h1>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>

        {proctorAlert && (
          <span className="text-xs font-semibold text-shield-danger bg-shield-danger-bg border border-shield-danger-border rounded-md px-3 py-1 animate-shield-pulse">
            Proctor Shield: Copy / Paste Disabled
          </span>
        )}
      </div>

      {/* Main split layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left Panel: Description / Submissions Tabs */}
        <div className="flex flex-col border-r border-shield-border overflow-hidden bg-shield-bg-elevated/40">
          <div className="flex border-b border-shield-border px-4 sm:px-6">
            {[
              { key: 'description', label: 'Description' },
              { key: 'submissions', label: 'Submissions' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition cursor-pointer ${
                  activeTab === tab.key
                    ? 'border-shield-accent text-shield-accent'
                    : 'border-transparent text-shield-text-secondary hover:text-shield-text'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto shield-scroll p-4 sm:p-6">
            {activeTab === 'description' ? (
              <div className="space-y-5">
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${DIFFICULTY_STYLES[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                  <span className="ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium border border-shield-border text-shield-text-muted">
                    {problem.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold mt-3 text-shield-text">
                    {problem.title}
                  </h2>
                </div>

                <p className="text-shield-text-secondary leading-relaxed text-sm whitespace-pre-wrap">
                  {problem.description}
                </p>

                {problem.sampleInput && (
                  <div>
                    <h3 className="text-xs font-semibold text-shield-text-muted uppercase tracking-wider mb-1.5">
                      Sample Input
                    </h3>
                    <pre className="text-xs font-mono bg-shield-bg-inset border border-shield-border rounded-lg p-3 text-shield-text whitespace-pre-wrap">
                      {problem.sampleInput}
                    </pre>
                  </div>
                )}

                {problem.sampleOutput && (
                  <div>
                    <h3 className="text-xs font-semibold text-shield-text-muted uppercase tracking-wider mb-1.5">
                      Sample Output
                    </h3>
                    <pre className="text-xs font-mono bg-shield-bg-inset border border-shield-border rounded-lg p-3 text-shield-text whitespace-pre-wrap">
                      {problem.sampleOutput}
                    </pre>
                  </div>
                )}

                <div className="pt-4 border-t border-shield-border grid grid-cols-2 gap-3 text-xs text-shield-text-muted font-mono">
                  <div>Time Limit: {problem.timeLimit}ms</div>
                  <div>Memory Limit: {problem.memoryLimit}MB</div>
                </div>

                {/* Problem tags */}
                {problem.tags && problem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-mono bg-shield-accent/10 text-shield-accent border border-shield-border-glow/40">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Hint section */}
                <div className="pt-2 border-t border-shield-border">
                  <button
                    onClick={handleGetHint}
                    disabled={hintLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-shield-border-glow/60 bg-shield-accent/10 text-shield-accent text-xs font-semibold hover:bg-shield-accent/20 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{hintLoading ? '⟳' : '✦'}</span>
                    {hintLoading ? 'Generating hint…' : 'Get AI Hint'}
                  </button>

                  {hintOpen && (
                    <div className="mt-3 rounded-xl border border-shield-border-glow/40 bg-shield-bg-inset overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-shield-border bg-shield-accent/5">
                        <span className="text-[10px] font-mono text-shield-accent uppercase tracking-wider">AI Hint · {hintLoading ? 'Streaming…' : 'Done'}</span>
                        <button onClick={() => setHintOpen(false)} className="text-shield-text-muted hover:text-shield-danger text-sm leading-none cursor-pointer">✕</button>
                      </div>
                      <div className="p-3 min-h-12">
                        {hintError ? (
                          <p className="text-xs text-shield-danger">{hintError}</p>
                        ) : (
                          <p className="text-xs text-shield-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
                            {hintText || <span className="text-shield-text-muted animate-shield-pulse">Consulting the AI coach…</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <SubmissionsTable
                submissions={submissions}
                loading={submissionsLoading}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        </div>

        {/* Right Panel: Editor + Submission Controls */}
        <div className="flex flex-col bg-shield-bg-inset overflow-hidden">
          {/* Editor navbar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-shield-border bg-shield-bg-elevated">
            <label className="text-xs text-shield-text-muted uppercase tracking-wider font-mono">
              Source Code
            </label>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-3 py-1.5 bg-shield-bg-inset border border-shield-border rounded-lg text-shield-text text-sm focus:outline-none focus:ring-2 focus:ring-shield-accent/40 transition cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>{lang.label}</option>
              ))}
            </select>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={LANGUAGE_MAP[language].monacoLanguage}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 4,
                wordWrap: 'on',
                contextmenu: false,
              }}
            />
          </div>

          {/* Action footer & verdict */}
          <div className="p-4 bg-shield-bg-elevated border-t border-shield-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-shield-text-muted">
                Proctor Shield active: clipboard shortcuts are disabled in this editor.
              </span>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-2.5 rounded-lg font-semibold text-sm shadow-md transition transform active:scale-95 cursor-pointer ${
                  submitting
                    ? 'bg-shield-bg-inset text-shield-text-muted cursor-not-allowed animate-shield-pulse border border-shield-border'
                    : 'bg-shield-accent hover:opacity-90 text-white'
                }`}
              >
                {submitting
                  ? (progress && progress.index >= 0
                      ? `Test ${progress.index + 1}/${progress.total}…`
                      : 'Evaluating…')
                  : 'Submit Code'}
              </button>
            </div>

            {progress && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-shield-text-muted font-mono">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-shield-accent animate-shield-pulse" />
                    {progress.index >= 0
                      ? `Evaluating Test Case ${progress.index + 1}/${progress.total}${progress.hidden ? ' (hidden)' : ''}…`
                      : 'Queued for evaluation…'}
                  </span>
                  {progress.status && progress.index >= 0 && (
                    <span className={progress.status === 'Passed' ? 'text-shield-success' : ''}>
                      {progress.status}
                    </span>
                  )}
                </div>
                {progress.total > 0 && (
                  <div className="h-1.5 w-full bg-shield-bg-inset rounded-full overflow-hidden border border-shield-border">
                    <div
                      className="h-full bg-shield-accent transition-all duration-300"
                      style={{ width: `${Math.max(0, ((progress.index + 1) / progress.total) * 100)}%` }}
                    />
                  </div>
                )}
              </div>
            )}

            {verdict && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-shield-text-muted uppercase tracking-wider font-mono">Verdict:</span>
                  <VerdictBadge status={verdict.status} />
                  {typeof verdict.executionTime === 'number' && (
                    <span className="text-xs text-shield-text-muted font-mono">{verdict.executionTime}ms</span>
                  )}
                </div>
                {/* Per-test-case result dots */}
                {verdict.testCaseResults && verdict.testCaseResults.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {verdict.testCaseResults.map((tc) => (
                      <span
                        key={tc.index}
                        title={`Test ${tc.index + 1}${tc.hidden ? ' (hidden)' : ''}: ${tc.status} · ${tc.executionTimeMs}ms`}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold border cursor-default ${
                          tc.status === 'Passed'
                            ? 'bg-shield-success-bg text-shield-success border-shield-success-border'
                            : tc.status === 'Time Limit Exceeded' || tc.status === 'Memory Limit Exceeded'
                              ? 'bg-shield-warning-bg text-shield-warning border-shield-warning-border'
                              : 'bg-shield-danger-bg text-shield-danger border-shield-danger-border'
                        }`}
                      >
                        {tc.status === 'Passed' ? '✓'
                          : tc.status === 'Time Limit Exceeded' ? 'T'
                          : tc.status === 'Memory Limit Exceeded' ? 'M'
                          : '✗'}
                      </span>
                    ))}
                  </div>
                )}
                {verdict.status !== 'Accepted' && verdict.output && (
                  <pre className="text-xs font-mono bg-shield-bg-inset border border-shield-border rounded-lg p-3 text-shield-text-secondary whitespace-pre-wrap break-words max-h-40 overflow-y-auto shield-scroll">
                    {verdict.output}
                  </pre>
                )}
                {verdict.status === 'Accepted' && (
                  <p className="text-xs text-shield-success font-medium">✓ All test cases passed. Challenge solved!</p>
                )}

                {/* AI Code Review trigger */}
                <button
                  onClick={() => handleAIReview(code, language, verdict)}
                  disabled={reviewLoading}
                  className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg border border-shield-border-glow/60 bg-shield-accent/10 text-shield-accent text-xs font-semibold hover:bg-shield-accent/20 transition cursor-pointer disabled:opacity-50 w-fit"
                >
                  <span>{reviewLoading ? '⟳' : '◈'}</span>
                  {reviewLoading ? 'Analysing…' : 'AI Code Review'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* AI Code Review — slide-out panel (fixed, right edge of viewport)    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] z-40 flex flex-col bg-shield-bg-elevated border-l border-shield-border shadow-2xl transition-transform duration-300 ${
          reviewOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-shield-border shrink-0 bg-shield-bg-inset">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-shield-accent animate-shield-pulse" />
            <span className="text-sm font-display font-semibold text-shield-text">AI Code Review</span>
            <span className="text-[10px] font-mono text-shield-accent bg-shield-accent/10 border border-shield-border-glow/40 rounded px-1.5 py-0.5">
              AI Assistant
            </span>
          </div>
          <button
            onClick={() => setReviewOpen(false)}
            className="text-shield-text-muted hover:text-shield-danger text-xl leading-none cursor-pointer transition"
          >✕</button>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto shield-scroll p-5 space-y-4">
          {reviewError ? (
            <div className="rounded-xl border border-shield-danger-border bg-shield-danger-bg p-4">
              <p className="text-xs text-shield-danger font-semibold mb-1">AI Review Unavailable</p>
              <p className="text-xs text-shield-danger/80">{reviewError}</p>
              <p className="text-xs text-shield-text-muted mt-2">
                Make sure Ollama is running: <code className="font-mono">ollama serve</code>, then pull the model: <code className="font-mono">ollama pull deepseek-r1:1.5b</code>
              </p>
            </div>
          ) : reviewText ? (
            <div className="prose-sm space-y-3">
              <p className="text-xs text-shield-text-secondary leading-relaxed whitespace-pre-wrap font-sans">
                {reviewText}
                {reviewLoading && <span className="inline-block w-1.5 h-3.5 bg-shield-accent ml-0.5 animate-shield-pulse rounded-sm" />}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <span className="text-3xl animate-shield-pulse">◈</span>
              <p className="text-xs text-shield-text-muted text-center">
                {reviewLoading ? 'Analysing complexity and optimisation opportunities…' : 'Click "AI Code Review" after submitting to get Big-O analysis and suggestions.'}
              </p>
            </div>
          )}
        </div>

        {/* Panel footer */}
        <div className="px-5 py-3 border-t border-shield-border shrink-0 bg-shield-bg-inset">
          <p className="text-[10px] text-shield-text-muted font-mono">
            Automated Big-O complexity analysis and performance evaluation engine.
          </p>
        </div>
      </div>

      {/* Backdrop for slide-out panel on mobile */}
      {reviewOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 sm:hidden"
          onClick={() => setReviewOpen(false)}
        />
      )}
    </div>
  );
}

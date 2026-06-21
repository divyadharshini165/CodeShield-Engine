import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ShieldLogo from './ShieldLogo';

function SunIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-shield-border bg-shield-bg-elevated/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <ShieldLogo className="w-7 h-7 transition-transform group-hover:scale-105" />
            <span className="font-display font-semibold text-lg tracking-tight text-shield-text">
              CodeShield
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-[0.2em] text-shield-text-muted border border-shield-border rounded px-1.5 py-0.5">
              Engine
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/leaderboard"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                location.pathname === '/leaderboard'
                  ? 'text-shield-accent bg-shield-accent/10 border border-shield-border-glow'
                  : 'text-shield-text-secondary hover:text-shield-accent'
              }`}
            >
              Leaderboard
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-lg transition cursor-pointer ${
                  location.pathname.startsWith('/admin')
                    ? 'text-shield-accent bg-shield-accent/10 border border-shield-border-glow'
                    : 'text-shield-text-secondary hover:text-shield-accent'
                }`}
              >
                ⚙ Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="p-2 rounded-lg border border-shield-border text-shield-text-secondary hover:text-shield-accent hover:border-shield-accent/40 transition cursor-pointer"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-sm font-semibold text-shield-text">{user?.username}</span>
                <span className="text-[11px] text-shield-text-muted font-mono">{user?.email}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 text-sm font-medium rounded-lg border border-shield-border text-shield-text-secondary hover:text-shield-danger hover:border-shield-danger/40 transition cursor-pointer"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium rounded-lg text-shield-text-secondary hover:text-shield-text transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-2 text-sm font-semibold rounded-lg bg-shield-accent text-white hover:bg-shield-accent-strong transition shadow-lg shadow-shield-accent/20"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

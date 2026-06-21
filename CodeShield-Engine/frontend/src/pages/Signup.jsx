import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ShieldLogo from '../components/ShieldLogo';

export default function Signup() {
  const { register, authLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required.';
    } else if (username.trim().length < 3 || username.trim().length > 24) {
      errors.username = 'Username must be between 3 and 24 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      errors.email = 'Enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const result = await register({
      username: username.trim(),
      email: email.trim(),
      password,
    });

    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const fieldClass = (hasError) =>
    `w-full px-3.5 py-2.5 bg-shield-bg-inset border rounded-lg text-shield-text placeholder:text-shield-text-muted focus:outline-none focus:ring-2 focus:ring-shield-accent/40 transition ${
      hasError ? 'border-shield-danger' : 'border-shield-border'
    }`;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <ShieldLogo className="w-12 h-12 mb-3" />
          <h1 className="font-display text-2xl font-bold text-shield-text">Create your account</h1>
          <p className="text-shield-text-secondary text-sm mt-1.5 text-center">
            Join CodeShield to track your solved challenges and submission history.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-shield-bg-panel border border-shield-border rounded-2xl p-6 sm:p-8 shadow-2xl shadow-shield-shadow space-y-5"
        >
          {authError && (
            <div className="bg-shield-danger-bg border border-shield-danger-border text-shield-danger text-sm rounded-lg px-3.5 py-2.5">
              {authError}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-shield-text-secondary mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={fieldClass(fieldErrors.username)}
              placeholder="e.g. codewarrior_99"
            />
            {fieldErrors.username && (
              <p className="text-shield-danger text-xs mt-1.5">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-shield-text-secondary mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass(fieldErrors.email)}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p className="text-shield-danger text-xs mt-1.5">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-shield-text-secondary mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass(fieldErrors.password)}
              placeholder="At least 6 characters"
            />
            {fieldErrors.password && (
              <p className="text-shield-danger text-xs mt-1.5">{fieldErrors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-shield-text-secondary mb-1.5">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={fieldClass(fieldErrors.confirmPassword)}
              placeholder="Re-enter your password"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-shield-danger text-xs mt-1.5">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full py-2.5 rounded-lg font-semibold text-white bg-shield-accent hover:bg-shield-accent-strong transition shadow-lg shadow-shield-accent/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {authLoading ? 'Creating account…' : 'Sign Up'}
          </button>

          <p className="text-center text-sm text-shield-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-shield-accent font-medium hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

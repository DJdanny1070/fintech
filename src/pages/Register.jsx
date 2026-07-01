import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/common/ToastProvider";
import "./Auth.css";

// Per spec: only Individual and Business
const ROLES = [
  { value: "individual", label: "👤 Individual", desc: "Personal" },
  { value: "business",   label: "🏢 Business",   desc: "B2B" },
];

function Register() {
  const navigate = useNavigate();
  const { register, loginWithGoogle } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "individual",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.role);
      toast.success("Registration successful");
      navigate("/dashboard");
    } catch (err) {
      const message = err.message || "Registration failed. Please try again.";
      setError(message);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const message = err.message || "Google sign-up failed.";
      setError(message);
      toast.error("Registration failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__panel">
        <div className="auth-panel__logo">
          <span style={{color:"#4FA3FF"}}>Creso</span>
          <span style={{color:"#FF5A5A"}}>X</span>
        </div>
        <p className="auth-panel__tagline">Start your financial journey today.</p>
        <p className="auth-panel__sub">
          Free forever for individuals. Transparent fees for business accounts.
          No hidden charges. No credit card required to get started.
        </p>
        <div className="auth-panel__features">
          {["Free to create an account","Blockchain-verified transactions","Role-based personalised dashboard","Cancel or change plan anytime"].map(f => (
            <div className="auth-panel__feature" key={f}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-page__form-area">
        <div className="auth-card auth-card--wide">
          <Link to="/" className="auth-card__back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to home
          </Link>

          <div className="auth-card__header">
            <h1 className="auth-card__title">Create your account</h1>
            <p className="auth-card__sub">Join our platform. Free to get started.</p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              {error}
            </div>
          )}

          <button
            className="auth-social-btn"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <><span className="spinner" /> Connecting...</>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.6 0 6.5 1.4 8.4 3.3l6.3-6.3C35.2 2.9 30 .5 24 .5 14.8.5 6.9 6 2.8 14l7.4 5.7C12.2 13.5 17.6 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7C43.5 37.3 46.5 31.3 46.5 24.5z"/>
                  <path fill="#FBBC05" d="M10.3 28.8A14.5 14.5 0 019.5 24c0-1.7.3-3.3.8-4.8L2.9 13.5A23.5 23.5 0 00.5 24c0 3.8.9 7.3 2.4 10.5l7.4-5.7z"/>
                  <path fill="#34A853" d="M24 47.5c6 0 11-2 14.7-5.3l-7.4-5.7c-2 1.3-4.5 2-7.3 2-6.4 0-11.8-4-13.7-9.7l-7.4 5.7C6.9 42 14.8 47.5 24 47.5z"/>
                </svg>
                Sign up with Google
              </>
            )}
          </button>

          <div className="divider-text">or register with email</div>

          {/* Role selector */}
          <div className="auth-roles">
            <label className="input-label">I am a...</label>
            <div className="auth-roles__grid" style={{gridTemplateColumns:"repeat(2,1fr)"}}>
              {ROLES.map(r => (
                <button key={r.value} type="button"
                  className={`auth-role-btn ${form.role===r.value?"auth-role-btn--active":""}`}
                  onClick={() => setForm({...form, role:r.value})}>
                  <span className="auth-role-btn__label">{r.label}</span>
                  <span className="auth-role-btn__desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-row">
              <div className="auth-field">
                <label className="input-label">Full Name</label>
                <input className="input" type="text" placeholder="Jonathan Miller"
                  value={form.name} onChange={e => setForm({...form, name:e.target.value})} required />
              </div>
              <div className="auth-field">
                <label className="input-label">Email Address</label>
                <input className="input" type="email" placeholder="you@company.com"
                  value={form.email} onChange={e => setForm({...form, email:e.target.value})} required />
              </div>
            </div>
            <div className="auth-field">
              <label className="input-label">Password</label>
              <input className="input" type="password" placeholder="Minimum 8 characters"
                value={form.password} onChange={e => setForm({...form, password:e.target.value})} required minLength={8} />
            </div>
            <p className="auth-terms">
              By registering, you agree to our{" "}
              <span className="auth-link auth-link--disabled" aria-disabled="true">Terms of Service</span> and{" "}
              <span className="auth-link auth-link--disabled" aria-disabled="true">Privacy Policy</span>.
            </p>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading || googleLoading}>
              {loading ? <><span className="spinner"/> Creating account...</> : "Create Free Account →"}
            </button>
          </form>

          <div className="auth-card__footer">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

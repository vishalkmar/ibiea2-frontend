import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { EVENT } from '../data/siteData';
import { api, auth } from '../lib/api';

// Email + password login (no OTP). Redirects by role.
const DEMO = {
  exhibitor: 'exhibitor@ibiea.com',
  sponsor: 'sponsor@ibiea.com',
  admin: 'super@ibiea.com',
};

function destFor(role) {
  if (['super_admin', 'ops_admin', 'finance_admin'].includes(role)) return '/admin';
  if (role === 'sponsor') return '/sponsor';
  return '/exhibitor';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const prefill = (key) => { setEmail(DEMO[key]); setPassword('password123'); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { token, user } = await api.login(email, password);
      auth.set(token, user);
      navigate(destFor(user.role));
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-gradient relative overflow-hidden py-28">
      <div className="absolute inset-0 lux-dots opacity-40" />
      <div className="absolute inset-0 lux-pattern" />
      <div className="container-x relative z-10 max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display font-black text-3xl text-cream">IBIEA <span className="text-gradient-gold">2.0</span></Link>
          <p className="text-gold/70 text-xs tracking-[0.25em] uppercase mt-1">Powered by {EVENT.parentBrand}</p>
        </div>

        <div className="card-base p-8">
          <h1 className="font-display text-2xl font-bold text-cream">Welcome Back</h1>
          <p className="text-sm text-cream/60 mt-1">Sign in to your exhibitor, sponsor or admin account.</p>

          <div className="flex gap-2 mt-5">
            {[['exhibitor', 'Exhibitor'], ['sponsor', 'Sponsor'], ['admin', 'Admin']].map(([v, l]) => (
              <button key={v} type="button" onClick={() => prefill(v)}
                className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold border border-gold/30 text-gold/80 hover:bg-gold hover:text-navy transition">
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-cream/40 mt-2">Tip: tap a role to prefill a demo account.</p>

          <form onSubmit={submit} className="mt-5 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field !pl-11" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/60" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field !pl-11" />
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
        <p className="text-center text-cream/60 text-sm mt-6">
          Need an account? <Link to="/register" className="text-gold font-semibold">Register here</Link>
        </p>
      </div>
    </section>
  );
}

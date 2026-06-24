import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-900/40 pt-28 pb-16">
      <div className="container-x text-center">
        <p className="font-serif font-black text-8xl md:text-9xl text-gradient-gold">404</p>
        <h1 className="mt-4 text-3xl font-bold text-cream">Page Not Found</h1>
        <p className="mt-3 text-cream/70 max-w-md mx-auto">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-primary mt-8"><Home size={18} /> Back to Home</Link>
      </div>
    </section>
  );
}

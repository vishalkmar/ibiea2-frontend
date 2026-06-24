import { Loader2, AlertCircle } from 'lucide-react';

// Wraps async dashboard content with loading/error states.
export default function AsyncState({ loading, error, children, height = 'min-h-[200px]' }) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center ${height} text-cream/70`}>
        <Loader2 size={28} className="animate-spin text-gold" />
      </div>
    );
  }
  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center ${height} text-center`}>
        <AlertCircle size={32} className="text-red-400" />
        <p className="mt-2 font-semibold text-cream">Couldn't load data</p>
        <p className="text-sm text-cream/70">{error}</p>
      </div>
    );
  }
  return children;
}

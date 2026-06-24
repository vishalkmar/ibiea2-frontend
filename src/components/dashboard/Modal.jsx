import { X } from 'lucide-react';

// Premium centered modal dialog (dark navy + gold).
export default function Modal({ title, onClose, children, maxW = 'max-w-lg' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className={`w-full ${maxW} my-8 card-base p-7 md:p-8 relative`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-cream/50 hover:text-gold" aria-label="Close"><X size={22} /></button>
        {title && <h3 className="font-display text-2xl font-bold text-cream mb-5">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

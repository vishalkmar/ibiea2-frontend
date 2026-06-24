import { useState, useEffect } from 'react';
import { Save, Image, Calendar, Award, Megaphone, BarChart3, Loader2, CheckCircle2 } from 'lucide-react';
import { Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const BLOCKS = [
  { icon: Image, title: 'Hero Banner', desc: 'Headline, tagline, background image, CTAs' },
  { icon: BarChart3, title: 'Event Statistics', desc: 'Exhibitor / participant / segment counts' },
  { icon: Calendar, title: 'Event Schedule', desc: 'Day-by-day agenda blocks' },
  { icon: Megaphone, title: 'Sponsor Logos', desc: 'Logo uploads & tier ordering' },
  { icon: Award, title: 'Award Categories', desc: 'Category names, descriptions, ordering' },
  { icon: Award, title: 'Hall of Fame', desc: 'Winner entries & citations' },
];

export default function CMS() {
  const { data, loading, error } = useApi(() => api.theme());
  const [form, setForm] = useState({ name: '', featuredSegment: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState('');

  useEffect(() => {
    if (data) setForm({ name: data.name || '', featuredSegment: data.featuredSegment || '', description: data.description || '' });
  }, [data]);

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const save = async () => {
    setSaving(true); setSaveErr(''); setSaved(false);
    try { await api.themeSave(form); setSaved(true); }
    catch (err) { setSaveErr(err.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <Panel title="Theme Layer Configuration" action={<span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-gold text-navy">2026 Edition</span>}>
        <p className="text-sm text-cream/70 mb-5">
          Configure this year's theme without a rebuild. Retire and replace for future editions.
        </p>
        <AsyncState loading={loading} error={error} height="min-h-[160px]">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Theme Name</label>
              <input className="field" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Featured Segment (elevated)</label>
              <input className="field" value={form.featuredSegment} onChange={(e) => setField('featuredSegment', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Theme Description</label>
              <textarea rows={2} className="field" value={form.description} onChange={(e) => setField('description', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-5">
            <button onClick={save} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Theme</>}
            </button>
            {saved && <span className="flex items-center gap-1.5 text-green-400 text-sm font-semibold"><CheckCircle2 size={16} /> Saved</span>}
            {saveErr && <span className="text-red-400 text-sm">{saveErr}</span>}
          </div>
        </AsyncState>
      </Panel>

      <Panel title="Editable Content Blocks">
        <p className="text-sm text-cream/70 mb-5">Structured blocks — editorial changes can't break the page design.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BLOCKS.map((b) => (
            <button key={b.title} className="p-5 rounded-xl border border-gold/20 bg-navy-900/40 hover:border-gold/45 text-left transition group">
              <div className="icon-tile"><b.icon size={22} /></div>
              <h3 className="mt-3 font-bold text-cream">{b.title}</h3>
              <p className="text-sm text-cream/60">{b.desc}</p>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

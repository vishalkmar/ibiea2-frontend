import { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Building2, Loader2, CheckCircle2 } from 'lucide-react';
import { Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function Profile() {
  const { data: me, loading, error } = useApi(() => api.exhibitorMe());
  const { data: projectData, reload: reloadProjects } = useApi(() => api.exhibitorProjects());
  const { data: segments } = useApi(() => api.segments());

  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (me) setForm({ company: me.company || '', segment_id: me.segment_id || '', email: me.email || '', phone: me.phone || '', description: me.description || '' });
  }, [me]);

  const setField = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false); };

  const saveProfile = async () => {
    setSaving(true); setErr(''); setSaved(false);
    try { await api.exhibitorUpdateProfile(form); setSaved(true); }
    catch (e) { setErr(e.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  // Projects
  const projects = projectData || [];
  const [newProj, setNewProj] = useState({ proj_type: 'Residential', launch_status: 'Upcoming' });
  const [addingProj, setAddingProj] = useState(false);

  const addProject = async () => {
    if (!newProj.name) return;
    setAddingProj(true);
    try { await api.exhibitorAddProject(newProj); setNewProj({ proj_type: 'Residential', launch_status: 'Upcoming' }); reloadProjects(); }
    finally { setAddingProj(false); }
  };
  const removeProject = async (id) => { await api.exhibitorDeleteProject(id); reloadProjects(); };

  return (
    <div className="space-y-6">
      <Panel title="Company Profile">
        <p className="text-sm text-cream/70 mb-5">This information appears on your public exhibitor directory listing.</p>
        <AsyncState loading={loading} error={error} height="min-h-[160px]">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-cream mb-1.5">Company Name</label>
              <input className="field" value={form.company || ''} onChange={(e) => setField('company', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream mb-1.5">Industry Segment</label>
              <select className="field" value={form.segment_id || ''} onChange={(e) => setField('segment_id', e.target.value)}>
                <option value="">Select…</option>
                {(segments || []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream mb-1.5">Contact Email</label>
              <input type="email" className="field" value={form.email || ''} onChange={(e) => setField('email', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream mb-1.5">Contact Phone</label>
              <input type="tel" className="field" value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-cream mb-1.5">Company Description</label>
              <textarea rows={3} className="field" value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={saveProfile} disabled={saving} className="btn-primary disabled:opacity-60">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : <><Save size={16} /> Save Profile</>}
            </button>
            {saved && <span className="flex items-center gap-1.5 text-green-400 text-sm font-semibold"><CheckCircle2 size={16} /> Saved</span>}
            {err && <span className="text-red-400 text-sm">{err}</span>}
          </div>
        </AsyncState>
      </Panel>

      {/* Developer Projects Showcase */}
      <Panel
        title="Developer Projects Showcase"
        action={<span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-gold text-navy">2026 Theme Add-On</span>}
      >
        <p className="text-sm text-cream/70 mb-5">Add flagship projects to feature on the public directory and Home carousel.</p>

        {projects.length > 0 && (
          <ul className="space-y-3 mb-5">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-navy-900/40 border border-gold/15">
                <div className="flex items-center gap-3">
                  <div className="icon-tile !w-10 !h-10"><Building2 size={18} /></div>
                  <div>
                    <p className="font-semibold text-cream">{p.name}</p>
                    <p className="text-xs text-cream/60">{[p.location, p.proj_type, p.launch_status].filter(Boolean).join(' · ')}</p>
                  </div>
                </div>
                <button onClick={() => removeProject(p.id)} className="text-cream/50 hover:text-red-400"><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}

        <div className="p-4 rounded-xl border border-gold/20 bg-navy-900/30">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input placeholder="Project name" className="field !py-2.5 text-sm" value={newProj.name || ''} onChange={(e) => setNewProj({ ...newProj, name: e.target.value })} />
            <input placeholder="Location" className="field !py-2.5 text-sm" value={newProj.location || ''} onChange={(e) => setNewProj({ ...newProj, location: e.target.value })} />
            <select className="field !py-2.5 text-sm" value={newProj.proj_type} onChange={(e) => setNewProj({ ...newProj, proj_type: e.target.value })}>
              {['Residential', 'Commercial', 'Mixed-Use', 'Hospitality'].map((t) => <option key={t}>{t}</option>)}
            </select>
            <select className="field !py-2.5 text-sm" value={newProj.launch_status} onChange={(e) => setNewProj({ ...newProj, launch_status: e.target.value })}>
              {['Upcoming', 'Under Construction', 'Ready'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={addProject} disabled={addingProj || !newProj.name} className="btn-secondary mt-4 !py-2 text-sm disabled:opacity-50">
            {addingProj ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />} Add Project
          </button>
        </div>
      </Panel>
    </div>
  );
}

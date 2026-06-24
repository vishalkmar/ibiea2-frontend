import { useState } from 'react';
import { Users, Trophy, Crown, Loader2, UserPlus } from 'lucide-react';
import { Panel, StatusBadge } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import Modal from '../../components/dashboard/Modal';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

const STAGES = ['Nominations', 'Jury Scoring', 'Shortlist', 'Winners'];

export default function AwardsMgmt() {
  const [stage, setStage] = useState(0);
  const { data: noms, loading, error, reload } = useApi(() => api.adminNominations());
  const { data: jury, loading: jl, error: je, reload: reloadJury } = useApi(() => api.adminJury());

  const nominations = noms || [];
  const juryList = jury || [];
  const [showJury, setShowJury] = useState(false);
  const [jForm, setJForm] = useState({});
  const [jSaving, setJSaving] = useState(false);
  const [jErr, setJErr] = useState('');
  const [winnerBusy, setWinnerBusy] = useState(null);

  const byCategory = nominations.reduce((acc, n) => {
    const key = n.category_name || n.category_id;
    (acc[key] = acc[key] || []).push(n);
    return acc;
  }, {});

  const addJury = async (e) => {
    e.preventDefault();
    setJSaving(true); setJErr('');
    try {
      await api.adminAddJury(jForm);
      setShowJury(false); setJForm({});
      reloadJury();
    } catch (err) { setJErr(err.message || 'Failed to add jury member'); }
    finally { setJSaving(false); }
  };

  const finalizeWinner = async (id) => {
    setWinnerBusy(id);
    try { await api.adminFinalizeWinner(id); reload(); }
    catch (err) { alert(err.message); }
    finally { setWinnerBusy(null); }
  };

  return (
    <div className="space-y-6">
      <Panel title="Awards Lifecycle">
        <div className="flex flex-wrap gap-2">
          {STAGES.map((s, i) => (
            <button key={s} onClick={() => setStage(i)}
              className={`flex-1 min-w-[140px] p-4 rounded-xl border-2 text-left transition ${stage === i ? 'border-gold bg-gold/10' : 'border-gold/20'}`}>
              <span className="text-xs font-bold text-gold">Stage {i + 1}</span>
              <p className="font-bold text-cream">{s}</p>
            </button>
          ))}
        </div>
      </Panel>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Nominations by category with finalize-winner */}
        <Panel title="Nominations" action={<span className="text-sm text-cream/60">{nominations.length} total</span>}>
          <AsyncState loading={loading} error={error} height="min-h-[120px]">
            {nominations.length === 0 ? (
              <p className="text-cream/60 text-sm py-6 text-center">No nominations received yet.</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                {Object.entries(byCategory).map(([cat, list]) => (
                  <div key={cat}>
                    <p className="text-xs font-bold uppercase tracking-wide text-gold mb-2">{cat} · {list.length}</p>
                    <ul className="space-y-2">
                      {list.map((n) => (
                        <li key={n.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-navy-900/40 border border-gold/10">
                          <div className="min-w-0">
                            <p className="font-semibold text-cream truncate">{n.nominee}</p>
                            <p className="text-xs text-cream/50 capitalize">{n.nom_type?.replace('_', ' ')}</p>
                          </div>
                          {n.is_winner ? (
                            <span className="flex items-center gap-1 text-gold text-xs font-bold shrink-0"><Crown size={14} /> Winner</span>
                          ) : (
                            <button onClick={() => finalizeWinner(n.id)} disabled={winnerBusy === n.id}
                              className="btn-secondary !py-1.5 !px-3 text-xs shrink-0">
                              {winnerBusy === n.id ? <Loader2 size={13} className="animate-spin" /> : <><Trophy size={13} /> Make Winner</>}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </AsyncState>
        </Panel>

        {/* Jury management */}
        <Panel title="Jury Management" action={<button onClick={() => setShowJury(true)} className="btn-secondary !py-1.5 !px-3 text-xs"><UserPlus size={14} /> Add Jury</button>}>
          <AsyncState loading={jl} error={je} height="min-h-[120px]">
            {juryList.length === 0 ? (
              <p className="text-cream/60 text-sm py-6 text-center">No jury members yet. Add one to begin scoring.</p>
            ) : (
              <ul className="space-y-3">
                {juryList.map((j) => (
                  <li key={j.id} className="flex items-center gap-3 p-3 rounded-xl bg-navy-900/40 border border-gold/10">
                    <div className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center text-sm font-bold">{j.name.slice(0, 1)}</div>
                    <div className="min-w-0">
                      <p className="font-semibold text-cream text-sm truncate">{j.name}</p>
                      <p className="text-xs text-cream/50 truncate">{j.company || j.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AsyncState>
        </Panel>
      </div>

      {showJury && (
        <Modal title="Add Jury Member" onClose={() => setShowJury(false)}>
          <form onSubmit={addJury} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Full Name *</label>
              <input className="field" required value={jForm.name || ''} onChange={(e) => setJForm({ ...jForm, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Email *</label>
              <input type="email" className="field" required value={jForm.email || ''} onChange={(e) => setJForm({ ...jForm, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-cream/90 mb-1.5">Assigned Categories</label>
              <input className="field" placeholder="e.g. Developer Awards, PropTech" value={jForm.categories || ''} onChange={(e) => setJForm({ ...jForm, categories: e.target.value })} />
            </div>
            {jErr && <p className="text-sm text-red-400">{jErr}</p>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={jSaving} className="btn-primary flex-1 disabled:opacity-60">{jSaving ? 'Adding…' : 'Add Jury Member'}</button>
              <button type="button" onClick={() => setShowJury(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

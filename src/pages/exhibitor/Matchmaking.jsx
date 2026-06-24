import { Sparkles, Calendar, Check, X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

export default function Matchmaking() {
  const { data: matches, loading, error } = useApi(() => api.exhibitorMatches());
  const { data: meetings, reload: reloadMeetings } = useApi(() => api.exhibitorMeetings());
  const [busy, setBusy] = useState(null);

  const requestMeeting = async (company) => {
    setBusy(company);
    try { await api.exhibitorRequestMeeting({ target_company: company }); reloadMeetings(); }
    catch (e) { alert(e.message); }
    finally { setBusy(null); }
  };

  const respond = async (id, status) => {
    await api.exhibitorMeetingStatus(id, status); reloadMeetings();
  };

  const matchList = matches || [];
  const meetingList = meetings || [];

  return (
    <div className="space-y-6">
      <Panel
        title="AI-Suggested Connections"
        action={<span className="text-xs font-bold uppercase px-2.5 py-1 rounded-full bg-gold/15 text-gold flex items-center gap-1"><Sparkles size={12} /> AI Powered</span>}
      >
        <AsyncState loading={loading} error={error} height="min-h-[160px]">
          {matchList.length === 0 ? (
            <p className="text-cream/60 text-sm py-8 text-center">No matches yet — suggestions appear as more exhibitors confirm.</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-5">
              {matchList.map((m) => (
                <div key={m.id} className="p-5 rounded-xl border border-gold/20 bg-navy-900/40">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-full bg-gold text-navy flex items-center justify-center font-bold">{m.company.slice(0, 1)}</div>
                    <span className="text-xs font-bold text-gold">{m.score}% match</span>
                  </div>
                  <h3 className="mt-3 font-bold text-cream">{m.company}</h3>
                  <p className="text-xs text-gold font-semibold">{m.segment_name}</p>
                  <p className="mt-2 text-sm text-cream/70">{m.reason}</p>
                  <button onClick={() => requestMeeting(m.company)} disabled={busy === m.company} className="btn-primary w-full mt-4 !py-2 text-sm disabled:opacity-60">
                    {busy === m.company ? <Loader2 size={14} className="animate-spin" /> : <Calendar size={15} />} Request Meeting
                  </button>
                </div>
              ))}
            </div>
          )}
        </AsyncState>
      </Panel>

      <Panel title="Meeting Schedule">
        {meetingList.length === 0 ? (
          <p className="text-cream/60 text-sm py-6 text-center">No meetings yet. Request one from your matches above.</p>
        ) : (
          <ul className="divide-y divide-gold/15">
            {meetingList.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="text-center px-3 py-2 rounded-xl bg-gold/15">
                    <p className="text-xs font-bold text-gold">{m.day}</p>
                    <p className="text-sm font-bold text-cream">{m.slot}</p>
                  </div>
                  <p className="font-semibold text-cream">{m.target_company}</p>
                </div>
                {m.status === 'confirmed' ? (
                  <span className="flex items-center gap-1.5 text-green-400 text-sm font-semibold"><Check size={16} /> Confirmed</span>
                ) : m.status === 'declined' ? (
                  <span className="text-red-400 text-sm font-semibold">Declined</span>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => respond(m.id, 'confirmed')} className="w-9 h-9 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center hover:bg-green-500/30"><Check size={16} /></button>
                    <button onClick={() => respond(m.id, 'declined')} className="w-9 h-9 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/30"><X size={16} /></button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

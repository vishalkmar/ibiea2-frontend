import { useState, useRef } from 'react';
import { FileText, Download, Upload, Award, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { Panel } from '../../components/dashboard/widgets';
import AsyncState from '../../components/dashboard/AsyncState';
import { useApi } from '../../hooks/useApi';
import { api } from '../../lib/api';

function fmtSize(b) {
  if (!b) return '';
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function Documents() {
  const { data, loading, error, reload } = useApi(() => api.exhibitorDocuments());
  const docs = data || [];
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const fileRef = useRef(null);

  const openInvoice = () => window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/exhibitor/invoice`, '_blank');

  const onFiles = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true); setErr(''); setMsg('');
    try {
      for (const f of files) await api.uploadFile('/exhibitor/documents', f, { label: f.name });
      setMsg(`${files.length} file(s) uploaded`);
      reload();
    } catch (e) { setErr(e.message || 'Upload failed'); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const download = async (id, name) => {
    try { await api.downloadFile(`/exhibitor/documents/${id}/download`, name); }
    catch (e) { alert(e.message); }
  };

  const remove = async (id) => {
    if (!confirm('Delete this document?')) return;
    await api.exhibitorDeleteDocument(id); reload();
  };

  return (
    <div className="space-y-6">
      {/* System documents (generated / event) */}
      <Panel title="Event Documents">
        <ul className="divide-y divide-gold/10">
          <li className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="icon-tile !w-11 !h-11"><FileText size={20} /></div>
              <div>
                <p className="font-semibold text-cream">Tax Invoice</p>
                <p className="text-sm text-cream/60">Generated from your booking · printable PDF</p>
              </div>
            </div>
            <button onClick={openInvoice} className="btn-ghost !py-2 text-sm"><Download size={16} /> View / Download</button>
          </li>
          <li className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="icon-tile !w-11 !h-11"><Award size={20} /></div>
              <div>
                <p className="font-semibold text-cream">Certificate of Participation</p>
                <p className="text-sm text-cream/60">Available after the event concludes</p>
              </div>
            </div>
            <button disabled className="btn-ghost !py-2 text-sm opacity-50 cursor-not-allowed">Available post-event</button>
          </li>
        </ul>
      </Panel>

      {/* Uploaded compliance documents */}
      <Panel title="Your Uploaded Documents">
        <AsyncState loading={loading} error={error} height="min-h-[80px]">
          {docs.length === 0 ? (
            <p className="text-cream/60 text-sm py-4 text-center">No documents uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-gold/10">
              {docs.map((d) => (
                <li key={d.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="icon-tile !w-11 !h-11"><FileText size={20} /></div>
                    <div className="min-w-0">
                      <p className="font-semibold text-cream truncate">{d.label || d.original_name}</p>
                      <p className="text-sm text-cream/60">{fmtSize(d.size_bytes)} · {new Date(d.uploaded_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => download(d.id, d.original_name)} className="btn-ghost !py-2 text-sm"><Download size={15} /></button>
                    <button onClick={() => remove(d.id)} className="text-cream/50 hover:text-red-400 px-2"><Trash2 size={16} /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AsyncState>
      </Panel>

      {/* Upload */}
      <Panel title="Upload Compliance Documents">
        <p className="text-sm text-cream/70 mb-4">Upload trade licence, registration, etc. (PDF, image, Office files · max 10MB).</p>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); onFiles([...e.dataTransfer.files]); }}
          className="border-2 border-dashed border-gold/25 rounded-2xl p-10 text-center bg-navy-900/30">
          <Upload size={36} className="mx-auto text-gold" />
          <p className="mt-3 font-semibold text-cream">Drag &amp; drop files here</p>
          <p className="text-sm text-cream/50">or</p>
          <label className="btn-secondary mt-3 inline-flex cursor-pointer">
            {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading…</> : 'Browse Files'}
            <input ref={fileRef} type="file" multiple className="hidden" disabled={uploading} onChange={(e) => onFiles([...e.target.files])} />
          </label>
          {msg && <p className="mt-3 text-sm text-green-400 flex items-center justify-center gap-1.5"><CheckCircle2 size={15} /> {msg}</p>}
          {err && <p className="mt-3 text-sm text-red-400">{err}</p>}
        </div>
      </Panel>
    </div>
  );
}

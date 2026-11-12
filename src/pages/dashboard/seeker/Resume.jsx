import { CheckCircle2, Download, Eye, FileText, RefreshCw, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import PageHeader from '../../../components/common/PageHeader';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import FileDrop from '../../../components/forms/FileDrop';
import { ResumePreview } from '../../../components/dashboard/CandidateProfileModal';
import { useAuth } from '../../../context/AuthContext';
import { useConfirm } from '../../../context/ConfirmContext';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { buildResumeText, downloadDataUrl, downloadText, readFileAsDataUrl } from '../../../utils/download';
import { formatDate, formatFileSize } from '../../../utils/format';
import { seekerSnapshot } from '../../../services/seed';

const MAX_STORED = 2.5 * 1024 * 1024;

export default function Resume() {
  useDocumentTitle('Resume');
  const { user, updateProfile } = useAuth();
  const confirm = useConfirm();
  const replaceRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const resume = user.resume;

  const upload = async (file) => {
    setUploading(true);
    try {
      const dataUrl = file.size <= MAX_STORED ? await readFileAsDataUrl(file) : null;
      await updateProfile({ resume: { name: file.name, size: file.size, type: file.type, dataUrl, uploadedAt: new Date().toISOString() } });
      toast.success(resume ? 'Resume replaced' : 'Resume uploaded', { description: file.name });
    } catch {
      toast.error('Upload failed — the file may be too large for browser storage.');
    } finally {
      setUploading(false);
    }
  };

  const onDownload = () => {
    if (resume?.dataUrl) downloadDataUrl(resume.dataUrl, resume.name);
    else downloadText(buildResumeText(seekerSnapshot(user)), resume.name.replace(/\.\w+$/, '') + '.txt');
  };

  const onDelete = async () => {
    const ok = await confirm({ title: 'Delete resume?', message: 'You will need to upload a resume again before applying to jobs.', confirmText: 'Delete' });
    if (!ok) return;
    await updateProfile({ resume: null });
    toast.success('Resume deleted');
  };

  const isPdf = resume?.dataUrl?.startsWith('data:application/pdf');

  return (
    <div className="max-w-4xl">
      <PageHeader title="Resume Management" description="Upload the resume you'll use when applying. PDF works best." />
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="card p-5 sm:p-6">
          {resume ? (
            <>
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <FileText className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">{resume.name}</p>
                  <p className="text-sm text-slate-500">
                    {formatFileSize(resume.size)} · Uploaded {formatDate(resume.uploadedAt)}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready to use for applications
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary" leftIcon={Eye} onClick={() => setPreview(true)}>Preview</Button>
                <Button variant="secondary" leftIcon={Download} onClick={onDownload}>Download</Button>
                <Button variant="secondary" leftIcon={RefreshCw} onClick={() => replaceRef.current?.click()} loading={uploading}>Replace</Button>
                <Button variant="danger-soft" leftIcon={Trash2} onClick={onDelete}>Delete</Button>
              </div>
              <input
                ref={replaceRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = '';
                  if (!f) return;
                  if (f.size > 5 * 1024 * 1024) return toast.error('File is too large. Max 5MB.');
                  upload(f);
                }}
              />
            </>
          ) : (
            <FileDrop onFile={upload} onError={(m) => toast.error(m)} />
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-semibold">Resume tips</h3>
          <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
            {['Keep it to 1–2 pages', 'Lead bullets with measurable impact', 'Mirror keywords from job descriptions', 'Export as PDF to preserve formatting'].map((t) => (
              <li key={t} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" /> {t}
              </li>
            ))}
          </ul>
          <Button to="/career-advice" variant="ghost" size="sm" className="mt-4 -ml-2">Read resume guide →</Button>
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} size="xl" title={resume?.name}>
        {isPdf ? (
          <iframe title="Resume preview" src={resume.dataUrl} className="h-[70vh] w-full rounded-xl border border-slate-200" />
        ) : (
          <>
            <p className="mb-3 text-sm text-slate-500">Inline preview is available for PDF files. Showing a summary generated from your profile:</p>
            <ResumePreview candidate={seekerSnapshot(user)} />
          </>
        )}
      </Modal>
    </div>
  );
}

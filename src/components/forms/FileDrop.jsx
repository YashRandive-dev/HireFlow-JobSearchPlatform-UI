import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from '../../utils/cn';

export default function FileDrop({ onFile, accept = '.pdf,.doc,.docx', maxSizeMB = 5, hint = 'PDF, DOC or DOCX up to 5MB', onError, compact }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const handle = (file) => {
    if (!file) return;
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (accept && !accept.split(',').includes(ext)) return onError?.(`Unsupported file type. Allowed: ${accept}`);
    if (file.size > maxSizeMB * 1024 * 1024) return onError?.(`File is too large. Max ${maxSizeMB}MB.`);
    onFile(file);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => ref.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && ref.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handle(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition',
        compact ? 'px-4 py-6' : 'px-6 py-12',
        drag ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-slate-50/60 hover:border-primary-300 hover:bg-primary-50/40'
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-primary-600 shadow-card ring-1 ring-slate-200">
        <UploadCloud className="h-6 w-6" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-800">
        <span className="text-primary-600">Click to upload</span> or drag and drop
      </p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handle(e.target.files?.[0]);
          e.target.value = '';
        }}
      />
    </div>
  );
}

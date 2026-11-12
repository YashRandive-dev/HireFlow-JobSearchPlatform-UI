import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { useClickOutside } from '../../hooks/useClickOutside';

export default function Dropdown({ trigger, children, align = 'right', width = 'w-56', triggerClassName, label = 'Open menu' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} aria-label={label} onClick={() => setOpen((o) => !o)} className={triggerClassName}>
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => setOpen(false)}
            className={cn('absolute z-50 mt-2 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 shadow-card-hover', align === 'right' ? 'right-0' : 'left-0', width)}
          >
            {typeof children === 'function' ? children(() => setOpen(false)) : children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DropdownItem({ icon: Icon, to, onClick, danger, children }) {
  const cls = cn(
    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition',
    danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
  );
  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 opacity-70" />}
      {children}
    </>
  );
  if (to)
    return (
      <Link role="menuitem" to={to} className={cls}>
        {content}
      </Link>
    );
  return (
    <button role="menuitem" type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}

export const DropdownDivider = () => <div className="my-1.5 h-px bg-slate-100" />;

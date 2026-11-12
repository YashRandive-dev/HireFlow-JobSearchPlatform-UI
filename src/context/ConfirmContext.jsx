import { createContext, useCallback, useContext, useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { cn } from '../utils/cn';

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null);

  const confirm = useCallback(
    (options) =>
      new Promise((resolve) => {
        setState({ title: 'Are you sure?', confirmText: 'Confirm', cancelText: 'Cancel', tone: 'danger', ...options, resolve });
      }),
    []
  );

  const close = (result) => {
    state?.resolve(result);
    setState(null);
  };

  const danger = state?.tone === 'danger';
  const Icon = danger ? AlertTriangle : HelpCircle;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal open={!!state} onClose={() => close(false)} size="sm" hideClose>
        {state && (
          <div className="text-center sm:text-left">
            <div className="sm:flex sm:gap-4">
              <div className={cn('mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0', danger ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600')}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="mt-3 sm:mt-0">
                <h3 className="text-lg font-semibold">{state.title}</h3>
                {state.message && <p className="mt-1.5 text-sm text-slate-500">{state.message}</p>}
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="secondary" onClick={() => close(false)}>
                {state.cancelText}
              </Button>
              <Button variant={danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
                {state.confirmText}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider');
  return ctx;
};

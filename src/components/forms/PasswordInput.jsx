import { forwardRef, useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';
import { passwordStrength } from '../../utils/validators';
import { cn } from '../../utils/cn';

const PasswordInput = forwardRef(function PasswordInput({ showStrength, value, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  const strength = passwordStrength(value);
  const colors = ['bg-red-400', 'bg-red-400', 'bg-amber-400', 'bg-accent-400', 'bg-accent-500'];
  return (
    <div>
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        icon={Lock}
        value={value}
        right={
          <button type="button" onClick={() => setVisible((v) => !v)} className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600" aria-label={visible ? 'Hide password' : 'Show password'}>
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
        {...props}
      />
      {showStrength && value && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex flex-1 gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={cn('h-1 flex-1 rounded-full', i < strength.score ? colors[strength.score] : 'bg-slate-200')} />
            ))}
          </div>
          <span className="text-xs text-slate-500">{strength.label}</span>
        </div>
      )}
    </div>
  );
});

export default PasswordInput;

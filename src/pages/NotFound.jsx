import { Compass } from 'lucide-react';
import Button from '../components/common/Button';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Page not found');
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Compass className="h-8 w-8" />
      </div>
      <p className="mt-6 font-display text-6xl font-extrabold text-slate-900">404</p>
      <h1 className="mt-2 text-xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mt-2 max-w-md text-slate-500">The page you&apos;re looking for may have moved or no longer exists.</p>
      <div className="mt-8 flex gap-2">
        <Button to="/">Go home</Button>
        <Button to="/jobs" variant="secondary">
          Browse jobs
        </Button>
      </div>
    </div>
  );
}

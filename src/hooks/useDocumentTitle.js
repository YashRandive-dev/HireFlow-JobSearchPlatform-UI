import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · HireFlow` : 'HireFlow — Find Your Dream Job';
  }, [title]);
}

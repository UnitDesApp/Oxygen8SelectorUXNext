import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminPanel() {
  const { replace } = useRouter();

  useEffect(() => {
    replace('/admin-panel/customers');
  }, []);

  return null;
}

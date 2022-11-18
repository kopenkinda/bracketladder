import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function useAdmin() {
  const [called, setCalled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status !== 'authenticated' || session.user?.role !== 'Admin') {
    if ('window' in globalThis && !called) {
      router.push('/');
      setCalled(true);
    }
    return;
  }
  return session.user;
}

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function useUser() {
  const [called, setCalled] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status !== 'authenticated') {
    if ('window' in globalThis && !called) {
      router.push('/');
      setCalled(true);
    }
    return;
  }
  return {
    ...session.user,
    status:
      'window' in globalThis
        ? (window as unknown as Record<string, boolean>).isPremium
          ? ('premium' as const)
          : ('basic' as const)
        : ('basic' as const),
  };
}

'use client';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === '/login' || pathname === '/unregister') return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

declare global {
  interface Window {
    electron?: {
      sendStatus: (payload: { status: string; progress: number }) => void;
    };
  }
}

export default function ElectronStatusReporter() {
  const router = useRouter();

  useEffect(() => {

    const isElectron = typeof window !== 'undefined' && 
                      window.electron && 
                      window.electron.sendStatus;

    if (!isElectron) return;

    const sendStatus = (status: string, progress: number) => {
      window.electron?.sendStatus({ status, progress });
    };

  
    sendStatus('Starting Turbopack...', 30);
    
    const timer1 = setTimeout(() => {
      sendStatus('Compiling components...', 60);
    }, 2000);
    
    const timer2 = setTimeout(() => {
      sendStatus('Finalizing compilation...', 90);
    }, 4000);
    
    const timer3 = setTimeout(() => {
      sendStatus('Ready! Loading app...', 100);

      router.push('/');
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [router]);

  return null;
}
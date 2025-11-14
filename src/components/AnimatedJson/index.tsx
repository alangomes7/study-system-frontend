'use client';

import { useEffect, useState } from 'react';
import clsx from 'clsx';
import Lottie from 'lottie-react';
import { useThemeData } from '@/components';

type AnimatedJsonProps =
  | {
      jsonData: object;
      path?: never;
      pathDark?: never;
    }
  | {
      jsonData?: never;
      path: string;
      pathDark?: string;
    };

export default function AnimatedJson({
  className = 'w-12 h-12',
  jsonData,
  path,
  pathDark,
}: AnimatedJsonProps & { className?: string }) {
  const { theme } = useThemeData();

  const [hydrated, setHydrated] = useState(false);
  const [animationData, setAnimationData] = useState<object | null>(
    jsonData ?? null,
  );

  useEffect(() => {
    setHydrated(true);
  }, []);

  const activeTheme = hydrated ? theme : null;

  useEffect(() => {
    if (!hydrated) return;

    if (jsonData) {
      setAnimationData(jsonData);
      return;
    }

    const activePath = activeTheme === 'dark' && pathDark ? pathDark : path;

    if (!activePath) {
      setAnimationData(null);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        const res = await fetch(activePath);
        if (!res.ok) throw new Error(`Failed to fetch Lottie: ${res.status}`);
        const data = await res.json();
        if (mounted) setAnimationData(data);
      } catch (err) {
        console.error(`Lottie load error (${activePath}):`, err);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [jsonData, path, pathDark, activeTheme, hydrated]);

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      {animationData && (
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  );
}

import { useEffect, useRef } from 'react';
import { APP_CONFIG } from '@/lib/config';

interface AdSlotProps {
  slot: keyof typeof APP_CONFIG.adSlots;
  variant?: 'top' | 'inline';
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/** Renders a responsive AdSense unit once client + slot IDs are configured; nothing before that. */
export default function AdSlot({ slot, variant = 'inline' }: AdSlotProps) {
  const pushed = useRef(false);

  const slotId = APP_CONFIG.adSlots[slot];
  const enabled = Boolean(APP_CONFIG.adsenseClient && slotId);

  useEffect(() => {
    if (!enabled || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ad blocked or script not loaded yet
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`ad ad-${variant}`} aria-label="Quảng cáo">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={APP_CONFIG.adsenseClient}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

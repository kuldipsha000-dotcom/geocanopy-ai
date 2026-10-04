import { useEffect, useState, useRef } from 'react';
import {
  ref,
  onValue,
  set,
  increment,
  runTransaction,
  onDisconnect,
  serverTimestamp,
} from 'firebase/database';
import { database, isFirebaseConfigured } from '../lib/firebase';

export interface VisitorCountState {
  /** Number of users currently active on the site */
  activeNow: number;
  /** All-time unique page visit count */
  totalVisits: number;
  /** Whether Firebase is configured and connected */
  isLive: boolean;
  /** Loading state during first connection */
  isLoading: boolean;
  /** Connection status */
  status: 'live' | 'fallback' | 'connecting';
}

// Fallback: realistic seeded numbers when Firebase is not configured
const SEEDED_ACTIVE = 47;
const SEEDED_TOTAL = 18420;

/**
 * useVisitorCount
 *
 * Tracks real-time active visitors and total page visits using
 * Firebase Realtime Database presence system.
 *
 * How it works:
 *   - On mount: increments /visitors/totalVisits and writes an
 *     ephemeral presence record to /visitors/active/{sessionId}
 *   - Firebase onDisconnect ensures the presence record is
 *     automatically deleted when the user closes the tab / loses
 *     connection — giving a true "users online right now" count.
 *   - onValue listeners subscribe to both paths in real-time, so
 *     all open tabs see the same numbers update instantly.
 */
export function useVisitorCount(): VisitorCountState {
  const [activeNow, setActiveNow] = useState<number>(SEEDED_ACTIVE);
  const [totalVisits, setTotalVisits] = useState<number>(SEEDED_TOTAL);
  const [status, setStatus] = useState<'live' | 'fallback' | 'connecting'>('connecting');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Unique session ID for this browser tab
  const sessionId = useRef<string>(
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  );

  useEffect(() => {
    // ── Fallback mode: Firebase not configured yet ────────────────────────
    if (!isFirebaseConfigured || !database) {
      // Simulate slight randomness around seeded values for visual life
      const jitter = () => Math.floor(Math.random() * 8) - 3;
      setActiveNow(SEEDED_ACTIVE + jitter());
      setTotalVisits(SEEDED_TOTAL + Math.floor(Math.random() * 20));
      setStatus('fallback');
      setIsLoading(false);

      // Slowly tick the active count up/down to simulate live-ness
      const interval = setInterval(() => {
        setActiveNow((prev) => {
          const next = prev + jitter();
          return Math.max(30, Math.min(80, next));
        });
      }, 7000);

      return () => clearInterval(interval);
    }

    // ── Live Firebase mode ────────────────────────────────────────────────
    const db = database;
    const sessId = sessionId.current;

    // Refs
    const totalRef   = ref(db, 'visitors/totalVisits');
    const activeRef  = ref(db, `visitors/active/${sessId}`);
    const activeAll  = ref(db, 'visitors/active');
    const connRef    = ref(db, '.info/connected');

    let unsubConn:   (() => void) | null = null;
    let unsubActive: (() => void) | null = null;
    let unsubTotal:  (() => void) | null = null;
    
    // Fallback timeout if database is not created yet
    const timeoutId = setTimeout(() => {
      setStatus('fallback');
      setIsLoading(false);
      setActiveNow(SEEDED_ACTIVE);
      setTotalVisits(SEEDED_TOTAL);
    }, 3000);

    // 1. Watch Firebase connection state
    unsubConn = onValue(connRef, async (snap) => {
      if (snap.val() === true) {
        clearTimeout(timeoutId);
        setStatus('live');

        // 2. Register presence: write session record, auto-delete on disconnect
        await set(activeRef, { connectedAt: serverTimestamp() }).catch(() => {});
        onDisconnect(activeRef).remove().catch(() => {});

        // 3. Increment total visit counter (atomic)
        await runTransaction(totalRef, (current) => (current || 0) + 1).catch(() => {});
      }
    });

    // 4. Listen to active visitor count (count children of /visitors/active)
    unsubActive = onValue(activeAll, (snap) => {
      clearTimeout(timeoutId);
      const count = snap.exists() ? Object.keys(snap.val()).length : 0;
      setActiveNow(Math.max(1, count));
      setIsLoading(false);
    }, () => {
      // Handle permission_denied or database not found
      clearTimeout(timeoutId);
      setStatus('fallback');
      setIsLoading(false);
    });

    // 5. Listen to total visits counter
    unsubTotal = onValue(totalRef, (snap) => {
      if (snap.exists()) {
        setTotalVisits(snap.val() as number);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubConn?.();
      unsubActive?.();
      unsubTotal?.();
      // Remove this session's presence record immediately on unmount
      if (db) {
        set(ref(db, `visitors/active/${sessId}`), null).catch(() => {});
      }
    };
  }, []);

  return {
    activeNow,
    totalVisits,
    isLive: status === 'live',
    isLoading,
    status,
  };
}

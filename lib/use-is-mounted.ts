import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * Hook to safely determine if the component has mounted on the client.
 * Returns false during SSR and initial hydration, and true immediately after mount.
 * Prevents hydration mismatches without triggering cascading setState in useEffect.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

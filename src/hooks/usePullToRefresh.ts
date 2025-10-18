import { useEffect, useRef, useState } from 'react';
import { hapticService } from '../services/hapticService';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  enabled?: boolean;
  scrollContainer?: () => HTMLElement | null;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  enabled = true,
  scrollContainer
}: PullToRefreshOptions) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setIsPulling(false);
      setIsRefreshing(false);
      setPullDistance(0);
      return;
    }

    let rafId = 0;

    const getScrollContainer = () => scrollContainer?.() ?? null;
    const getScrollTop = () => {
      const container = getScrollContainer();
      if (container) {
        return container.scrollTop;
      }

      return window.scrollY || document.documentElement.scrollTop;
    };

    const isEventWithinContainer = (event: TouchEvent) => {
      const container = getScrollContainer();
      if (!container) return true;

      const target = event.target as Node | null;
      return !!(target && container.contains(target));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isEventWithinContainer(e)) return;

      const scrollTop = getScrollTop();
      if (scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      if (!isEventWithinContainer(e)) return;

      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;

      if (distance > 0) {
        e.preventDefault();
        const cappedDistance = Math.min(distance * 0.5, maxPullDistance);
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setPullDistance(cappedDistance);

          // Haptic feedback at threshold
          if (cappedDistance >= threshold && pullDistance < threshold) {
            hapticService.medium();
          }
        });
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        await hapticService.success();
        
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    const target = getScrollContainer() ?? document;

    target.addEventListener('touchstart', handleTouchStart, { passive: true });
    target.addEventListener('touchmove', handleTouchMove, { passive: false });
    target.addEventListener('touchend', handleTouchEnd);

    return () => {
      target.removeEventListener('touchstart', handleTouchStart as EventListener);
      target.removeEventListener('touchmove', handleTouchMove as EventListener);
      target.removeEventListener('touchend', handleTouchEnd as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [enabled, isPulling, isRefreshing, pullDistance, threshold, maxPullDistance, onRefresh, scrollContainer]);

  return {
    isPulling: enabled && isPulling,
    isRefreshing: enabled && isRefreshing,
    pullDistance: enabled ? pullDistance : 0,
    shouldTrigger: enabled && pullDistance >= threshold
  };
};

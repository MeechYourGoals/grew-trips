
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { MobileBottomNav } from './MobileBottomNav';
import { PullToRefreshIndicator } from './PullToRefreshIndicator';
import { useIsMobile } from '../../hooks/use-mobile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { cn } from '@/lib/utils';

interface MobileAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileAppLayout = ({ children, className }: MobileAppLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const getScrollContainer = useCallback(() => scrollContainerRef.current, []);
  const [hasNestedPullRefresh, setHasNestedPullRefresh] = useState(false);

  const pullToRefreshThreshold = 90;
  const pullToRefreshMaxDistance = 140;

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries();
  }, [queryClient]);

  const { isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: pullToRefreshThreshold,
    maxPullDistance: pullToRefreshMaxDistance,
    enabled: isMobile && !hasNestedPullRefresh,
    scrollContainer: getScrollContainer
  });

  if (!isMobile) {
    // On desktop, return children without mobile layout
    return <>{children}</>;
  }

  useEffect(() => {
    if (!isMobile) return;

    const updateViewportHeight = () => {
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--mobile-viewport-height', `${viewportHeight}px`);

      if (viewportRef.current) {
        viewportRef.current.style.setProperty('--mobile-viewport-height', `${viewportHeight}px`);
      }
    };

    updateViewportHeight();

    const handleResize = () => {
      requestAnimationFrame(updateViewportHeight);
    };

    const visualViewport = window.visualViewport;
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    visualViewport?.addEventListener('resize', handleResize);
    visualViewport?.addEventListener('scroll', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      visualViewport?.removeEventListener('resize', handleResize);
      visualViewport?.removeEventListener('scroll', handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateNestedIndicatorPresence = () => {
      const hasCustomIndicator = !!container.querySelector('[data-mobile-pull-indicator="component"]');
      setHasNestedPullRefresh(hasCustomIndicator);
    };

    updateNestedIndicatorPresence();

    const observer = new MutationObserver(updateNestedIndicatorPresence);
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      setHasNestedPullRefresh(false);
    };
  }, [isMobile, location.pathname]);

  useEffect(() => {
    if (!isMobile || hasNestedPullRefresh) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({ top: 0, behavior: 'auto' });
  }, [isMobile, hasNestedPullRefresh, location.pathname]);

  useEffect(() => {
    if (!isMobile) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobile]);

  return (
    <div
      ref={viewportRef}
      className={cn(
        'relative flex min-h-[var(--mobile-viewport-height,100dvh)] flex-col bg-background text-foreground',
        'ios-safe-top overflow-hidden',
        className
      )}
      style={{
        minHeight: 'var(--mobile-viewport-height, 100dvh)'
      }}
    >
      {/* Main content area with bottom padding for nav */}
      <main
        ref={scrollContainerRef}
        className="relative flex-1 overflow-y-auto native-scroll pb-mobile-nav-height"
        style={{
          paddingBottom: `calc(80px + env(safe-area-inset-bottom))`
        }}
      >
        {!hasNestedPullRefresh && (
          <PullToRefreshIndicator
            isRefreshing={isRefreshing}
            pullDistance={pullDistance}
            threshold={pullToRefreshThreshold}
            source="layout"
          />
        )}
        <div className="relative z-10 min-h-[calc(var(--mobile-viewport-height,100dvh)-80px)]">
          {children}
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};


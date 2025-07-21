
import React from 'react';
import { MobileBottomNav } from './MobileBottomNav';
import { useIsMobile } from '../../hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileAppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileAppLayout = ({ children, className }: MobileAppLayoutProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // On desktop, return children without mobile layout
    return <>{children}</>;
  }

  return (
    <div className={cn("flex flex-col min-h-screen", className)}>
      {/* Main content area with bottom padding for nav */}
      <main 
        className="flex-1 pb-mobile-nav-height"
        style={{
          paddingBottom: `calc(80px + env(safe-area-inset-bottom))`
        }}
      >
        {children}
      </main>
      
      {/* Fixed bottom navigation */}
      <MobileBottomNav />
    </div>
  );
};


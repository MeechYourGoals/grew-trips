import { useEffect, useRef } from 'react';
import { useIsMobile } from './use-mobile';

interface KeyboardHandlerOptions {
  preventZoom?: boolean;
  adjustViewport?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

export const useKeyboardHandler = (options: KeyboardHandlerOptions = {}) => {
  const isMobile = useIsMobile();
  const initialViewportHeight = useRef<number>();
  const keyboardVisible = useRef(false);

  useEffect(() => {
    if (!isMobile) return;

    // Store initial viewport height
    initialViewportHeight.current = window.visualViewport?.height || window.innerHeight;

    const handleViewportChange = () => {
      if (!window.visualViewport) return;

      const currentHeight = window.visualViewport.height;
      const heightDifference = (initialViewportHeight.current || 0) - currentHeight;
      
      // Keyboard is considered visible if viewport height decreased by more than 150px
      const isKeyboardVisible = heightDifference > 150;

      if (isKeyboardVisible !== keyboardVisible.current) {
        keyboardVisible.current = isKeyboardVisible;

        if (isKeyboardVisible) {
          document.body.classList.add('keyboard-visible');
          options.onShow?.();
          
          // Adjust viewport for iOS keyboard
          if (options.adjustViewport) {
            document.documentElement.style.setProperty(
              '--keyboard-height', 
              `${heightDifference}px`
            );
          }
        } else {
          document.body.classList.remove('keyboard-visible');
          options.onHide?.();
          
          if (options.adjustViewport) {
            document.documentElement.style.removeProperty('--keyboard-height');
          }
        }
      }
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        // Prevent zoom on iOS
        if (options.preventZoom && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          const originalFontSize = target.style.fontSize;
          target.style.fontSize = '16px';
          
          // Restore original font size after blur
          const handleBlur = () => {
            target.style.fontSize = originalFontSize;
            target.removeEventListener('blur', handleBlur);
          };
          target.addEventListener('blur', handleBlur);
        }

        // Scroll input into view on iOS
        setTimeout(() => {
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 300);
      }
    };

    // Add event listeners
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }
    document.addEventListener('focusin', handleFocusIn);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      document.removeEventListener('focusin', handleFocusIn);
      
      // Cleanup
      document.body.classList.remove('keyboard-visible');
      document.documentElement.style.removeProperty('--keyboard-height');
    };
  }, [isMobile, options.preventZoom, options.adjustViewport, options.onShow, options.onHide]);

  return {
    isKeyboardVisible: keyboardVisible.current
  };
};
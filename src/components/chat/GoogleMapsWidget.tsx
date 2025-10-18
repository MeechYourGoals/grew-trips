import React, { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface GoogleMapsWidgetProps {
  widgetToken: string;
  height?: number;
}

export const GoogleMapsWidget = ({ widgetToken, height = 300 }: GoogleMapsWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Maps Extended Component Library
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=extended&loading=async`;
    script.async = true;
    
    const onScriptLoad = () => {
      if (containerRef.current && !containerRef.current.querySelector('gmp-place-contextual')) {
        const widget = document.createElement('gmp-place-contextual') as any;
        widget.setAttribute('context-token', widgetToken);
        widget.style.width = '100%';
        widget.style.height = `${height}px`;
        containerRef.current.appendChild(widget);
      }
    };

    script.onload = onScriptLoad;
    
    // Check if script already exists
    const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existingScript) {
      onScriptLoad();
    } else {
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup: remove script if component unmounts and no other instances exist
      if (document.head.contains(script)) {
        const widgets = document.querySelectorAll('gmp-place-contextual');
        if (widgets.length <= 1) {
          document.head.removeChild(script);
        }
      }
    };
  }, [widgetToken, height]);

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden my-3">
      <div className="bg-white/10 px-3 py-2 flex items-center gap-2 border-b border-white/10">
        <MapPin size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-white">Google Maps</span>
        <div className="ml-auto text-xs text-gray-400 flex items-center gap-1">
          <ExternalLink size={12} />
          Verified by Google
        </div>
      </div>
      <div ref={containerRef} style={{ height: `${height}px`, minHeight: '200px' }} />
    </div>
  );
};

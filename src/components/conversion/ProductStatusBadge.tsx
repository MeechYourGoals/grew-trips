import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, Smartphone, Globe, Monitor } from 'lucide-react';

interface ProductStatusBadgeProps {
  className?: string;
}

export const ProductStatusBadge = ({ className = '' }: ProductStatusBadgeProps) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2">
          <CheckCircle size={14} />
          Live & Available Now
        </Badge>
        <Badge variant="outline" className="border-primary/30 text-primary">
          Beta v2.1
        </Badge>
      </div>

      {/* Platform Availability */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="font-medium">Available on:</span>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Globe size={16} className="text-green-400" />
            <span>Web</span>
          </div>
          <div className="flex items-center gap-1">
            <Smartphone size={16} className="text-green-400" />
            <span>iOS/Android</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor size={16} className="text-green-400" />
            <span>Desktop</span>
          </div>
        </div>
      </div>

      {/* Launch Timeline */}
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>Pro features rolling out Q2 2025 • Events platform Q3 2025</span>
        </div>
      </div>
    </div>
  );
};
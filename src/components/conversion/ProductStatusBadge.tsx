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
          Demo mode live – full launch coming soon
        </Badge>
      </div>

      {/* Launch Timeline */}
      <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <Clock size={12} />
          <span>Chravel Pro features launching Q4 2025 • Chravel Events platform launching Q1 2026</span>
        </div>
      </div>
    </div>
  );
};
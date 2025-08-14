import React from 'react';
import { Badge } from '../ui/badge';
import { CheckCircle, Clock, Smartphone, Globe, Monitor } from 'lucide-react';

interface ProductStatusBadgeProps {
  className?: string;
}

export const ProductStatusBadge = ({ className = '' }: ProductStatusBadgeProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Status Badge */}
      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 flex items-center gap-2 w-fit">
        <CheckCircle size={14} />
        Demo mode live – full launch coming soon
      </Badge>

      {/* Launch Timeline Badges - Stacked */}
      <Badge variant="secondary" className="bg-gray-500/20 text-gray-400 border-gray-500/30 flex items-center gap-2 w-fit text-sm">
        <Clock size={12} />
        Pro features Q4 2025 • Events platform Q1 2026
      </Badge>
    </div>
  );
};
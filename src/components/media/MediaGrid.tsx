import React from 'react';
import { MediaItem } from './MediaItem';

interface MediaItemData {
  id: string;
  media_url: string;
  filename: string;
  media_type: 'image' | 'video' | 'document';
  metadata: any;
  created_at: string;
  source: 'chat' | 'upload';
}

interface MediaGridProps {
  items: MediaItemData[];
  maxItems?: number;
}

export const MediaGrid = ({ items, maxItems }: MediaGridProps) => {
  const displayItems = maxItems ? items.slice(0, maxItems) : items;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayItems.map((item) => (
          <MediaItem key={item.id} item={item} />
        ))}
      </div>
      {maxItems && items.length > maxItems && (
        <p className="text-center text-gray-400 text-sm">
          Showing {maxItems} of {items.length} items
        </p>
      )}
    </div>
  );
};

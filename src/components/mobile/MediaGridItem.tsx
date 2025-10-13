import React from 'react';
import { Film } from 'lucide-react';
import { useLongPress } from '../../hooks/useLongPress';
import { OptimizedImage } from './OptimizedImage';
import { hapticService } from '../../services/hapticService';

interface MediaGridItemProps {
  item: {
    id: string;
    type: 'image' | 'video';
    url: string;
  };
  onPress: () => void;
  onLongPress: () => void;
}

export const MediaGridItem: React.FC<MediaGridItemProps> = ({ item, onPress, onLongPress }) => {
  const longPressHandlers = useLongPress({
    onLongPress: async () => {
      await hapticService.medium();
      onLongPress();
    },
  });

  return (
    <button
      {...longPressHandlers}
      onClick={async () => {
        await hapticService.light();
        onPress();
      }}
      className="media-grid-item rounded-md bg-white/5"
      style={{ 
        WebkitTapHighlightColor: 'transparent',
        WebkitTouchCallout: 'none' 
      }}
    >
      <OptimizedImage
        src={item.url}
        alt="Trip media"
        className="w-full h-full object-cover"
        width={300}
        loading="lazy"
      />
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
            <Film size={20} className="text-white drop-shadow-lg" />
          </div>
        </div>
      )}
    </button>
  );
};

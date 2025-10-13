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
      className="aspect-square rounded-lg overflow-hidden bg-white/10 active:opacity-80 transition-opacity relative"
    >
      <OptimizedImage
        src={item.url}
        alt="Trip media"
        className="w-full h-full object-cover"
        width={300}
        loading="lazy"
      />
      {item.type === 'video' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Film size={24} className="text-white" />
        </div>
      )}
    </button>
  );
};

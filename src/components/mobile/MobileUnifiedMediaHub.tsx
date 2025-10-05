import React, { useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, Film } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { useLongPress } from '../../hooks/useLongPress';
import { PullToRefreshIndicator } from './PullToRefreshIndicator';
import { MediaSkeleton } from './SkeletonLoader';
import { OptimizedImage } from './OptimizedImage';
import { hapticService } from '../../services/hapticService';
import { capacitorIntegration } from '../../services/capacitorIntegration';

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

interface MobileUnifiedMediaHubProps {
  tripId: string;
}

export const MobileUnifiedMediaHub = ({ tripId }: MobileUnifiedMediaHubProps) => {
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0',
      uploadedBy: 'Sarah',
      uploadedAt: new Date()
    },
    {
      id: '2',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
      uploadedBy: 'Mike',
      uploadedAt: new Date()
    }
  ]);
  const [selectedTab, setSelectedTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    }
  });

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleTakePicture = async () => {
    await hapticService.medium();
    try {
      const result = await capacitorIntegration.takePicture();
      if (result) {
        console.log('Photo captured:', result);
        // Upload logic here
      }
    } catch (error) {
      console.error('Error taking picture:', error);
    }
  };

  const handleSelectImage = async () => {
    await hapticService.medium();
    try {
      const result = await capacitorIntegration.selectImage();
      if (result) {
        console.log('Image selected:', result);
        // Upload logic here
      }
    } catch (error) {
      console.error('Error selecting image:', error);
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'photos') return item.type === 'image';
    if (selectedTab === 'videos') return item.type === 'video';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-black relative">
      <PullToRefreshIndicator
        isRefreshing={isRefreshing}
        pullDistance={pullDistance}
        threshold={80}
      />

      {/* Action Buttons */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleTakePicture}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-medium active:scale-95 transition-transform"
          >
            <Camera size={20} />
            <span>Take Photo</span>
          </button>
          <button
            onClick={handleSelectImage}
            className="flex items-center justify-center gap-2 bg-white/10 text-white px-4 py-3 rounded-xl font-medium active:scale-95 transition-transform"
          >
            <Upload size={20} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 py-3 border-b border-white/10">
        {(['all', 'photos', 'videos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={async () => {
              await hapticService.light();
              setSelectedTab(tab);
            }}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              active:scale-95
              ${
                selectedTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/10 text-gray-300'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <MediaSkeleton />
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No media yet</p>
            <p className="text-sm text-gray-500">Tap the camera button to add photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {filteredMedia.map((item) => {
              const longPressHandlers = useLongPress({
                onLongPress: () => {
                  console.log('Long press on media item:', item.id);
                  // Could show options menu (delete, share, etc.)
                },
              });

              return (
                <button
                  key={item.id}
                  {...longPressHandlers}
                  onClick={async () => {
                    await hapticService.light();
                    // Open full screen viewer
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
            })}
          </div>
        )}
      </div>
    </div>
  );
};

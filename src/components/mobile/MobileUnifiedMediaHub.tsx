import React, { useState, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, Film } from 'lucide-react';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { PullToRefreshIndicator } from './PullToRefreshIndicator';
import { MediaSkeleton } from './SkeletonLoader';
import { hapticService } from '../../services/hapticService';
import { capacitorIntegration } from '../../services/capacitorIntegration';
import { StorageQuotaBar } from '../StorageQuotaBar';
import { useMediaManagement } from '../../hooks/useMediaManagement';
import { useDemoMode } from '../../hooks/useDemoMode';
import { MediaGridItem } from './MediaGridItem';

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
  const { isDemoMode } = useDemoMode();
  const { mediaItems: realMediaItems, loading, refetch } = useMediaManagement(tripId);
  const [selectedTab, setSelectedTab] = useState<'all' | 'photos' | 'videos'>('all');

  const { isPulling, isRefreshing, pullDistance } = usePullToRefresh({
    onRefresh: async () => {
      await refetch();
    }
  });

  // Convert media items to unified format
  const mediaItems: MediaItem[] = realMediaItems
    .filter(item => item.media_type === 'image' || item.media_type === 'video')
    .map(item => ({
      id: item.id,
      type: item.media_type === 'video' ? 'video' : 'image',
      url: item.media_url,
      uploadedBy: 'User',
      uploadedAt: new Date(item.created_at)
    }));

  const filteredMedia = mediaItems.filter(item => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'photos') return item.type === 'image';
    if (selectedTab === 'videos') return item.type === 'video';
    return true;
  });

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

      {/* Storage Quota Bar */}
      <div className="px-4 py-3 border-b border-white/10">
        <StorageQuotaBar tripId={tripId} showDetails={true} />
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
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        {loading ? (
          <MediaSkeleton />
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-2">No media yet</p>
            <p className="text-sm text-gray-500">Tap the camera button to add photos</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {filteredMedia.map((item) => (
              <MediaGridItem
                key={item.id}
                item={item}
                onPress={() => {
                  console.log('Open fullscreen viewer for:', item.id);
                }}
                onLongPress={() => {
                  console.log('Show options menu for:', item.id);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

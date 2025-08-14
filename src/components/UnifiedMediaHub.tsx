import React, { useState, useEffect } from 'react';
import { Camera, Video, FileText, Music, Image, Play, Download, MessageCircle, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import MockDataService, { MockMediaItem } from '@/services/mockDataService';

interface MediaItem {
  id: string;
  media_url: string;
  filename: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  metadata: any;
  created_at: string;
  source: 'chat' | 'upload';
}

interface UnifiedMediaHubProps {
  tripId: string;
}

export const UnifiedMediaHub = ({ tripId }: UnifiedMediaHubProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    fetchMediaItems();
  }, [tripId, isDemoMode]);

  const fetchMediaItems = async () => {
    try {
      if (isDemoMode || MockDataService.isUsingMockData()) {
        // Use mock data
        const mockMedia = MockDataService.getMockMediaItems(tripId);
        setMediaItems(mockMedia);
        setLoading(false);
        return;
      }

      // Fetch from media index (chat aggregated media)
      const { data: chatMedia, error: chatError } = await supabase
        .from('trip_media_index')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (chatError) throw chatError;

      // Fetch uploaded files from trip_files (existing upload system)
      const { data: uploadedFiles, error: fileError } = await supabase
        .from('trip_files')
        .select('*')
        .eq('trip_id', tripId)
        .in('file_type', ['image', 'video', 'audio', 'document'])
        .order('created_at', { ascending: false });

      if (fileError) throw fileError;

      // Combine both sources
      const allMedia: MediaItem[] = [
        ...(chatMedia || []).map(item => ({
          id: item.id,
          media_url: item.media_url,
          filename: item.filename || 'Unknown',
          media_type: item.media_type as 'image' | 'video' | 'audio' | 'document',
          metadata: item.metadata || {},
          created_at: item.created_at,
          source: 'chat' as const
        })),
        ...(uploadedFiles || []).map(item => ({
          id: item.id,
          media_url: `/storage/trip-files/${item.name}`,
          filename: item.name,
          media_type: item.file_type as 'image' | 'video' | 'audio' | 'document',
          metadata: { source: 'upload' },
          created_at: item.created_at,
          source: 'upload' as const
        }))
      ];

      // Sort by date descending
      allMedia.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setMediaItems(allMedia);
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMediaByType = (type: string) => {
    if (type === 'all') return mediaItems;
    if (type === 'photos') return mediaItems.filter(item => item.media_type === 'image');
    if (type === 'videos') return mediaItems.filter(item => item.media_type === 'video');
    if (type === 'audio') return mediaItems.filter(item => item.media_type === 'audio');
    if (type === 'documents') return mediaItems.filter(item => item.media_type === 'document');
    return mediaItems;
  };

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Music className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const renderMediaGrid = (items: MediaItem[]) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Media Yet</h3>
          <p className="text-muted-foreground">
            Photos, videos, and files shared in chat or uploaded will appear here automatically
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
            {item.media_type === 'image' ? (
              <img
                src={item.media_url}
                alt={item.filename}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
            ) : item.media_type === 'video' ? (
              <div className="relative w-full h-full bg-black flex items-center justify-center">
                <video
                  src={item.media_url}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white/10 flex flex-col items-center justify-center p-4">
                {getMediaIcon(item.media_type)}
                <span className="text-xs text-center mt-2 truncate w-full">{item.filename}</span>
              </div>
            )}
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-1">
                  {item.source === 'chat' ? (
                    <MessageCircle className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-white bg-black/50 rounded p-0.5" />
                  )}
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-medium truncate">{item.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-white/80 text-xs">
                    {item.source === 'chat' ? 'From chat' : 'Uploaded'}
                  </p>
                  {item.media_type !== 'image' && (
                    <Download className="w-3 h-3 text-white/80" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const filteredItems = filterMediaByType(activeTab);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/5 backdrop-blur-sm">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
          <TabsTrigger value="videos" className="text-xs">Videos</TabsTrigger>
          <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
          <TabsTrigger value="documents" className="text-xs">Docs</TabsTrigger>
          <TabsTrigger value="gifs" className="text-xs">GIFs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
        
        <TabsContent value="photos" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
        
        <TabsContent value="audio" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
        
        <TabsContent value="gifs" className="mt-6">
          {renderMediaGrid(filteredItems)}
        </TabsContent>
      </Tabs>

      {/* Dev/Demo Controls */}
      {(isDemoMode || MockDataService.isUsingMockData()) && (
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-sm text-yellow-200 mb-2">
            🚧 Development Mode: Using mock data
          </p>
          <button
            onClick={() => {
              MockDataService.reseedMockData(tripId);
              fetchMediaItems();
            }}
            className="text-xs px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-md transition-colors"
          >
            Reseed Mock Data
          </button>
        </div>
      )}
    </div>
  );
};
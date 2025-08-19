import React, { useState, useEffect } from 'react';
import { Camera, Video, FileText, Music, Link, ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';
import { demoModeService } from '../services/demoModeService';
import MockDataService from '../services/mockDataService';
import TripSpecificMockDataService from '../services/tripSpecificMockDataService';
import { MediaSubTabs } from './MediaSubTabs';

interface MediaItem {
  id: string;
  media_url: string;
  filename: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  metadata: any;
  created_at: string;
  source: 'chat' | 'upload';
}

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description: string;
  domain: string;
  image_url?: string;
  created_at: string;
  source: 'chat' | 'manual' | 'pinned';
  category?: 'Housing' | 'Eats' | 'Activities';
  tags?: string[];
}

interface UnifiedMediaHubProps {
  tripId: string;
}

export const UnifiedMediaHub = ({ tripId }: UnifiedMediaHubProps) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    fetchMediaItems();
    fetchLinkItems();
  }, [tripId, isDemoMode]);

  const fetchMediaItems = async () => {
    try {
      if (isDemoMode) {
        // Use trip-specific mock data in demo mode
        const mockMedia = TripSpecificMockDataService.getMockMediaItems(tripId);
        setMediaItems(mockMedia);
      } else {
        // Fetch from Supabase in production
        const [mediaResponse, filesResponse] = await Promise.all([
          supabase
            .from('trip_media_index')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false }),
          
          supabase
            .from('trip_files')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false })
        ]);

        const combinedMedia = [
          ...(mediaResponse.data || []).map(item => ({
            id: item.id,
            media_url: item.media_url,
            filename: item.filename || 'Untitled',
            media_type: item.media_type as 'image' | 'video' | 'audio' | 'document',
            metadata: item.metadata || {},
            created_at: item.created_at,
            source: 'chat' as const
          })),
          ...(filesResponse.data || []).map(item => ({
            id: item.id,
            media_url: `/storage/trip-files/${item.name}`,
            filename: item.name,
            media_type: item.file_type as 'image' | 'video' | 'audio' | 'document',
            metadata: { extracted_events: item.extracted_events },
            created_at: item.created_at,
            source: 'upload' as const
          }))
        ];

        setMediaItems(combinedMedia);
      }
    } catch (error) {
      console.error('Error fetching media items:', error);
      setMediaItems([]);
    }
  };

  const fetchLinkItems = async () => {
    try {
      if (isDemoMode) {
        // Use trip-specific mock data in demo mode
        const mockLinks = TripSpecificMockDataService.getMockLinkItems(tripId);
        setLinkItems(mockLinks);
      } else {
        // Fetch from Supabase in production
        const [linksResponse, manualLinksResponse] = await Promise.all([
          supabase
            .from('trip_link_index')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false }),
          
          supabase
            .from('trip_links')
            .select('*')
            .eq('trip_id', tripId)
            .order('created_at', { ascending: false })
        ]);

        const combinedLinks = [
          ...(linksResponse.data || []).map(item => ({
            id: item.id,
            url: item.url,
            title: item.og_title || 'Untitled Link',
            description: item.og_description || '',
            domain: item.domain || new URL(item.url).hostname,
            image_url: item.og_image_url,
            created_at: item.created_at,
            source: 'chat' as const,
            category: 'Activities' as const,
            tags: []
          })),
          ...(manualLinksResponse.data || []).map(item => ({
            id: item.id,
            url: item.url,
            title: item.title || 'Untitled Link',
            description: item.description || '',
            domain: new URL(item.url).hostname,
            image_url: undefined,
            created_at: item.created_at,
            source: 'manual' as const,
            category: item.category as 'Housing' | 'Eats' | 'Activities' || 'Activities' as const,
            tags: []
          }))
        ];

        setLinkItems(combinedLinks);
      }
    } catch (error) {
      console.error('Error fetching link items:', error);
      setLinkItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filterMediaByType = (type: string) => {
    if (type === 'all') return [...mediaItems, ...linkItems];
    if (type === 'photos') return mediaItems.filter(item => item.media_type === 'image');
    if (type === 'videos') return mediaItems.filter(item => item.media_type === 'video');
    if (type === 'audio') return mediaItems.filter(item => item.media_type === 'audio');
    if (type === 'files') return mediaItems.filter(item => item.media_type === 'document');
    if (type === 'links') return linkItems;
    return mediaItems;
  };

  const renderAllItems = () => {
    if (mediaItems.length === 0 && linkItems.length === 0) {
      return (
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Media Yet</h3>
          <p className="text-muted-foreground">
            Photos, videos, files, and links shared in chat or uploaded will appear here automatically
          </p>
        </div>
      );
    }

    // Display combined media and links in a mixed grid/list layout
    const allItems = [...mediaItems, ...linkItems].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allItems.slice(0, 8).map((item, index) => {
            // Check if item is a media item or link item
            if ('media_type' in item) {
              const mediaItem = item as MediaItem;
              return (
                <div key={mediaItem.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
                  {mediaItem.media_type === 'image' ? (
                    <img
                      src={mediaItem.media_url}
                      alt={mediaItem.filename}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : mediaItem.media_type === 'video' ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        src={mediaItem.media_url}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white/10 flex flex-col items-center justify-center p-4">
                      {mediaItem.media_type === 'audio' ? <Music className="w-8 h-8 text-purple-400" /> : <FileText className="w-8 h-8 text-blue-400" />}
                      <span className="text-xs text-center mt-2 truncate w-full">{mediaItem.filename}</span>
                    </div>
                  )}
                </div>
              );
            } else {
              const linkItem = item as LinkItem;
              return (
                <div key={linkItem.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted border border-white/10 p-3 flex flex-col">
                  {linkItem.image_url ? (
                    <img
                      src={linkItem.image_url}
                      alt={linkItem.title}
                      className="w-full flex-1 object-cover rounded mb-2"
                    />
                  ) : (
                    <div className="w-full flex-1 bg-white/5 rounded mb-2 flex items-center justify-center">
                      <ExternalLink className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="text-xs">
                    <p className="text-white font-medium truncate">{linkItem.title}</p>
                    <p className="text-gray-400 text-xs">{linkItem.domain}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>
        {allItems.length > 8 && (
          <p className="text-center text-gray-400 text-sm">
            Showing 8 of {allItems.length} items • Use tabs above to filter by type
          </p>
        )}
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white/5 backdrop-blur-sm">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="photos" className="text-xs">Photos</TabsTrigger>
          <TabsTrigger value="videos" className="text-xs">Videos</TabsTrigger>
          <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
          <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
          <TabsTrigger value="links" className="text-xs">Links</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderAllItems()}
        </TabsContent>
        
        <TabsContent value="photos" className="mt-6">
          <MediaSubTabs items={mediaItems.filter(item => item.media_type === 'image')} type="photos" />
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <MediaSubTabs items={mediaItems.filter(item => item.media_type === 'video')} type="videos" />
        </TabsContent>
        
        <TabsContent value="audio" className="mt-6">
          <MediaSubTabs items={mediaItems.filter(item => item.media_type === 'audio')} type="audio" />
        </TabsContent>
        
        <TabsContent value="files" className="mt-6">
          <MediaSubTabs items={mediaItems.filter(item => 
            item.media_type === 'document' || 
            (item.media_type === 'image' && (item.metadata?.isSchedule || item.metadata?.isReceipt))
          )} type="files" />
        </TabsContent>
        
        <TabsContent value="links" className="mt-6">
          <MediaSubTabs items={linkItems} type="links" />
        </TabsContent>
      </Tabs>

    </div>
  );
};
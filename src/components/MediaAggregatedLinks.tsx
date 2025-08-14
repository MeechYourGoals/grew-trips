import React, { useEffect, useState } from 'react';
import { Link, ExternalLink, MessageCircle, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useDemoMode } from '@/hooks/useDemoMode';

interface LinkItem {
  id: string;
  url: string;
  title: string;
  description?: string;
  domain: string;
  og_image_url?: string;
  created_at: string;
  source: 'chat' | 'manual';
}

interface MediaAggregatedLinksProps {
  tripId: string;
}

export const MediaAggregatedLinks = ({ tripId }: MediaAggregatedLinksProps) => {
  const [linkItems, setLinkItems] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - show mock data
      setLinkItems([
        {
          id: '1',
          url: 'https://example.com/restaurant',
          title: 'Amazing Restaurant Downtown',
          description: 'Best seafood in the city with ocean views',
          domain: 'example.com',
          og_image_url: '',
          created_at: new Date().toISOString(),
          source: 'chat'
        },
        {
          id: '2',
          url: 'https://booking.com/hotel',
          title: 'Luxury Hotel Booking',
          description: 'Five-star accommodation with spa services',
          domain: 'booking.com',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          source: 'manual'
        }
      ]);
      setLoading(false);
      return;
    }

    fetchLinkItems();
  }, [tripId, isDemoMode]);

  const fetchLinkItems = async () => {
    try {
      // Fetch from link index (chat aggregated links)
      const { data: chatLinks, error: chatError } = await supabase
        .from('trip_link_index')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (chatError) throw chatError;

      // Fetch manually added links from trip_links
      const { data: manualLinks, error: linkError } = await supabase
        .from('trip_links')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });

      if (linkError) throw linkError;

      // Combine both sources
      const allLinks: LinkItem[] = [
        ...(chatLinks || []).map(item => ({
          id: item.id,
          url: item.url,
          title: item.og_title || item.domain || 'Link',
          description: item.og_description,
          domain: item.domain || new URL(item.url).hostname,
          og_image_url: item.og_image_url,
          created_at: item.created_at,
          source: 'chat' as const
        })),
        ...(manualLinks || []).map(item => ({
          id: item.id,
          url: item.url,
          title: item.title,
          description: item.description,
          domain: new URL(item.url).hostname,
          created_at: item.created_at,
          source: 'manual' as const
        }))
      ];

      // Sort by date descending and remove duplicates
      const uniqueLinks = allLinks.filter((link, index, self) => 
        index === self.findIndex(l => l.url === link.url)
      );
      uniqueLinks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setLinkItems(uniqueLinks);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (linkItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Link className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Links Yet</h3>
        <p className="text-muted-foreground">
          Links shared in chat or manually added will appear here automatically
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {linkItems.map((item) => (
        <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
          <div className="flex items-start gap-4">
            {item.og_image_url ? (
              <img
                src={item.og_image_url}
                alt={item.title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.domain}</p>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.source === 'chat' ? (
                    <MessageCircle className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  )}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {item.source === 'chat' ? 'From chat' : 'Manually added'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
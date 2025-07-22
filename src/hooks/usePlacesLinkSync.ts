
import { useState, useCallback } from 'react';
import { PlaceWithDistance } from '../types/basecamp';

interface LinkPost {
  id: string;
  title: string;
  url: string;
  description: string;
  category: 'housing' | 'eats' | 'day-activities' | 'nightlife' | 'fitness' | 'reservations' | 'transportation' | 'essentials' | 'other';
  imageUrl?: string;
  postedBy: string;
  postedAt: string;
  upvotes: number;
  comments: number;
  originatedFromPlace?: boolean;
  placeId?: string;
}

export const usePlacesLinkSync = () => {
  const [links, setLinks] = useState<LinkPost[]>([]);

  const mapPlaceCategoryToLink = (placeCategory: string): LinkPost['category'] => {
    switch (placeCategory) {
      case 'restaurant':
        return 'eats';
      case 'attraction':
        return 'day-activities';
      case 'hotel':
        return 'housing';
      case 'activity':
        return 'day-activities';
      case 'fitness':
        return 'fitness';
      case 'nightlife':
        return 'nightlife';
      case 'transportation':
        return 'transportation';
      default:
        return 'other';
    }
  };

  const generateMapsUrl = (place: PlaceWithDistance): string => {
    if (place.url) return place.url;
    if (place.address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`;
  };

  const createLinkFromPlace = useCallback((place: PlaceWithDistance, userName: string = 'You') => {
    const newLink: LinkPost = {
      id: `link-${place.id}`,
      title: place.name,
      url: generateMapsUrl(place),
      description: `Saved from Places${place.address ? `: ${place.address}` : ''}`,
      category: mapPlaceCategoryToLink(place.category || 'other'),
      postedBy: userName,
      postedAt: 'just now',
      upvotes: 0,
      comments: 0,
      originatedFromPlace: true,
      placeId: place.id
    };

    setLinks(prev => [...prev, newLink]);
    return newLink;
  }, []);

  const removeLinkByPlaceId = useCallback((placeId: string) => {
    setLinks(prev => prev.filter(link => link.placeId !== placeId));
  }, []);

  const updateLinkByPlaceId = useCallback((placeId: string, updatedPlace: PlaceWithDistance) => {
    setLinks(prev => prev.map(link => 
      link.placeId === placeId 
        ? {
            ...link,
            title: updatedPlace.name,
            url: generateMapsUrl(updatedPlace),
            description: `Saved from Places${updatedPlace.address ? `: ${updatedPlace.address}` : ''}`,
            category: mapPlaceCategoryToLink(updatedPlace.category || 'other')
          }
        : link
    ));
  }, []);

  return {
    links,
    createLinkFromPlace,
    removeLinkByPlaceId,
    updateLinkByPlaceId
  };
};

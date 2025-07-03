export interface EventSegment {
  id: string;
  name: string;
  count?: number;
  criteria?: string;
}

export const fetchEventSegments = async (): Promise<EventSegment[]> => {
  const res = await fetch('/api/event/segments');
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Failed to fetch event segments');
  }

  const data = await res.json();
  if (Array.isArray(data)) return data as EventSegment[];
  if (Array.isArray(data.segments)) return data.segments as EventSegment[];
  return [];
};

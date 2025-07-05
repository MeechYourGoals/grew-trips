// Consistent mock profile avatars used across the platform
export const mockAvatars = {
  // Consistent avatars for common mock names
  'Ray': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  'Maya': 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face', 
  'Sam': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  'Emma': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  'Jake': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
  'Sarah': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
  'Alex': 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
  'Lisa': 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face',
  'Mike': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=40&h=40&fit=crop&crop=face',
  'Anna': 'https://images.unsplash.com/photo-1491349174775-aaafddd81942?w=40&h=40&fit=crop&crop=face',
  'David': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=40&h=40&fit=crop&crop=face',
  'Sophie': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=40&h=40&fit=crop&crop=face',
  'Chris': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
  'Taylor': 'https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?w=40&h=40&fit=crop&crop=face',
  'Jordan': 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face',
  'Casey': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face'
};

// Fallback avatars for when a specific name isn't mapped
export const fallbackAvatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&h=40&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=40&h=40&fit=crop&crop=face'
];

// Get avatar for a specific name, with fallback
export const getMockAvatar = (name: string): string => {
  // Remove any extra spaces and normalize
  const normalizedName = name.trim();
  
  // Check if we have a specific avatar for this name
  if (mockAvatars[normalizedName as keyof typeof mockAvatars]) {
    return mockAvatars[normalizedName as keyof typeof mockAvatars];
  }
  
  // Use a consistent fallback based on name hash for consistency
  const hash = normalizedName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return fallbackAvatars[Math.abs(hash) % fallbackAvatars.length];
};

// Current user avatar (for "You" messages)
export const currentUserAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';
export const getTripColor = (tripId: number | string) => {
  // Create a hash from the trip ID for consistent color assignment
  const hash = typeof tripId === 'string' ? 
    tripId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
    tripId;
  
  const colorSchemes = [
    // Purple gradients
    'from-purple-500/20 to-purple-600/20 border-purple-500/30',
    // Green gradients  
    'from-green-500/20 to-green-600/20 border-green-500/30',
    // Pink gradients
    'from-pink-500/20 to-pink-600/20 border-pink-500/30',
    // Orange gradients
    'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    // Emerald gradients
    'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30',
    // Violet gradients
    'from-violet-500/20 to-violet-600/20 border-violet-500/30',
    // Cyan gradients
    'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
    // Rose gradients
    'from-rose-500/20 to-rose-600/20 border-rose-500/30',
    // Amber gradients
    'from-amber-500/20 to-amber-600/20 border-amber-500/30',
    // Indigo gradients
    'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30',
  ];

  return colorSchemes[hash % colorSchemes.length];
};

export const getTripAccentColor = (tripId: number | string) => {
  const hash = typeof tripId === 'string' ? 
    tripId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
    tripId;
  
  const accentColors = [
    'purple-400',
    'green-400', 
    'pink-400',
    'orange-400',
    'emerald-400',
    'violet-400',
    'cyan-400',
    'rose-400',
    'amber-400',
    'indigo-400',
  ];

  return accentColors[hash % accentColors.length];
};

export const getTripButtonGradient = (tripId: number | string) => {
  const hash = typeof tripId === 'string' ? 
    tripId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 
    tripId;
  
  const buttonGradients = [
    'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
    'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    'from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700',
    'from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700',
    'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
    'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700',
    'from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700',
    'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
  ];

  return buttonGradients[hash % buttonGradients.length];
};
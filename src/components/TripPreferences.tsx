
import React, { useState } from 'react';
import { Settings, Sparkles, Crown } from 'lucide-react';
import { TripPreferences as TripPreferencesType, DIETARY_OPTIONS, VIBE_OPTIONS } from '../types/consumer';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';

interface TripPreferencesProps {
  tripId: string;
  onPreferencesChange: (preferences: TripPreferencesType) => void;
}

export const TripPreferences = ({ tripId, onPreferencesChange }: TripPreferencesProps) => {
  const { isPlus } = useConsumerSubscription();
  const [preferences, setPreferences] = useState<TripPreferencesType>({
    dietary: [],
    vibe: [],
    budget: 'mid-range',
    timePreference: 'flexible'
  });

  const handleDietaryChange = (option: string) => {
    const newDietary = preferences.dietary.includes(option)
      ? preferences.dietary.filter(item => item !== option)
      : [...preferences.dietary, option];
    
    const newPreferences = { ...preferences, dietary: newDietary };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleVibeChange = (option: string) => {
    const newVibe = preferences.vibe.includes(option)
      ? preferences.vibe.filter(item => item !== option)
      : [...preferences.vibe, option];
    
    const newPreferences = { ...preferences, vibe: newVibe };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleBudgetChange = (budget: 'budget' | 'mid-range' | 'luxury') => {
    const newPreferences = { ...preferences, budget };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  const handleTimeChange = (timePreference: 'early-riser' | 'night-owl' | 'flexible') => {
    const newPreferences = { ...preferences, timePreference };
    setPreferences(newPreferences);
    onPreferencesChange(newPreferences);
  };

  if (!isPlus) {
    return (
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
          <div className="text-center">
            <Crown size={48} className="text-glass-orange mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Trips Plus Exclusive</h3>
            <p className="text-gray-300 mb-4">Set group preferences to get personalized AI recommendations</p>
            <button className="bg-gradient-to-r from-glass-orange to-glass-yellow text-white px-6 py-3 rounded-xl font-medium hover:scale-105 transition-transform">
              Upgrade to Trips Plus
            </button>
          </div>
        </div>
        
        <div className="opacity-30">
          <div className="flex items-center gap-3 mb-6">
            <Settings size={24} className="text-glass-orange" />
            <h3 className="text-lg font-semibold text-white">Trip Preferences</h3>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-white font-medium mb-3">Dietary Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.slice(0, 6).map((option) => (
                  <span key={option} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">
                    {option}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-glass-orange/30 to-glass-yellow/30 p-2 rounded-xl">
          <Sparkles size={20} className="text-glass-orange" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Trip Preferences</h3>
          <p className="text-gray-400 text-sm">Help our AI make better recommendations</p>
        </div>
        <div className="ml-auto">
          <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 px-3 py-1 rounded-full">
            <span className="text-glass-orange text-sm font-medium">PLUS</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Dietary Preferences */}
        <div>
          <h4 className="text-white font-medium mb-3">Dietary Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleDietaryChange(option)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  preferences.dietary.includes(option)
                    ? 'bg-glass-orange text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Preferences */}
        <div>
          <h4 className="text-white font-medium mb-3">Vibe & Activities</h4>
          <div className="flex flex-wrap gap-2">
            {VIBE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => handleVibeChange(option)}
                className={`px-3 py-2 rounded-full text-sm transition-colors ${
                  preferences.vibe.includes(option)
                    ? 'bg-glass-orange text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Preference */}
        <div>
          <h4 className="text-white font-medium mb-3">Budget Range</h4>
          <div className="flex gap-2">
            {['budget', 'mid-range', 'luxury'].map((option) => (
              <button
                key={option}
                onClick={() => handleBudgetChange(option as any)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors capitalize ${
                  preferences.budget === option
                    ? 'bg-glass-orange text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option === 'mid-range' ? 'Mid-Range' : option}
              </button>
            ))}
          </div>
        </div>

        {/* Time Preference */}
        <div>
          <h4 className="text-white font-medium mb-3">Time Preference</h4>
          <div className="flex gap-2">
            {['early-riser', 'night-owl', 'flexible'].map((option) => (
              <button
                key={option}
                onClick={() => handleTimeChange(option as any)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors capitalize ${
                  preferences.timePreference === option
                    ? 'bg-glass-orange text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {option.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

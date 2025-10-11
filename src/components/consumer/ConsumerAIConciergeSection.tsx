import React, { useEffect, useState } from 'react';
import { Sparkles, Crown, Settings } from 'lucide-react';
import { TripPreferences } from '../TripPreferences';
import { TripPreferences as TripPreferencesType } from '../../types/consumer';
import { useConsumerSubscription } from '../../hooks/useConsumerSubscription';
import { useAuth } from '../../hooks/useAuth';
import { userPreferencesService } from '../../services/userPreferencesService';
import { toast } from 'sonner';

export const ConsumerAIConciergeSection = () => {
  const { isPlus, upgradeToPlus } = useConsumerSubscription();
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<TripPreferencesType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && isPlus) {
      loadPreferences();
    } else {
      setIsLoading(false);
    }
  }, [user, isPlus]);

  const loadPreferences = async () => {
    if (!user) return;
    try {
      const prefs = await userPreferencesService.getAIPreferences(user.id);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading AI preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesChange = async (newPrefs: TripPreferencesType) => {
    if (!user) return;
    
    setPreferences(newPrefs);
    
    try {
      const success = await userPreferencesService.setAIPreferences(user.id, newPrefs);
      if (success) {
        toast.success('AI preferences saved');
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving AI preferences:', error);
      toast.error('Failed to save preferences');
    }
  };

  if (!isPlus) {
    return (
      <div className="space-y-6">
        {/* Plus Upgrade Prompt */}
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-8 text-center">
          <Crown size={48} className="text-yellow-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">AI Concierge</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Set your preferences once and get personalized AI recommendations across all your trips. 
            Filter by dietary needs, accessibility requirements, vibe, budget, and more.
          </p>
          <button 
            onClick={upgradeToPlus}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            Upgrade to Plus - $9.99/mo
          </button>
          
          {/* Feature Preview */}
          <div className="mt-8 grid md:grid-cols-3 gap-4 text-left">
            <div className="bg-white/5 p-4 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Smart Filtering</h4>
              <p className="text-gray-400 text-sm">AI automatically filters restaurants, activities, and hotels based on your dietary needs (vegan, gluten-free, etc.)</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Accessibility</h4>
              <p className="text-gray-400 text-sm">Find EV charging, wheelchair access, pet-friendly places - your needs are remembered</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl">
              <h4 className="text-white font-semibold mb-2">Budget Control</h4>
              <p className="text-gray-400 text-sm">Set min/max budget ranges and AI won't suggest places outside your comfort zone</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Sparkles size={24} className="text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">AI Concierge Settings</h2>
          </div>
          <p className="text-gray-400">
            Configure your preferences once - AI uses them across all trips for personalized recommendations
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 rounded-full">
          <span className="text-yellow-400 font-semibold text-sm">PLUS</span>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Settings size={20} />
          How AI Concierge Works
        </h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>✨ Set your preferences below (dietary, vibe, budget, accessibility)</li>
          <li>🤖 AI remembers them across ALL your trips</li>
          <li>🎯 Get personalized suggestions filtered to YOUR needs</li>
          <li>⚡ No need to repeat preferences for each trip</li>
        </ul>
      </div>

      {/* Preferences Component */}
      <TripPreferences 
        tripId="global-user-preferences" 
        onPreferencesChange={handlePreferencesChange}
        initialPreferences={preferences || undefined}
      />

      {/* Active Filters Summary */}
      {preferences && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-4">Active AI Filters</h3>
          <p className="text-gray-400 text-sm mb-4">
            When you ask AI for recommendations, these filters are automatically applied:
          </p>
          <div className="flex flex-wrap gap-2">
            {preferences.dietary.map((item) => (
              <span key={item} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
            {preferences.vibe.map((item) => (
              <span key={item} className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
            {preferences.accessibility.map((item) => (
              <span key={item} className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                {item}
              </span>
            ))}
            {preferences.budgetMin > 0 && (
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                Budget: ${preferences.budgetMin}-${preferences.budgetMax}
              </span>
            )}
            {preferences.timePreference !== 'flexible' && (
              <span className="bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full text-sm capitalize">
                {preferences.timePreference.replace('-', ' ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

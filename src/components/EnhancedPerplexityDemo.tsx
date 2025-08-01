import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Sparkles, Brain, MapPin, Users, DollarSign } from 'lucide-react';
import { PerplexityConciergeService } from '../services/perplexityConciergeService';
import { EnhancedTripContextService } from '../services/enhancedTripContextService';
import { TripContext } from '../types/tripContext';

export const EnhancedPerplexityDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [enhancedContext, setEnhancedContext] = useState<TripContext | null>(null);

  const handleLoadEnhancedContext = async () => {
    setIsLoading(true);
    try {
      // Demo with trip ID 1 (Cancun trip)
      const context = await EnhancedTripContextService.getEnhancedTripContext('1', false);
      setEnhancedContext(context);
      
      // Build the enhanced system prompt
      const systemPrompt = PerplexityConciergeService.buildSystemPrompt(
        context,
        context.basecamp,
        context.preferences
      );
      setCurrentPrompt(systemPrompt);
    } catch (error) {
      console.error('Failed to load enhanced context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextSections = [
    {
      title: 'Trip Basics',
      icon: MapPin,
      items: enhancedContext ? [
        `Destination: ${enhancedContext.location}`,
        `Dates: ${enhancedContext.dateRange}`,
        `Group: ${enhancedContext.participants.length} people`,
        `Accommodation: ${enhancedContext.accommodation}`
      ] : []
    },
    {
      title: 'Group Preferences',
      icon: Users,
      items: enhancedContext?.preferences ? [
        `Dietary: ${enhancedContext.preferences.dietary?.join(', ') || 'None'}`,
        `Vibes: ${enhancedContext.preferences.vibe?.join(', ') || 'Any'}`,
        `Budget: $${enhancedContext.preferences.budgetMin}-${enhancedContext.preferences.budgetMax}`,
        `Time Preference: ${enhancedContext.preferences.timePreference}`
      ] : []
    },
    {
      title: 'Spending Patterns',
      icon: DollarSign,
      items: enhancedContext?.spendingPatterns ? [
        `Total Spent: $${enhancedContext.spendingPatterns.totalSpent.toFixed(2)}`,
        `Per Person Avg: $${enhancedContext.spendingPatterns.avgPerPerson.toFixed(2)}`,
        `Top Categories: ${Object.entries(enhancedContext.spendingPatterns.categories)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 2)
          .map(([cat, amount]) => `${cat} ($${amount})`)
          .join(', ')}`
      ] : []
    },
    {
      title: 'Contextual Data',
      icon: Brain,
      items: enhancedContext ? [
        `Files: ${enhancedContext.files?.length || 0} uploaded`,
        `Photos: ${enhancedContext.photos?.length || 0} shared`,
        `Links: ${enhancedContext.links?.length || 0} saved`,
        `Polls: ${enhancedContext.polls?.length || 0} active`,
        `Visited Places: ${enhancedContext.visitedPlaces?.length || 0}`,
        `Chat Messages: ${enhancedContext.chatHistory?.length || 0} recent`
      ] : []
    }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
          <Sparkles className="text-glass-orange" />
          Enhanced Perplexity Context Demo
        </h2>
        <p className="text-gray-400 mb-6">
          See how the new contextually-aware AI assistant works with your complete trip data
        </p>
        
        <Button 
          onClick={handleLoadEnhancedContext}
          disabled={isLoading}
          className="bg-gradient-to-r from-glass-orange to-glass-yellow text-black"
        >
          {isLoading ? 'Loading Enhanced Context...' : 'Load Enhanced Trip Context'}
        </Button>
      </div>

      {enhancedContext && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contextSections.map((section) => (
            <Card key={section.title} className="bg-white/5 border-white/10 p-6">
              <div className="flex items-center gap-2 mb-4">
                <section.icon className="text-glass-orange" size={20} />
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              </div>
              <div className="space-y-2">
                {section.items.map((item, index) => (
                  <div key={index} className="text-sm text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {currentPrompt && (
        <Card className="bg-white/5 border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-glass-orange" size={20} />
            <h3 className="text-lg font-semibold text-white">Generated System Prompt</h3>
            <Badge className="bg-glass-orange/20 text-glass-orange">
              {currentPrompt.length} characters
            </Badge>
          </div>
          <div className="bg-black/30 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
              {currentPrompt}
            </pre>
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <strong>Key Enhancements:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Group preferences and dietary restrictions</li>
              <li>Spending patterns and budget awareness</li>
              <li>Already visited places (to avoid duplicates)</li>
              <li>Shared files content and AI summaries</li>
              <li>Photo locations and AI tags</li>
              <li>Group polls and voting results</li>
              <li>Recent chat sentiment and mood</li>
              <li>Current basecamp location for proximity</li>
              <li>Weather context and forecasts</li>
            </ul>
          </div>
        </Card>
      )}

      {enhancedContext && (
        <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-500/30 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🎯 What Makes This Contextually Aware?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong className="text-green-400">Personalized Recommendations</strong>
              <p className="text-gray-300 mt-1">
                AI considers group dietary restrictions, budget range, and preferred vibes
              </p>
            </div>
            <div>
              <strong className="text-blue-400">Avoids Repetition</strong>
              <p className="text-gray-300 mt-1">
                Won't suggest places you've already visited or activities you've done
              </p>
            </div>
            <div>
              <strong className="text-purple-400">Location Aware</strong>
              <p className="text-gray-300 mt-1">
                Factors in your current basecamp location for proximity-based suggestions
              </p>
            </div>
            <div>
              <strong className="text-yellow-400">Content Integration</strong>
              <p className="text-gray-300 mt-1">
                References your shared links, photos, and uploaded files in responses
              </p>
            </div>
            <div>
              <strong className="text-red-400">Group Dynamics</strong>
              <p className="text-gray-300 mt-1">
                Understands group consensus level and recent decision patterns
              </p>
            </div>
            <div>
              <strong className="text-indigo-400">Real-time Context</strong>
              <p className="text-gray-300 mt-1">
                Includes current weather, upcoming events, and confirmation numbers
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
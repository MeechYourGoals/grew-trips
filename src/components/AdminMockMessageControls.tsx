import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, MessageSquare, Users, Settings } from 'lucide-react';

interface AdminMockMessageControlsProps {
  className?: string;
}

export function AdminMockMessageControls({ className }: AdminMockMessageControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRegenerateAll = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('seed-mock-messages', {
        body: { refresh: true }
      });
      
      if (error) throw error;
      
      setLastGenerated(new Date().toLocaleString());
      toast({
        title: "Mock Messages Regenerated",
        description: `Successfully generated ${data.count} mock messages across all Pro trips.`,
      });
    } catch (error) {
      console.error('Error regenerating mock messages:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to regenerate mock messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateTrip = async (tripId: string) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('seed-mock-messages', {
        body: { trip_id: tripId, refresh: true }
      });
      
      if (error) throw error;
      
      setLastGenerated(new Date().toLocaleString());
      toast({
        title: "Trip Messages Regenerated",
        description: `Successfully generated ${data.count} mock messages for the selected trip.`,
      });
    } catch (error) {
      console.error('Error regenerating trip messages:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to regenerate trip messages. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const proTrips = [
    { id: 'paul-george-elite-aau-nationals-2025', name: 'Paul George Elite AAU Nationals \'25', category: 'Sports' },
    { id: 'lakers-road-trip', name: 'Lakers Road Trip', category: 'Sports' },
    { id: 'taylor-swift-eras-tour', name: 'Taylor Swift Eras Tour', category: 'Entertainment' },
    { id: 'eli-lilly-c-suite-retreat-2026', name: 'Eli Lilly C-Suite Retreat', category: 'Corporate' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Mock Message Controls
        </CardTitle>
        <CardDescription>
          Regenerate contextual mock messages for Pro trips. Messages are automatically generated when trip data changes.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Regenerate All Pro Trips</h4>
            <p className="text-sm text-muted-foreground">
              Clears and regenerates all mock messages for Pro trips
            </p>
          </div>
          <Button
            onClick={handleRegenerateAll}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Regenerate All
          </Button>
        </div>

        <Separator />

        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Individual Trip Controls
          </h4>
          
          {proTrips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-sm">{trip.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {trip.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => handleRegenerateTrip(trip.id)}
                disabled={isGenerating}
                variant="ghost"
                size="sm"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                Regenerate
              </Button>
            </div>
          ))}
        </div>

        {lastGenerated && (
          <>
            <Separator />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Settings className="h-4 w-4" />
              Last generated: {lastGenerated}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
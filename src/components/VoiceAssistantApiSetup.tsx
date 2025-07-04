import React, { useState } from 'react';
import { Settings, Key, AlertCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const VoiceAssistantApiSetup = () => {
  const [showSetup, setShowSetup] = useState(false);
  const [keys, setKeys] = useState({
    openai: '',
    elevenlabs: ''
  });

  const handleSave = () => {
    // In a real app, this would securely store the keys
    console.log('API keys would be saved securely');
    setShowSetup(false);
  };

  if (!showSetup) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Settings size={20} />
            <div className="text-sm">
              <p className="font-medium">Voice Assistant Setup</p>
              <p>Configure API keys for voice features</p>
            </div>
          </div>
          <Button onClick={() => setShowSetup(true)} variant="outline" size="sm">
            <Key size={16} className="mr-2" />
            Setup
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-card border-border space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Settings size={20} />
        <h3 className="font-semibold">Voice Assistant API Setup</h3>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-foreground mb-1">OpenAI API Key</label>
          <Input
            type="password"
            placeholder="sk-..."
            value={keys.openai}
            onChange={(e) => setKeys(prev => ({ ...prev, openai: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground mt-1">Required for speech-to-text transcription</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-foreground mb-1">ElevenLabs API Key</label>
          <Input
            type="password"
            placeholder="..."
            value={keys.elevenlabs}
            onChange={(e) => setKeys(prev => ({ ...prev, elevenlabs: e.target.value }))}
          />
          <p className="text-xs text-muted-foreground mt-1">Optional for voice responses</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save Configuration
        </Button>
        <Button onClick={() => setShowSetup(false)} variant="outline">
          Cancel
        </Button>
      </div>
      
      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
        <AlertCircle size={16} className="text-muted-foreground mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Privacy Note:</p>
          <p>API keys are stored locally and used only for voice features. Consider using Supabase Edge Functions for production apps.</p>
        </div>
      </div>
    </Card>
  );
};
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiFeatureService } from '@/services/aiFeatures';
import { ScheduledMessageService, ScheduleMessagePayload } from '@/services/scheduledMessageService';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import MessageTemplateLibrary from './MessageTemplateLibrary';
import { Lightbulb, RefreshCw } from 'lucide-react';
// import { useToast } from "@/hooks/use-toast"; // For notifications

// Type for AI time suggestions
interface TimeSuggestion {
  suggested_time_utc: string;
  reasoning: string;
  confidence: string;
}

interface AiMessageComposerProps {
  onMessageGenerated: (message: string) => void;
  onMessageScheduled: (scheduledMessage: any) => void; // Callback after scheduling
  tripId: string;
}

const daysOfWeek = [
  { id: 0, label: 'Sun' }, { id: 1, label: 'Mon' }, { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' }, { id: 4, label: 'Thu' }, { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' }
];

const AiMessageComposer: React.FC<AiMessageComposerProps> = ({ onMessageGenerated, onMessageScheduled, tripId }) => {
  const { user } = useAuth();
  // const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // Scheduling state
  const [scheduleActive, setScheduleActive] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'custom_days' | null>(null);
  const [selectedRecurrenceDays, setSelectedRecurrenceDays] = useState<number[]>([]);

  // State for template library
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedTemplateText, setSelectedTemplateText] = useState<string | undefined>(undefined);

  // State for AI time suggestions
  const [timeSuggestions, setTimeSuggestions] = useState<TimeSuggestion[]>([]);
  const [isSuggestingTime, setIsSuggestingTime] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Helper function to combine date and time into a UTC ISO string
  function combineDateAndTimeUTC(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return localDate.toISOString();
  }

  const handleGenerateMessage = async () => {
    if (!prompt && !selectedTemplateText) {
      // toast({ title: "Prompt or Template needed", description: "Please enter a prompt or select a template.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedMessage('');
    try {
      const response = await AiFeatureService.generateAiMessage(prompt, tone, tripId, selectedTemplateText);
      if (response.success && response.data) {
        setGeneratedMessage(response.data);
        onMessageGenerated(response.data);
      } else {
        throw new Error(response.error || "Failed to generate message");
      }
    } catch (error) {
      console.error("Error generating AI message:", error);
      let errorMessage = "Sorry, I couldn't generate a message right now. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setGeneratedMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log("Send Now clicked. Message:", generatedMessage, "TripID:", tripId, "User:", user?.id);
    // TODO: Implement actual send logic e.g., await ChatService.sendMessage(tripId, generatedMessage, user.id);
    // toast({ title: "Message Sent!", description: "Your message has been sent directly." });
    setGeneratedMessage('');
    setPrompt('');
    setScheduleActive(false);
  };

  const handleScheduleMessage = async () => {
    if (!user || !scheduleDate || !generatedMessage) {
      console.error("Missing user, date, or message for scheduling");
      // toast({ title: "Error", description: "Missing user, date, or message content.", variant: "destructive" });
      return;
    }
    setIsScheduling(true);
    const scheduled_at_utc = combineDateAndTimeUTC(scheduleDate, scheduleTime);
    const payload: ScheduleMessagePayload = {
      trip_id: tripId,
      message_content: generatedMessage,
      tone: tone,
      scheduled_at_utc: scheduled_at_utc,
      recurrence_type: recurrenceType,
      recurrence_details: recurrenceType === 'weekly' && selectedRecurrenceDays.length > 0 ? { days: selectedRecurrenceDays } : undefined,
    };

    try {
      if (!user.id) throw new Error("User ID not found. Cannot schedule message.");
      const { data, error } = await ScheduledMessageService.createScheduledMessage(payload, user.id);
      if (error) throw error;
      console.log('Message scheduled:', data);
      if (data) onMessageScheduled(data);
      // toast({ title: "Message Scheduled!", description: `Will be sent on ${new Date(scheduled_at_utc).toLocaleString()}`});
      setGeneratedMessage('');
      setPrompt('');
      setScheduleActive(false);
      setScheduleDate(new Date());
      setScheduleTime('10:00');
      setRecurrenceType(null);
      setSelectedRecurrenceDays([]);
    } catch (err) {
      console.error('Error scheduling message:', err);
      const errorMessage = err instanceof Error ? err.message : "Could not schedule the message.";
      // toast({ title: "Scheduling Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsScheduling(false);
    }
  };

  const handleTemplateSelected = (templateText: string, suggestedTone?: string) => {
    setPrompt(templateText);
    setSelectedTemplateText(templateText);
    if (suggestedTone) setTone(suggestedTone);
    setShowTemplateLibrary(false);
    // toast({ title: "Template Loaded!", description: "Edit as needed and generate."});
  };

  const handleSuggestTime = async () => {
    if (!generatedMessage) {
      // toast({ title: "Generate a message first", description: "Please generate or type a message to get time suggestions."});
      return;
    }
    setIsSuggestingTime(true);
    setTimeSuggestions([]);
    setSuggestionError(null);
    try {
      const response = await AiFeatureService.suggestSendTime(tripId, generatedMessage.substring(0, 200));
      if (response.success && response.data?.suggestions) {
        setTimeSuggestions(response.data.suggestions);
        if (response.data.suggestions.length === 0 && !response.data.error) {
            setSuggestionError("AI couldn't find specific suggestions, try manual scheduling.");
        } else if (response.data.error) {
            setSuggestionError(response.data.error);
        }
      } else {
        throw new Error(response.error || "Failed to get time suggestions.");
      }
    } catch (err) {
      console.error("Error suggesting time:", err);
      const errorMsg = err instanceof Error ? err.message : "Could not fetch time suggestions.";
      setSuggestionError(errorMsg);
      // toast({ title: "Suggestion Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSuggestingTime(false);
    }
  };

  const applySuggestedTime = (utcTime: string) => {
    const localDate = new Date(utcTime);
    setScheduleDate(localDate);
    setScheduleTime(localDate.toTimeString().substring(0, 5));
    setTimeSuggestions([]);
    // toast({ title: "Time Applied!", description: `Scheduler set to ${localDate.toLocaleString()}`});
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background text-foreground">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Message Composer</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}>
          <Lightbulb className="mr-2 h-4 w-4" /> {showTemplateLibrary ? 'Hide Templates' : 'Use Template'}
        </Button>
      </div>

      {showTemplateLibrary && (
        <MessageTemplateLibrary onTemplateSelect={handleTemplateSelected} />
      )}

      <Textarea
        placeholder="Enter a prompt (e.g., 'Remind team of tomorrow's game and bus time') or select a template."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          if (selectedTemplateText) setSelectedTemplateText(undefined); // Clear template if user types over it
        }}
        rows={3}
      />
      <div className="flex items-center space-x-2">
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Friendly">Friendly ✅</SelectItem>
            <SelectItem value="Direct">Direct 📣</SelectItem>
            <SelectItem value="Informative">Informative ✍️</SelectItem>
            <SelectItem value="Professional">Professional</SelectItem>
            <SelectItem value="Fun">Fun 🎉</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleGenerateMessage} disabled={isLoading || (!prompt && !selectedTemplateText)}>
          {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? 'Generating...' : 'Generate Message'}
        </Button>
      </div>

      {generatedMessage && (
        <div className="mt-4 p-3 bg-muted/40 rounded-md">
          <Label className="font-semibold mb-2 block">Generated Draft:</Label>
          <Textarea
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)}
            rows={5}
            className="border-input"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" onClick={() => setScheduleActive(!scheduleActive)} disabled={isScheduling}>
              {scheduleActive ? 'Cancel Schedule' : 'Send Later'}
            </Button>
            <Button onClick={handleSendMessage} disabled={isScheduling || isLoading || !generatedMessage}>
              Send Now
            </Button>
          </div>

          {scheduleActive && (
            <div className="mt-4 p-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Schedule Options</h4>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSuggestTime}
                    disabled={isSuggestingTime || !generatedMessage}
                    className="text-xs px-2 py-1 h-auto"
                >
                    {isSuggestingTime ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Lightbulb className="mr-1 h-3 w-3" />}
                    Suggest Time
                </Button>
              </div>

              {isSuggestingTime && <p className="text-sm text-muted-foreground">Asking AI for best send times...</p>}
              {suggestionError && <p className="text-sm text-destructive">{suggestionError}</p>}

              {timeSuggestions.length > 0 && (
                <div className="my-3 p-3 bg-primary-foreground border border-border rounded-md space-y-2">
                  <h5 className="text-sm font-semibold text-primary">Suggested Times (Local):</h5>
                  {timeSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-2 border-b border-border last:border-b-0">
                        <Button
                            variant="link"
                            className="text-primary p-0 h-auto text-left hover:underline"
                            onClick={() => applySuggestedTime(suggestion.suggested_time_utc)}
                        >
                           {new Date(suggestion.suggested_time_utc).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-0.5">({suggestion.reasoning} - Confidence: {suggestion.confidence})</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  <Input
                    type="date"
                    id="schedule-date"
                    value={scheduleDate ? scheduleDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setScheduleDate(e.target.valueAsDate ? new Date(e.target.valueAsDate.valueOf() + e.target.valueAsDate.getTimezoneOffset() * 60000) : undefined)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="schedule-time">Time (Your Local)</Label>
                  <Input
                    type="time"
                    id="schedule-time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Recurrence</Label>
                <Select
                  value={recurrenceType || "null"}
                  onValueChange={(value) => setRecurrenceType(value === "null" ? null : value as 'daily' | 'weekly' | 'custom_days')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="One-time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {recurrenceType === 'weekly' && (
                <div>
                  <Label className="mb-1 block">Days of the Week to Send</Label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                    {daysOfWeek.map(day => (
                      <div key={day.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-schedule-${day.id}`} // Unique ID for checkbox
                          checked={selectedRecurrenceDays.includes(day.id)}
                          onCheckedChange={(checked) => {
                            setSelectedRecurrenceDays(prev =>
                              checked ? [...prev, day.id].sort((a,b) => a-b) : prev.filter(d => d !== day.id)
                            );
                          }}
                        />
                        <Label htmlFor={`day-schedule-${day.id}`} className="font-normal">{day.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button
                onClick={handleScheduleMessage}
                disabled={isScheduling || isLoading || !generatedMessage || !scheduleDate || !scheduleTime || (recurrenceType === 'weekly' && selectedRecurrenceDays.length === 0)}
                className="w-full mt-2"
              >
                {isScheduling ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isScheduling ? 'Scheduling...' : 'Confirm & Schedule Message'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiMessageComposer;

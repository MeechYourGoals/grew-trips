import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiFeatureService } from '@/services/aiFeatures';
import { ScheduledMessageService, ScheduleMessagePayload } from '@/services/scheduledMessageService';
import { useAuth } from '@/hooks/useAuth'; // Assuming you have an auth hook
// Mock DatePicker, replace with your actual component
// import { DatePicker } from "@/components/ui/date-picker";
// import { TimePicker } from "@/components/ui/time-picker"; // Assuming a time picker
import { Input } from "@/components/ui/input"; // For time input for now
import { Checkbox } from "@/components/ui/checkbox"; // For recurrence days
import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast"; // For notifications
// Import MessageTemplateLibrary
import MessageTemplateLibrary from './MessageTemplateLibrary'; // Adjust path if needed
import { Lightbulb, RefreshCw } from 'lucide-react'; // For suggest time button icon & loading

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
  // currentUserId: string; // Pass current user ID as prop
}

const daysOfWeek = [
  { id: 0, label: 'Sun' }, { id: 1, label: 'Mon' }, { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' }, { id: 4, label: 'Thu' }, { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' }
];

const AiMessageComposer: React.FC<AiMessageComposerProps> = ({ onMessageGenerated, onMessageScheduled, tripId }) => {
  const { user } = useAuth(); // Get user from auth context
  // const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // Scheduling state
  const [scheduleActive, setScheduleActive] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
  const [scheduleTime, setScheduleTime] = useState('10:00'); // HH:mm format
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'custom_days' | null>(null);
  const [selectedRecurrenceDays, setSelectedRecurrenceDays] = useState<number[]>([]);

  const handleGenerateMessage = async () => {
    if (!prompt) return;
    setIsLoading(true);
    setGeneratedMessage(''); // Clear previous message

    try {
      const response = await AiFeatureService.generateAiMessage(prompt, tone, tripId);
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
      // Handle error display to user, perhaps with a toast notification
      setGeneratedMessage(errorMessage);
      // Optionally, call onMessageGenerated with an error state or empty message
      // onMessageGenerated("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">AI Message Composer</h3>
      <Textarea
        placeholder="Enter a prompt, e.g., 'Remind team of tomorrow's schedule'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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
        <Button onClick={handleGenerateMessage} disabled={isLoading || !prompt}>
          {isLoading ? 'Generating...' : 'Generate Message'}
        </Button>
      </div>
      {generatedMessage && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h4 className="font-semibold mb-2">Generated Draft:</h4>
          <Textarea
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)} // Allow editing
            rows={5}
            className="border-gray-300"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" onClick={() => setScheduleActive(!scheduleActive)} disabled={isScheduling}>
              {scheduleActive ? 'Cancel Schedule' : 'Send Later'}
            </Button>
            <Button onClick={handleSendMessage} disabled={isScheduling || isLoading || !generatedMessage}>
              {isScheduling ? 'Sending...' : 'Send Now'}
            </Button>
          </div>

          {scheduleActive && (
            <div className="mt-4 p-4 border-t space-y-3 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-semibold">Schedule Options</h4>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSuggestTime}
                    disabled={isSuggestingTime || !generatedMessage}
                    className="text-xs"
                >
                    {isSuggestingTime ? <RefreshCw className="mr-1 h-3 w-3 animate-spin" /> : <Lightbulb className="mr-1 h-3 w-3" />}
                    Suggest Time
                </Button>
              </div>

              {isSuggestingTime && <p className="text-sm text-muted-foreground">Asking AI for best send times...</p>}
              {suggestionError && <p className="text-sm text-red-500">{suggestionError}</p>}

              {timeSuggestions.length > 0 && (
                <div className="my-3 p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
                  <h5 className="text-sm font-semibold text-blue-700">Suggested Times (Local):</h5>
                  {timeSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-2 border-b border-blue-100 last:border-b-0">
                        <Button
                            variant="link"
                            className="text-blue-600 p-0 h-auto text-left"
                            onClick={() => applySuggestedTime(suggestion.suggested_time_utc)}
                        >
                           {new Date(suggestion.suggested_time_utc).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </Button>
                        <p className="text-xs text-blue-500 mt-0.5">({suggestion.reasoning} - Confidence: {suggestion.confidence})</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  {/* Replace with actual DatePicker if available */}
                  <Input
                    type="date"
                    id="schedule-date"
                    value={scheduleDate ? scheduleDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setScheduleDate(e.target.valueAsDate ? new Date(e.target.valueAsDate.valueOf() + e.target.valueAsDate.getTimezoneOffset() * 60000) : undefined)}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
                  value={recurrenceType || "null"} // Ensure "null" string for one-time when recurrenceType is null
                  onValueChange={(value) => setRecurrenceType(value === "null" ? null : value as 'daily' | 'weekly' | 'custom_days')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="One-time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    {/* <SelectItem value="custom_days">Custom Days (Future) </SelectItem> */}
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
                          id={`day-${day.id}`}
                          checked={selectedRecurrenceDays.includes(day.id)}
                          onCheckedChange={(checked) => {
                            setSelectedRecurrenceDays(prev =>
                              checked ? [...prev, day.id].sort((a,b) => a-b) : prev.filter(d => d !== day.id)
                            );
                          }}
                        />
                        <Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label>
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
                {isScheduling ? 'Scheduling...' : 'Confirm & Schedule Message'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AiMessageComposer: React.FC<AiMessageComposerProps> = ({ onMessageGenerated, onMessageScheduled, tripId }) => {
  const { user } = useAuth(); // Get user from auth context
  // const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [isLoading, setIsLoading] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');

  // Scheduling state
  const [scheduleActive, setScheduleActive] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(new Date());
  const [scheduleTime, setScheduleTime] = useState('10:00'); // HH:mm format
  const [recurrenceType, setRecurrenceType] = useState<'daily' | 'weekly' | 'custom_days' | null>(null);
  const [selectedRecurrenceDays, setSelectedRecurrenceDays] = useState<number[]>([]);

  // State for AI time suggestions
  const [timeSuggestions, setTimeSuggestions] = useState<TimeSuggestion[]>([]);
  const [isSuggestingTime, setIsSuggestingTime] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);


    // Helper function to combine date and time into a UTC ISO string
  function combineDateAndTimeUTC(date: Date, time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    // Create date in local timezone then convert to UTC
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
    return localDate.toISOString();
  }

  const handleSendMessage = async () => {
    // This function would be responsible for sending the message immediately.
    // For now, it's a placeholder.
    // You'll need to implement the actual send logic, perhaps calling another service.
    console.log("Send Now clicked. Message:", generatedMessage, "TripID:", tripId, "User:", user?.id);
    // Example: await ChatService.sendMessage(tripId, generatedMessage, user.id);
    // toast({ title: "Message Sent!", description: "Your message has been sent directly." });
    setGeneratedMessage(''); // Clear after sending
    setPrompt('');
    setScheduleActive(false);
  };

  const handleScheduleMessage = async () => {
    if (!user || !scheduleDate || !generatedMessage) {
      // toast({ title: "Error", description: "Missing user, date, or message content.", variant: "destructive" });
      console.error("Missing user, date, or message for scheduling");
      return;
    }
    setIsScheduling(true);

    const scheduled_at_utc = combineDateAndTimeUTC(scheduleDate, scheduleTime);

    const payload: ScheduleMessagePayload = {
      trip_id: tripId,
      message_content: generatedMessage,
      tone: tone, // ensure tone is part of the state and updated
      scheduled_at_utc: scheduled_at_utc,
      recurrence_type: recurrenceType,
      recurrence_details: recurrenceType === 'weekly' && selectedRecurrenceDays.length > 0 ? { days: selectedRecurrenceDays } : undefined,
    };

    try {
      // Ensure user.id is available and passed
      if (!user.id) {
        throw new Error("User ID not found. Cannot schedule message.");
      }
      const { data, error } = await ScheduledMessageService.createScheduledMessage(payload, user.id);
      if (error) throw error;
      // toast({ title: "Message Scheduled!", description: `Will be sent on ${new Date(scheduled_at_utc).toLocaleString()}`});
      console.log('Message scheduled:', data);
      if (data) { // Check if data is not null
         onMessageScheduled(data); // Callback prop
      }
      setGeneratedMessage(''); // Clear message
      setPrompt(''); // Clear prompt
      setScheduleActive(false); // Close scheduling UI
      // Reset schedule form
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

  const handleGenerateMessage = async () => {
    if (!prompt && !selectedTemplateText) { // Modified condition
      // toast({ title: "Prompt or Template needed", description: "Please enter a prompt or select a template.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setGeneratedMessage('');

    try {
      // Pass both prompt and template text to the service
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

  // State for template library
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [selectedTemplateText, setSelectedTemplateText] = useState<string | undefined>(undefined);

  const handleTemplateSelected = (templateText: string, suggestedTone?: string) => {
    // When a template is selected, we can either:
    // 1. Directly set it as the "prompt" for the AI to fill (AI needs to understand it's a template).
    // 2. Or, use it as a base and still allow user to add a specific goal/prompt.
    // For now, let's set it in the prompt area, user can then refine or add to it.
    setPrompt(templateText); // Populate the main prompt area with template
    setSelectedTemplateText(templateText); // Keep track of the original template
    if (suggestedTone) {
      setTone(suggestedTone);
    }
    setShowTemplateLibrary(false); // Close library
    // toast({ title: "Template Loaded!", description: "Edit as needed and generate."});
  };

  const handleSuggestTime = async () => {
    if (!generatedMessage) {
      // toast({ title: "Generate a message first", description: "Please generate or type a message to get time suggestions.", variant: "default" });
      console.log("Suggest time: No message content available.");
      return;
    }
    setIsSuggestingTime(true);
    setTimeSuggestions([]);
    setSuggestionError(null);
    try {
      // Using the generatedMessage as the "messagePurpose" for now.
      // Could also use the initial 'prompt' if that's more suitable, or a combination.
      const response = await AiFeatureService.suggestSendTime(tripId, generatedMessage.substring(0, 200)); // Pass a snippet as purpose

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
    setScheduleTime(localDate.toTimeString().substring(0, 5)); // HH:MM format
    setTimeSuggestions([]); // Clear suggestions after applying
    // toast({ title: "Time Applied!", description: `Scheduler set to ${localDate.toLocaleString()}`});
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">AI Message Composer</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowTemplateLibrary(!showTemplateLibrary)}>
          {showTemplateLibrary ? 'Hide Templates' : 'Show Templates'}
        </Button>
      </div>

      {showTemplateLibrary && (
        <MessageTemplateLibrary onTemplateSelect={handleTemplateSelected} />
      )}

      <Textarea
        placeholder="Enter a prompt, e.g., 'Remind team of tomorrow's schedule'"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
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
        <Button onClick={handleGenerateMessage} disabled={isLoading || !prompt}>
          {isLoading ? 'Generating...' : 'Generate Message'}
        </Button>
      </div>
      {generatedMessage && (
        <div className="mt-4 p-3 bg-gray-100 rounded-md">
          <h4 className="font-semibold mb-2">Generated Draft:</h4>
          <Textarea
            value={generatedMessage}
            onChange={(e) => setGeneratedMessage(e.target.value)} // Allow editing
            rows={5}
            className="border-gray-300"
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" onClick={() => setScheduleActive(!scheduleActive)} disabled={isScheduling}>
              {scheduleActive ? 'Cancel Schedule' : 'Send Later'}
            </Button>
            <Button onClick={handleSendMessage} disabled={isScheduling || isLoading || !generatedMessage}>
              {isScheduling ? 'Sending...' : 'Send Now'}
            </Button>
          </div>

          {scheduleActive && (
            <div className="mt-4 p-4 border-t space-y-3 bg-gray-50 rounded-md">
              <h4 className="text-md font-semibold">Schedule Options</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="schedule-date">Date</Label>
                  {/* Replace with actual DatePicker if available */}
                  <Input
                    type="date"
                    id="schedule-date"
                    value={scheduleDate ? scheduleDate.toISOString().split('T')[0] : ''}
                    onChange={(e) => setScheduleDate(e.target.valueAsDate ? new Date(e.target.valueAsDate.valueOf() + e.target.valueAsDate.getTimezoneOffset() * 60000) : undefined)}
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
                  value={recurrenceType || "null"} // Ensure "null" string for one-time when recurrenceType is null
                  onValueChange={(value) => setRecurrenceType(value === "null" ? null : value as 'daily' | 'weekly' | 'custom_days')}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="One-time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">One-time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    {/* <SelectItem value="custom_days">Custom Days (Future) </SelectItem> */}
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
                          id={`day-${day.id}`}
                          checked={selectedRecurrenceDays.includes(day.id)}
                          onCheckedChange={(checked) => {
                            setSelectedRecurrenceDays(prev =>
                              checked ? [...prev, day.id].sort((a,b) => a-b) : prev.filter(d => d !== day.id)
                            );
                          }}
                        />
                        <Label htmlFor={`day-${day.id}`} className="font-normal">{day.label}</Label>
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

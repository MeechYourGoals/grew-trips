import React, { useState, useEffect } from 'react';
import { ScheduledMessage, ScheduledMessageService, ScheduleMessagePayload } from '@/services/scheduledMessageService'; // Assuming payload type is reusable or similar
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface EditScheduledMessageModalProps {
  message: ScheduledMessage | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void; // Callback after successful save
}

const daysOfWeek = [
  { id: 0, label: 'Sun' }, { id: 1, label: 'Mon' }, { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' }, { id: 4, label: 'Thu' }, { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' }
];

const EditScheduledMessageModal: React.FC<EditScheduledMessageModalProps> = ({ message, isOpen, onClose, onSaved }) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [content, setContent] = useState('');
  const [scheduleDate, setScheduleDate] = useState(''); // Store as YYYY-MM-DD string
  const [scheduleTime, setScheduleTime] = useState(''); // Store as HH:mm string
  const [recurrenceType, setRecurrenceType] = useState<ScheduledMessage['recurrence_type']>(null);
  const [selectedRecurrenceDays, setSelectedRecurrenceDays] = useState<number[]>([]);
  const [status, setStatus] = useState<ScheduledMessage['status']>('pending');


  useEffect(() => {
    if (message) {
      setContent(message.message_content);
      setStatus(message.status || 'pending');

      // Parse scheduled_at_utc into date and time parts (local to user for editing)
      if (message.scheduled_at_utc) {
        const localDate = new Date(message.scheduled_at_utc);
        setScheduleDate(localDate.toISOString().split('T')[0]);
        setScheduleTime(localDate.toTimeString().substring(0, 5));
      } else {
        // Default if not set, though unlikely for an existing message
        const now = new Date();
        setScheduleDate(now.toISOString().split('T')[0]);
        setScheduleTime(now.toTimeString().substring(0,5));
      }

      setRecurrenceType(message.recurrence_type || null);
      setSelectedRecurrenceDays(message.recurrence_details?.days || []);
    }
  }, [message]);

  const handleSave = async () => {
    if (!message || !message.id) return;
    setIsSaving(true);

    try {
      // Combine date and time back to UTC ISO string for scheduled_at_utc
      const localDateTime = new Date(`${scheduleDate}T${scheduleTime}:00`);
      if (isNaN(localDateTime.getTime())) {
        throw new Error("Invalid date or time format.");
      }
      const scheduled_at_utc = localDateTime.toISOString();

      const updatePayload: Partial<ScheduledMessage> = {
        message_content: content,
        scheduled_at_utc: scheduled_at_utc,
        recurrence_type: recurrenceType,
        recurrence_details: recurrenceType === 'weekly' ? { days: selectedRecurrenceDays.sort((a,b)=>a-b) } : null,
        status: status, // Allow status change, e.g., re-activating a cancelled one
        // next_send_at_utc will be updated by the service/trigger if scheduled_at_utc changes
      };

      // If status is pending and recurrence is active, next_send_at_utc should be the same as scheduled_at_utc
      if (status === 'pending') {
        updatePayload.next_send_at_utc = scheduled_at_utc;
      } else if (status !== 'pending' && message.status === 'pending') {
        // If changing from pending to something else, clear next_send_at_utc
        updatePayload.next_send_at_utc = null;
      }


      const { data, error } = await ScheduledMessageService.updateScheduledMessage(message.id, updatePayload);

      if (error) throw error;

      toast({ title: "Success", description: "Scheduled message updated." });
      onSaved(); // Trigger refresh on the dashboard
      onClose();
    } catch (err: any) {
      console.error("Error updating scheduled message:", err);
      toast({ title: "Error", description: err.message || "Failed to update message.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Scheduled Message</DialogTitle>
          <DialogDescription>
            Modify the details of the scheduled message. ID: {message.id?.substring(0,8)}...
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="msg-content" className="text-right col-span-1">Content</Label>
            <Textarea id="msg-content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" rows={4} />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="msg-date" className="text-right col-span-1">Date</Label>
            <Input id="msg-date" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="msg-time" className="text-right col-span-1">Time (Local)</Label>
            <Input id="msg-time" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="msg-status" className="text-right col-span-1">Status</Label>
            <Select value={status || 'pending'} onValueChange={(val) => setStatus(val as ScheduledMessage['status'])}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="sent">Sent (will resend if recurring & pending)</SelectItem>
                    <SelectItem value="completed">Completed (stops recurrence)</SelectItem>
                    <SelectItem value="failed">Failed (manual review needed)</SelectItem>
                </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="msg-recurrence" className="text-right col-span-1">Recurrence</Label>
            <Select value={recurrenceType || "null"} onValueChange={(value) => setRecurrenceType(value === "null" ? null : value as any)}>
              <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right col-span-1 pt-2">Days</Label>
              <div className="col-span-3 space-y-2">
                {daysOfWeek.map(day => (
                  <div key={day.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-edit-${day.id}`}
                      checked={selectedRecurrenceDays.includes(day.id)}
                      onCheckedChange={(checked) => {
                        setSelectedRecurrenceDays(prev =>
                          checked ? [...prev, day.id] : prev.filter(d => d !== day.id)
                        );
                      }}
                    />
                    <Label htmlFor={`day-edit-${day.id}`} className="font-normal">{day.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditScheduledMessageModal;

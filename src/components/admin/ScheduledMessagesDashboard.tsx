import React, { useEffect, useState } from 'react';
import { ScheduledMessageService, ScheduledMessage } from '@/services/scheduledMessageService';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast"; // For notifications
import { Edit3, Trash2, Ban, PlayCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react'; // Icons
import EditScheduledMessageModal from './EditScheduledMessageModal'; // Uncommented

interface ScheduledMessagesDashboardProps {
  tripId?: string; // Make tripId optional; if not provided, fetch all or provide a selector
}

const ScheduledMessagesDashboard: React.FC<ScheduledMessagesDashboardProps> = ({ tripId }) => {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<ScheduledMessage | null>(null); // Uncommented
  const { toast } = useToast();

  const fetchMessages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: If tripId is not provided, implement logic to fetch all messages
      // or messages for a selected trip from a dropdown.
      // For now, if no tripId, it will fetch nothing or error if service expects it.
      // Let's assume getScheduledMessagesForTrip can handle a null/undefined tripId for "all" if we modify service,
      // or we add a new service method like ScheduledMessageService.getAllScheduledMessages().
      // For this example, we'll stick to tripId being potentially provided.
      if (tripId) {
        const response = await ScheduledMessageService.getScheduledMessagesForTrip(tripId);
        if (response.error) throw response.error;
        setMessages(response.data || []);
      } else {
        // Placeholder: Fetch all messages or implement a trip selector
        // const response = await ScheduledMessageService.getAllScheduledMessages(); // Imaginary method
        // if (response.error) throw response.error;
        // setMessages(response.data || []);
        toast({ title: "Info", description: "Trip ID not provided. Displaying all messages would go here, or select a trip.", variant: "default" });
        setMessages([]); // Default to empty if no tripId and no global fetch yet
      }
    } catch (err: any) {
      console.error("Error fetching scheduled messages:", err);
      const errorMessage = err.message || "Failed to fetch scheduled messages.";
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [tripId]); // Refetch if tripId changes

  const handleEdit = (message: ScheduledMessage) => {
    setEditingMessage(message);
  };

  const handleCancel = async (messageId: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled message?")) return;
    try {
      const { error } = await ScheduledMessageService.cancelScheduledMessage(messageId);
      if (error) throw error;
      toast({ title: "Success", description: "Message cancelled.", variant: "default" });
      fetchMessages(); // Refresh list
    } catch (err: any) {
      console.error("Error cancelling message:", err);
      toast({ title: "Error", description: err.message || "Failed to cancel message.", variant: "destructive" });
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY DELETE this scheduled message? This cannot be undone.")) return;
    try {
      const { error } = await ScheduledMessageService.deleteScheduledMessage(messageId);
      if (error) throw error;
      toast({ title: "Success", description: "Message deleted permanently.", variant: "default" });
      fetchMessages(); // Refresh list
    } catch (err: any) {
      console.error("Error deleting message:", err);
      toast({ title: "Error", description: err.message || "Failed to delete message.", variant: "destructive" });
    }
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getStatusBadge = (status?: string | null) => {
    switch (status) {
      case 'pending': return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600"><PlayCircle className="mr-1 h-3 w-3" />Pending</Badge>;
      case 'sent': return <Badge variant="default" className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="mr-1 h-3 w-3" />Sent</Badge>;
      case 'completed': return <Badge variant="secondary"><CheckCircle2 className="mr-1 h-3 w-3" />Completed</Badge>;
      case 'cancelled': return <Badge variant="outline"><Ban className="mr-1 h-3 w-3" />Cancelled</Badge>;
      case 'failed': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Failed</Badge>;
      default: return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><RefreshCw className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading messages...</span></div>;
  if (error && !tripId) return <div className="text-red-500">Error: {error}. Please select a trip if applicable.</div>;
  if (error && tripId) return <div className="text-red-500">Error loading messages for trip {tripId}: {error}</div>;


  return (
    <div className="space-y-6">
      <div>
        {/* TODO: Add filters for status, date range, etc. */}
        {/* TODO: If no tripId is passed, add a TripSelector component here */}
        <Button onClick={fetchMessages} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Messages
        </Button>
      </div>

      {messages.length === 0 && !isLoading && (
        <p className="text-center text-muted-foreground py-8">
          No scheduled messages found{tripId ? ` for trip ${tripId}` : ''}.
        </p>
      )}

      {messages.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Scheduled At (UTC)</TableHead>
                <TableHead>Next Send (UTC)</TableHead>
                <TableHead>Recurrence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="max-w-xs truncate" title={msg.message_content}>
                    {msg.message_content.substring(0, 70)}{msg.message_content.length > 70 && '...'}
                  </TableCell>
                  <TableCell>{getStatusBadge(msg.status)}</TableCell>
                  <TableCell>{formatDateTime(msg.scheduled_at_utc)}</TableCell>
                  <TableCell>{formatDateTime(msg.next_send_at_utc)}</TableCell>
                  <TableCell>
                    {msg.recurrence_type ? `${msg.recurrence_type}` : 'One-time'}
                    {msg.recurrence_type === 'weekly' && msg.recurrence_details?.days && (
                      <span className="text-xs ml-1">({msg.recurrence_details.days.join(',')})</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(msg)} title="Edit">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    {msg.status === 'pending' && (
                       <Button variant="ghost" size="icon" onClick={() => handleCancel(msg.id!)} title="Cancel Schedule">
                         <Ban className="h-4 w-4 text-orange-500" />
                       </Button>
                    )}
                    {(msg.status === 'cancelled' || msg.status === 'failed' || msg.status === 'completed') && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(msg.id!)} title="Delete Permanently">
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* {editingMessage && (
        <EditScheduledMessageModal
          message={editingMessage}
          isOpen={!!editingMessage}
          onClose={() => setEditingMessage(null)}
          onSaved={() => {
            setEditingMessage(null);
            fetchMessages();
          }}
        />
      )} */}
    </div>
  );
};

export default ScheduledMessagesDashboard;

// Note: The EditScheduledMessageModal is rendered here.
// Its visibility is controlled by the `editingMessage` state.
// When `editingMessage` is not null, the modal should appear.
// The modal itself handles its open/close state based on an `isOpen` prop.
// This is a common pattern for modals.
// The actual rendering of the modal will be added in the return statement of ScheduledMessagesDashboard.
// For example, after the main content div:
// {editingMessage && (
//   <EditScheduledMessageModal
//     message={editingMessage}
//     isOpen={!!editingMessage}
//     onClose={() => setEditingMessage(null)}
//     onSaved={() => {
//       setEditingMessage(null);
//       fetchMessages(); // Refresh the list after saving
//     }}
//   />
// )}
      )}

      {editingMessage && (
        <EditScheduledMessageModal
          message={editingMessage}
          isOpen={!!editingMessage}
          onClose={() => setEditingMessage(null)}
          onSaved={() => {
            setEditingMessage(null);
            fetchMessages(); // Refresh the list after saving
          }}
        />
      )}
    </div>
  );
};

export default ScheduledMessagesDashboard;

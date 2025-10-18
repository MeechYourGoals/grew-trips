import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { 
  MessageSquare, Plus, Trash2, Users, Lock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { ProParticipant } from '../../types/pro';
import { RoleChannel } from '../../services/roleChannelService';
import { useRoleChannels } from '../../hooks/useRoleChannels';
import { useToast } from '../../hooks/use-toast';

interface RoleChannelManagerProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  roster: ProParticipant[];
  userRole: string;
  existingRoles: string[];
}

export const RoleChannelManager = ({
  isOpen,
  onClose,
  tripId,
  roster,
  userRole,
  existingRoles
}: RoleChannelManagerProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { toast } = useToast();
  const {
    availableChannels,
    createChannel,
    deleteChannel,
    isLoading,
    refreshChannels
  } = useRoleChannels(tripId, userRole);

  const isAdmin = userRole === 'admin' || userRole === 'organizer';

  const handleCreateChannel = async () => {
    if (!selectedRole) {
      toast({
        title: 'Select a role',
        description: 'Please select a role to create a channel for',
        variant: 'destructive'
      });
      return;
    }

    // Check if channel already exists
    if (availableChannels.some(ch => ch.roleName === selectedRole)) {
      toast({
        title: 'Channel already exists',
        description: `A channel for ${selectedRole} already exists`,
        variant: 'destructive'
      });
      return;
    }

    const success = await createChannel(selectedRole);
    if (success) {
      toast({
        title: 'Channel created',
        description: `Private channel for ${selectedRole} has been created`
      });
      setSelectedRole('');
    } else {
      toast({
        title: 'Failed to create channel',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteChannel = async (channel: RoleChannel) => {
    if (!confirm(`Delete #${channel.roleName.toLowerCase().replace(/\s+/g, '-')} channel? All messages will be lost.`)) {
      return;
    }

    const success = await deleteChannel(channel.id);
    if (success) {
      toast({
        title: 'Channel deleted',
        description: `The ${channel.roleName} channel has been removed`
      });
    } else {
      toast({
        title: 'Failed to delete channel',
        variant: 'destructive'
      });
    }
  };

  // Get roles that can have channels (3+ members)
  const eligibleRoles = existingRoles.filter(role => {
    const memberCount = roster.filter(m => m.role === role).length;
    return memberCount >= 3;
  });

  // Get suggested channels (roles with 5+ members but no channel yet)
  const suggestedChannels = eligibleRoles.filter(role => {
    const memberCount = roster.filter(m => m.role === role).length;
    const hasChannel = availableChannels.some(ch => ch.roleName === role);
    return memberCount >= 5 && !hasChannel;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Role Channels Manager
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              Create private channels for specific roles to keep focused discussions separate from the main trip chat. 
              Only members with the assigned role can see and participate in these channels.
            </p>
          </div>

          {/* Suggested Channels */}
          {suggestedChannels.length > 0 && isAdmin && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-400" />
                Suggested Channels
              </Label>
              <div className="space-y-2">
                {suggestedChannels.map(role => {
                  const memberCount = roster.filter(m => m.role === role).length;
                  return (
                    <div
                      key={role}
                      className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-white">#{role.toLowerCase().replace(/\s+/g, '-')}</p>
                        <p className="text-sm text-gray-400">{memberCount} members</p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedRole(role);
                          handleCreateChannel();
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus size={14} className="mr-1" />
                        Create
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Channels */}
          <div className="space-y-3">
            <Label>Active Channels ({availableChannels.length})</Label>
            {availableChannels.length > 0 ? (
              <div className="space-y-2">
                {availableChannels.map(channel => {
                  const memberCount = roster.filter(m => m.role === channel.roleName).length;
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-3 bg-white/5 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Lock size={16} className="text-purple-400" />
                        <div>
                          <p className="font-medium">#{channel.roleName.toLowerCase().replace(/\s+/g, '-')}</p>
                          <p className="text-sm text-gray-400">{memberCount} members</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Button
                          onClick={() => handleDeleteChannel(channel)}
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white/5 rounded-lg border border-gray-700">
                <MessageSquare size={48} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">No role channels created yet</p>
              </div>
            )}
          </div>

          {/* Create New Channel */}
          {isAdmin && (
            <div className="space-y-3 border-t border-gray-700 pt-6">
              <Label>Create New Channel</Label>
              <div className="flex gap-2">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">Select a role...</option>
                  {eligibleRoles.map(role => {
                    const memberCount = roster.filter(m => m.role === role).length;
                    const hasChannel = availableChannels.some(ch => ch.roleName === role);
                    return (
                      <option key={role} value={role} disabled={hasChannel}>
                        {role} ({memberCount} members) {hasChannel ? '- Channel exists' : ''}
                      </option>
                    );
                  })}
                </select>
                <Button
                  onClick={handleCreateChannel}
                  disabled={!selectedRole || isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus size={16} className="mr-2" />
                  Create Channel
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Channels require at least 3 members with the same role
              </p>
            </div>
          )}

          {/* Info */}
          <div className="bg-white/5 border border-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">How it works:</p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Main trip chat remains for everyone (default)</li>
              <li>• Role channels are private - only visible to members with that role</li>
              <li>• Switch between channels using the dropdown in chat</li>
              <li>• Channels auto-delete when role has less than 2 members</li>
              <li>• Perfect for sensitive discussions (e.g., security team, medical staff)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


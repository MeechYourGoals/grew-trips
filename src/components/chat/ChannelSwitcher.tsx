import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { Hash, Lock, Users, MessageSquare } from 'lucide-react';
import { RoleChannel } from '../../services/roleChannelService';

interface ChannelSwitcherProps {
  activeChannel: 'main' | string; // 'main' or channel ID
  roleChannels: RoleChannel[];
  onChannelChange: (channelId: 'main' | string) => void;
  className?: string;
}

export const ChannelSwitcher = ({
  activeChannel,
  roleChannels,
  onChannelChange,
  className
}: ChannelSwitcherProps) => {
  return (
    <Select value={activeChannel} onValueChange={onChannelChange}>
      <SelectTrigger className={`bg-gray-800 border-gray-700 ${className}`}>
        <SelectValue>
          {activeChannel === 'main' ? (
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" />
              <span>Main Trip Chat</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Lock size={16} className="text-purple-400" />
              <span>
                #{roleChannels.find(ch => ch.id === activeChannel)?.roleName.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-gray-800 border-gray-700">
        {/* Main Chat */}
        <SelectItem value="main" className="text-white hover:bg-gray-700">
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            <span>Main Trip Chat</span>
            <Users size={14} className="text-gray-500 ml-auto" />
          </div>
        </SelectItem>

        {/* Role Channels */}
        {roleChannels.length > 0 && (
          <>
            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
              ROLE CHANNELS
            </div>
            {roleChannels.map(channel => (
              <SelectItem key={channel.id} value={channel.id} className="text-white hover:bg-gray-700">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-purple-400" />
                  <span>#{channel.roleName.toLowerCase().replace(/\s+/g, '-')}</span>
                  <span className="text-xs text-gray-500 ml-auto">
                    Private
                  </span>
                </div>
              </SelectItem>
            ))}
          </>
        )}
      </SelectContent>
    </Select>
  );
};


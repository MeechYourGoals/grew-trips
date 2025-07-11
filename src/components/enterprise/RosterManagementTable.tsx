import React, { useState } from 'react';
import { 
  User, Settings, Mail, Phone, Check, X, Clock, 
  MoreHorizontal, Trash2, Edit, Send, Filter 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../ui/select';
import { RosterMember } from '../../types/enterprise';

interface RosterManagementTableProps {
  members: RosterMember[];
  selectedMembers: string[];
  onMemberSelect: (memberId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onEditMember: (member: RosterMember) => void;
  onDeleteMember: (memberId: string) => void;
  onResendInvite: (memberId: string) => void;
}

const getStatusBadge = (status: RosterMember['status']) => {
  const statusConfig = {
    invited: { color: 'bg-blue-500/20 text-blue-400', icon: Clock },
    pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: Clock },
    active: { color: 'bg-green-500/20 text-green-400', icon: Check },
    declined: { color: 'bg-red-500/20 text-red-400', icon: X }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <Badge className={`${config.color} border-0`}>
      <Icon size={12} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const RosterManagementTable = ({
  members,
  selectedMembers,
  onMemberSelect,
  onSelectAll,
  onEditMember,
  onDeleteMember,
  onResendInvite
}: RosterManagementTableProps) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  const filteredMembers = members.filter(member => {
    if (filterStatus !== 'all' && member.status !== filterStatus) return false;
    if (filterRole !== 'all' && member.role !== filterRole) return false;
    return true;
  });

  const uniqueRoles = Array.from(new Set(members.map(m => m.role)));
  const allSelected = filteredMembers.length > 0 && 
    filteredMembers.every(member => selectedMembers.includes(member.id));

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="invited">Invited</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {uniqueRoles.map(role => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedMembers.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">
              {selectedMembers.length} selected
            </span>
            <Button size="sm" variant="outline">
              <Send size={14} className="mr-1" />
              Batch Invite
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={onSelectAll}
                  />
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Member</th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Role</th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Contact</th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Status</th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Invited</th>
                <th className="p-4 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={(checked) => onMemberSelect(member.id, checked as boolean)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{member.name}</div>
                        <div className="text-sm text-gray-400">
                          {member.joinedAt ? 
                            `Joined ${new Date(member.joinedAt).toLocaleDateString()}` : 
                            'Not joined'
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-white">{member.role}</span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      {member.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail size={14} />
                          {member.email}
                        </div>
                      )}
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone size={14} />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(member.status)}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-400">
                      {member.invitedAt ? 
                        new Date(member.invitedAt).toLocaleDateString() : 
                        'Not invited'
                      }
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditMember(member)}>
                          <Edit size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {(member.status === 'invited' || member.status === 'declined') && (
                          <DropdownMenuItem onClick={() => onResendInvite(member.id)}>
                            <Send size={14} className="mr-2" />
                            Resend Invite
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDeleteMember(member.id)}
                          className="text-red-400"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMembers.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            No members found matching the current filters.
          </div>
        )}
      </div>
    </div>
  );
};
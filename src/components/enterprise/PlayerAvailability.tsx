import React, { useState } from 'react';
import { User, UserCheck, UserX, Plane, PlaneTakeoff, AlertTriangle } from 'lucide-react';
import { SmartImport } from '../SmartImport';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface PlayerAvailabilityProps {
  tripCategory?: string;
}

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  position: string;
  number?: number;
  status: 'active' | 'injured-reserve' | 'inactive';
  traveling: boolean;
  lastUpdated: string;
}

export const PlayerAvailability = ({ tripCategory }: PlayerAvailabilityProps) => {
  const [players, setPlayers] = useState<Player[]>([
    {
      id: '1',
      firstName: 'Marcus',
      lastName: 'Johnson',
      position: 'Point Guard',
      number: 23,
      status: 'active',
      traveling: true,
      lastUpdated: '2025-01-13'
    },
    {
      id: '2',
      firstName: 'Tyler',
      lastName: 'Anderson',
      position: 'Center',
      number: 42,
      status: 'injured-reserve',
      traveling: false,
      lastUpdated: '2025-01-12'
    },
    {
      id: '3',
      firstName: 'Jordan',
      lastName: 'Williams',
      position: 'Forward',
      number: 15,
      status: 'active',
      traveling: true,
      lastUpdated: '2025-01-13'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('all');

  const parseConfig = {
    targetType: 'roster' as const,
    expectedFields: ['firstName', 'lastName', 'position', 'number', 'status', 'traveling'],
    description: 'Import player availability status from roster documents or injury reports. No medical data is stored - only availability status and travel eligibility.'
  };

  const handleDataImported = (importedData: any[]) => {
    const newPlayers: Player[] = importedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      firstName: item.first_name || item.firstName || item.name?.split(' ')[0] || 'Unknown',
      lastName: item.last_name || item.lastName || item.name?.split(' ').slice(1).join(' ') || 'Player',
      position: item.position || 'Unknown',
      number: item.number || item.jersey_number,
      status: normalizeStatus(item.status || item.availability || 'active'),
      traveling: item.traveling !== false, // Default to true unless explicitly false
      lastUpdated: new Date().toISOString().split('T')[0]
    }));

    setPlayers(prev => [...prev, ...newPlayers]);
  };

  const normalizeStatus = (status: string): 'active' | 'injured-reserve' | 'inactive' => {
    const lower = status.toLowerCase();
    if (lower.includes('injur') || lower.includes('reserve') || lower.includes('ir')) {
      return 'injured-reserve';
    }
    if (lower.includes('inactive') || lower.includes('out') || lower.includes('suspended')) {
      return 'inactive';
    }
    return 'active';
  };

  const updatePlayerStatus = (playerId: string, status: 'active' | 'injured-reserve' | 'inactive') => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, status, lastUpdated: new Date().toISOString().split('T')[0] }
        : player
    ));
  };

  const updatePlayerTravel = (playerId: string, traveling: boolean) => {
    setPlayers(prev => prev.map(player => 
      player.id === playerId 
        ? { ...player, traveling, lastUpdated: new Date().toISOString().split('T')[0] }
        : player
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="w-4 h-4 text-green-400" />;
      case 'injured-reserve': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'inactive': return <UserX className="w-4 h-4 text-red-400" />;
      default: return <User className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'injured-reserve': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'inactive': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const filteredPlayers = players.filter(player => 
    filterStatus === 'all' || player.status === filterStatus
  );

  const stats = {
    total: players.length,
    active: players.filter(p => p.status === 'active').length,
    injuredReserve: players.filter(p => p.status === 'injured-reserve').length,
    traveling: players.filter(p => p.traveling).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Player Availability</h3>
        <p className="text-gray-400">
          Track player status and travel eligibility. Medical information is not stored - 
          only availability status and whether players are traveling with the team.
        </p>
      </div>

      {/* Import Component */}
      <SmartImport
        targetCollection="roster_members"
        parseConfig={parseConfig}
        onDataImported={handleDataImported}
        className="mb-6"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Total Players</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">Active</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{stats.active}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-400">Injured Reserve</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{stats.injuredReserve}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-400">Traveling</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{stats.traveling}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 bg-gray-800/50 border-gray-600 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="all" className="text-white">All Players</SelectItem>
            <SelectItem value="active" className="text-white">Active Only</SelectItem>
            <SelectItem value="injured-reserve" className="text-white">Injured Reserve</SelectItem>
            <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Player List */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Player Status ({filteredPlayers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredPlayers.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(player.status)}
                    <div>
                      <div className="font-medium text-white">
                        {player.firstName} {player.lastName}
                        {player.number && (
                          <span className="ml-2 text-sm text-gray-400">#{player.number}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">{player.position}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <Badge className={`border ${getStatusColor(player.status)}`}>
                    {player.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>

                  {/* Traveling Status */}
                  <div className="flex items-center gap-2">
                    {player.traveling ? (
                      <div className="flex items-center gap-1 text-blue-400">
                        <PlaneTakeoff className="w-4 h-4" />
                        <span className="text-sm">Traveling</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400">
                        <Plane className="w-4 h-4" />
                        <span className="text-sm">Not Traveling</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2">
                    <Select
                      value={player.status}
                      onValueChange={(value: 'active' | 'injured-reserve' | 'inactive') => 
                        updatePlayerStatus(player.id, value)
                      }
                    >
                      <SelectTrigger className="w-32 h-8 bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="active" className="text-white">Active</SelectItem>
                        <SelectItem value="injured-reserve" className="text-white">Injured Reserve</SelectItem>
                        <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updatePlayerTravel(player.id, !player.traveling)}
                      className="h-8 border-gray-600 text-white hover:bg-white/10"
                    >
                      {player.traveling ? 'Remove from Travel' : 'Add to Travel'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPlayers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No players found matching the current filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState } from 'react';
import { X, Plus, Users, Bed, MapPin, Calendar } from 'lucide-react';
import { RoomAssignment, ProParticipant } from '../../types/pro-features';

interface RoomAssignmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomAssignments: RoomAssignment[];
  roster: ProParticipant[];
  onUpdateAssignments: (assignments: RoomAssignment[]) => void;
}

export const RoomAssignmentsModal = ({ isOpen, onClose, roomAssignments, roster, onUpdateAssignments }: RoomAssignmentsModalProps) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedOccupants, setSelectedOccupants] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddRoom = () => {
    if (newRoomName.trim() !== '') {
      const newRoom: RoomAssignment = {
        id: Math.random().toString(36).substring(2, 9),
        room: newRoomName,
        hotel: 'TBD',
        occupants: [],
        checkIn: 'TBD',
        checkOut: 'TBD',
        roomType: 'double'
      };
      onUpdateAssignments([...roomAssignments, newRoom]);
      setNewRoomName('');
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId);
    const room = roomAssignments.find(r => r.id === roomId);
    setSelectedOccupants(room ? room.occupants : []);
  };

  const handleOccupantSelect = (participantId: string) => {
    if (selectedOccupants.includes(participantId)) {
      setSelectedOccupants(selectedOccupants.filter(id => id !== participantId));
    } else {
      setSelectedOccupants([...selectedOccupants, participantId]);
    }
  };

  const handleSaveAssignments = () => {
    if (selectedRoom) {
      const updatedAssignments = roomAssignments.map(room =>
        room.id === selectedRoom ? { ...room, occupants: selectedOccupants } : room
      );
      onUpdateAssignments(updatedAssignments);
      setSelectedRoom(null);
      setSelectedOccupants([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 max-w-4xl w-full mx-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Room Assignments</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Room List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Rooms</h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="New room name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 w-full"
                />
                <button
                  onClick={handleAddRoom}
                  className="bg-green-500 hover:bg-green-600 text-white rounded-xl px-4 py-2"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {roomAssignments.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                      selectedRoom === room.id
                        ? 'bg-glass-orange/20 text-glass-orange border border-glass-orange/30'
                        : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Bed size={16} className="text-gray-400" />
                      <span className="font-medium">{room.room}</span>
                    </div>
                    <Users size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Occupant List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Occupants</h3>
              <div className="max-h-96 overflow-y-auto">
                {roster.map((participant) => (
                  <button
                    key={participant.id}
                    onClick={() => handleOccupantSelect(participant.id)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                      selectedOccupants.includes(participant.id)
                        ? 'bg-glass-orange/20 text-glass-orange border border-glass-orange/30'
                        : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <img src={participant.avatar} alt={participant.name} className="w-8 h-8 rounded-full" />
                    <span className="font-medium">{participant.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          {selectedRoom && (
            <div className="mt-6">
              <button
                onClick={handleSaveAssignments}
                className="bg-glass-orange hover:bg-glass-orange/80 text-white px-6 py-3 rounded-xl transition-colors font-medium w-full"
              >
                Save Assignments
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

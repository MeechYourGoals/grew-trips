import React, { useState } from 'react';
import { Plane, Car, Train, Hotel, Plus, MapPin, Calendar } from 'lucide-react';
import { Transportation, Accommodation } from '../types/pro-features';

interface TransportationAccommodationsProps {
  transportations: Transportation[];
  accommodations: Accommodation[];
  onAddTransportation: (transportation: Transportation) => void;
  onAddAccommodation: (accommodation: Accommodation) => void;
}

export const TransportationAccommodations = ({
  transportations,
  accommodations,
  onAddTransportation,
  onAddAccommodation
}: TransportationAccommodationsProps) => {
  const [newTransportation, setNewTransportation] = useState<Transportation>({
    type: 'flight',
    details: '',
    confirmationNumber: '',
    dateTime: '',
    isPrivate: false,
    allowedRoles: []
  });

  const [newAccommodation, setNewAccommodation] = useState<Accommodation>({
    type: 'hotel',
    name: '',
    address: '',
    confirmationNumber: '',
    checkIn: '',
    checkOut: '',
    isPrivate: false,
    allowedRoles: []
  });

  const handleTransportationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewTransportation({ ...newTransportation, [e.target.name]: e.target.value });
  };

  const handleAccommodationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAccommodation({ ...newAccommodation, [e.target.name]: e.target.value });
  };

  const addTransportation = () => {
    onAddTransportation(newTransportation);
    setNewTransportation({
      type: 'flight',
      details: '',
      confirmationNumber: '',
      dateTime: '',
      isPrivate: false,
      allowedRoles: []
    });
  };

  const addAccommodation = () => {
    onAddAccommodation(newAccommodation);
    setNewAccommodation({
      type: 'hotel',
      name: '',
      address: '',
      confirmationNumber: '',
      checkIn: '',
      checkOut: '',
      isPrivate: false,
      allowedRoles: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Transportation */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Transportation</h3>
          <button onClick={addTransportation} className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="type"
            value={newTransportation.type}
            onChange={handleTransportationChange}
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          >
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="bus">Bus</option>
            <option value="car">Car</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            name="details"
            value={newTransportation.details}
            onChange={handleTransportationChange}
            placeholder="Details"
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="text"
            name="confirmationNumber"
            value={newTransportation.confirmationNumber}
            onChange={handleTransportationChange}
            placeholder="Confirmation #"
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="datetime-local"
            name="dateTime"
            value={newTransportation.dateTime}
            onChange={handleTransportationChange}
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          {transportations.map((transport, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              {transport.type === 'flight' && <Plane size={16} className="text-gray-400" />}
              {transport.type === 'car' && <Car size={16} className="text-gray-400" />}
              {transport.type === 'train' && <Train size={16} className="text-gray-400" />}
              <span className="text-white">{transport.details}</span>
              <span className="text-gray-400 text-sm">{transport.dateTime}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Accommodation */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Accommodation</h3>
          <button onClick={addAccommodation} className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={newAccommodation.name}
            onChange={handleAccommodationChange}
            placeholder="Hotel Name"
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="text"
            name="address"
            value={newAccommodation.address}
            onChange={handleAccommodationChange}
            placeholder="Address"
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="text"
            name="confirmationNumber"
            value={newAccommodation.confirmationNumber}
            onChange={handleAccommodationChange}
            placeholder="Confirmation #"
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="date"
            name="checkIn"
            value={newAccommodation.checkIn}
            onChange={handleAccommodationChange}
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
          <input
            type="date"
            name="checkOut"
            value={newAccommodation.checkOut}
            onChange={handleAccommodationChange}
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          {accommodations.map((hotel, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
              <Hotel size={16} className="text-gray-400" />
              <span className="text-white">{hotel.name}</span>
              <span className="text-gray-400 text-sm">
                <MapPin size={12} className="inline-block mr-1" />
                {hotel.address}
              </span>
              <span className="text-gray-400 text-sm">
                <Calendar size={12} className="inline-block mr-1" />
                {hotel.checkIn} - {hotel.checkOut}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

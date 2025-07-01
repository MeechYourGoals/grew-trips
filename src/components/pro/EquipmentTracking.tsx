import React, { useState } from 'react';
import { Package, Plus, Search, Filter, MapPin, AlertTriangle, CheckCircle, Truck } from 'lucide-react';
import { Equipment } from '../../types/pro-features';

interface EquipmentTrackingProps {
  equipment: Equipment[];
  onUpdateEquipment: (equipment: Equipment[]) => void;
  isReadOnly: boolean;
}

export const EquipmentTracking = ({ equipment: initialEquipment, onUpdateEquipment, isReadOnly }: EquipmentTrackingProps) => {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddEquipment = () => {
    setIsAdding(true);
  };

  const handleSaveNewEquipment = (newEquipment: Omit<Equipment, 'id'>) => {
    const newItem: Equipment = {
      id: Math.random().toString(36).substring(2, 15),
      ...newEquipment
    };
    const updatedEquipment = [...equipment, newItem];
    setEquipment(updatedEquipment);
    onUpdateEquipment(updatedEquipment);
    setIsAdding(false);
  };

  const handleUpdateEquipment = (id: string, updatedFields: Partial<Equipment>) => {
    const updatedEquipment = equipment.map(item =>
      item.id === id ? { ...item, ...updatedFields } : item
    );
    setEquipment(updatedEquipment);
    onUpdateEquipment(updatedEquipment);
  };

  const handleDeleteEquipment = (id: string) => {
    const updatedEquipment = equipment.filter(item => item.id !== id);
    setEquipment(updatedEquipment);
    onUpdateEquipment(updatedEquipment);
  };

  const filteredEquipment = equipment.filter(item => {
    const searchMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package size={24} className="text-glass-orange" />
          Equipment Tracking
        </h3>
        {!isReadOnly && (
          <button
            onClick={handleAddEquipment}
            className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus size={16} />
            Add Equipment
          </button>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        {/* Search and Filter */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search equipment..."
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          <select
            className="bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="packed">Packed</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="setup">Setup</option>
            <option value="missing">Missing</option>
          </select>
        </div>

        {/* Equipment List */}
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="py-2 px-3 font-medium">Name</th>
                <th className="py-2 px-3 font-medium">Category</th>
                <th className="py-2 px-3 font-medium">Quantity</th>
                <th className="py-2 px-3 font-medium">Status</th>
                <th className="py-2 px-3 font-medium">Tracking #</th>
                <th className="py-2 px-3 font-medium">Assigned To</th>
                {!isReadOnly && <th className="py-2 px-3 font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEquipment.map((item) => (
                <tr key={item.id} className="border-b border-white/10 last:border-b-0">
                  <td className="py-3 px-3 text-white">{item.name}</td>
                  <td className="py-3 px-3 text-gray-300">{item.category}</td>
                  <td className="py-3 px-3 text-gray-300">{item.quantity}</td>
                  <td className="py-3 px-3">
                    {item.status === 'packed' && (
                      <div className="flex items-center gap-2 text-yellow-400">
                        <Package size={14} />
                        Packed
                      </div>
                    )}
                    {item.status === 'in-transit' && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Truck size={14} />
                        In Transit
                      </div>
                    )}
                    {item.status === 'delivered' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <MapPin size={14} />
                        Delivered
                      </div>
                    )}
                    {item.status === 'setup' && (
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={14} />
                        Setup
                      </div>
                    )}
                    {item.status === 'missing' && (
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle size={14} />
                        Missing
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-gray-300">{item.trackingNumber || '-'}</td>
                  <td className="py-3 px-3 text-gray-300">{item.assignedTo || '-'}</td>
                  {!isReadOnly && (
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const newStatus =
                              item.status === 'packed'
                                ? 'in-transit'
                                : item.status === 'in-transit'
                                  ? 'delivered'
                                  : item.status === 'delivered'
                                    ? 'setup'
                                    : 'missing';
                            handleUpdateEquipment(item.id, { status: newStatus });
                          }}
                          className="text-glass-orange hover:text-glass-orange/80 text-sm"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteEquipment(item.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Equipment Form */}
        {isAdding && (
          <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-medium text-white mb-4">Add New Equipment</h4>
            <NewEquipmentForm onSave={handleSaveNewEquipment} onCancel={() => setIsAdding(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

interface NewEquipmentFormProps {
  onSave: (equipment: Omit<Equipment, 'id'>) => void;
  onCancel: () => void;
}

const NewEquipmentForm = ({ onSave, onCancel }: NewEquipmentFormProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('audio');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('packed');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEquipment = {
      name,
      category,
      quantity,
      status,
      trackingNumber,
      assignedTo
    };
    onSave(newEquipment);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
        <input
          type="text"
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
        <select
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
        >
          <option value="audio">Audio</option>
          <option value="video">Video</option>
          <option value="lighting">Lighting</option>
          <option value="instruments">Instruments</option>
          <option value="sports">Sports</option>
          <option value="general">General</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Quantity</label>
        <input
          type="number"
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          min="1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
        <select
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="packed">Packed</option>
          <option value="in-transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="setup">Setup</option>
          <option value="missing">Missing</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Tracking Number</label>
        <input
          type="text"
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
        <input
          type="text"
          className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 focus:border-glass-orange/50"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />
      </div>

      <div className="md:col-span-2 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-xl transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
};

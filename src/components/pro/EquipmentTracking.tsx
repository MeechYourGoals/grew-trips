import React, { useState } from 'react';
import { Package, Search, MapPin, CheckCircle, AlertCircle, Clock, Truck } from 'lucide-react';
import { Equipment } from '../../types/pro';

interface EquipmentTrackingProps {
  equipment: Equipment[];
  onUpdateEquipment: (equipment: Equipment[]) => void;
  isReadOnly?: boolean;
}

export const EquipmentTracking = ({ equipment, onUpdateEquipment, isReadOnly = false }: EquipmentTrackingProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'audio', 'video', 'lighting', 'instruments', 'sports', 'general'];
  
  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'packed': return 'text-blue-400 bg-blue-500/20';
      case 'in-transit': return 'text-yellow-400 bg-yellow-500/20';
      case 'delivered': return 'text-green-400 bg-green-500/20';
      case 'setup': return 'text-purple-400 bg-purple-500/20';
      case 'missing': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'packed': return <Package size={16} />;
      case 'in-transit': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'setup': return <CheckCircle size={16} />;
      case 'missing': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'audio': return 'bg-green-500/20 text-green-400';
      case 'video': return 'bg-blue-500/20 text-blue-400';
      case 'lighting': return 'bg-yellow-500/20 text-yellow-400';
      case 'instruments': return 'bg-purple-500/20 text-purple-400';
      case 'sports': return 'bg-orange-500/20 text-orange-400';
      case 'general': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const updateEquipmentStatus = (id: string, newStatus: string) => {
    if (isReadOnly) return;
    
    const updatedEquipment = equipment.map(item =>
      item.id === id ? { ...item, status: newStatus as Equipment['status'] } : item
    );
    onUpdateEquipment(updatedEquipment);
  };

  return (
    <div className="space-y-6">
      {/* Read-only notice */}
      {isReadOnly && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-yellow-400 text-sm">Read-only access for your role</p>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Package className="text-red-400" size={24} />
            <h2 className="text-xl font-bold text-white">Equipment & Freight</h2>
          </div>
          <div className="text-gray-400 text-sm">
            {equipment.length} items • {equipment.filter(e => e.status === 'missing').length} missing
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                  <span className="text-gray-400 text-sm">Qty: {item.quantity}</span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${getStatusColor(item.status)}`}>
                {getStatusIcon(item.status)}
                <span className="text-xs font-medium">{item.status.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-gray-300 text-sm">{item.location}</span>
            </div>

            {/* Assigned To */}
            {item.assignedTo && (
              <div className="mb-3">
                <span className="text-gray-400 text-xs">Assigned to: </span>
                <span className="text-white text-sm">{item.assignedTo}</span>
              </div>
            )}

            {/* Tracking Number */}
            {item.trackingNumber && (
              <div className="mb-3">
                <span className="text-gray-400 text-xs">Tracking: </span>
                <span className="text-blue-400 text-sm font-mono">{item.trackingNumber}</span>
              </div>
            )}

            {/* Notes */}
            {item.notes && (
              <div className="mb-3">
                <p className="text-gray-300 text-xs">{item.notes}</p>
              </div>
            )}

            {/* Quick Status Update - only show if not read-only */}
            {!isReadOnly && (
              <div className="flex gap-1 mt-3">
                {['packed', 'in-transit', 'delivered', 'setup'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateEquipmentStatus(item.id, status)}
                    className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${
                      item.status === status
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {status.replace('-', ' ')}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No equipment found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

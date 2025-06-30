
import React, { useState } from 'react';
import { Package, Truck, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Equipment } from '../../types/pro';

interface EquipmentTrackingProps {
  equipment: Equipment[];
  userRole: 'admin' | 'staff' | 'talent';
}

export const EquipmentTracking = ({ equipment, userRole }: EquipmentTrackingProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'instruments', 'sound', 'lighting', 'transport', 'jerseys', 'signage'];
  
  const filteredEquipment = equipment.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'packed': return <Package size={16} className="text-blue-400" />;
      case 'shipped': return <Truck size={16} className="text-yellow-400" />;
      case 'arrived': return <CheckCircle size={16} className="text-green-400" />;
      case 'missing': return <AlertCircle size={16} className="text-red-400" />;
      default: return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'packed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'shipped': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'arrived': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'missing': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const totalValue = equipment.reduce((sum, item) => sum + item.value, 0);
  const missingItems = equipment.filter(item => item.status === 'missing');

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Package size={24} className="text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{equipment.length}</div>
            <div className="text-sm text-gray-400">Total Items</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">
              {equipment.filter(item => item.status === 'arrived').length}
            </div>
            <div className="text-sm text-gray-400">Arrived</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <AlertCircle size={24} className="text-red-400 mx-auto mb-2" />
            <div className="text-xl font-bold text-white">{missingItems.length}</div>
            <div className="text-sm text-gray-400">Missing</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-xl font-bold text-white">${totalValue.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Equipment List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                  <CardTitle className="text-lg text-white">{item.name}</CardTitle>
                </div>
                <Badge className={`text-xs ${getStatusColor(item.status)} border`}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Category</p>
                <p className="text-sm text-white capitalize">{item.category}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Responsible Person</p>
                <p className="text-sm text-white">{item.responsiblePerson}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500">Value</p>
                <p className="text-sm text-white">${item.value.toLocaleString()}</p>
              </div>

              {item.trackingNumber && (
                <div>
                  <p className="text-xs text-gray-500">Tracking Number</p>
                  <p className="text-sm text-blue-300 font-mono">{item.trackingNumber}</p>
                </div>
              )}

              {item.status === 'missing' && (
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                  <p className="text-xs text-red-300">⚠️ Item reported missing</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No Equipment Found</h3>
          <p className="text-gray-500 text-sm">
            {searchTerm ? 'Try adjusting your search terms' : 'No equipment matches the selected category'}
          </p>
        </div>
      )}
    </div>
  );
};


import React, { useState } from 'react';
import { Package, DollarSign, Truck, Plus, AlertTriangle, QrCode, MapPin } from 'lucide-react';
import { QRCodeManager } from './QRCodeManager';
import { SmartImport } from '../SmartImport';
import { EquipmentItem } from '../../types/enterprise';

export const EquipmentManager = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  const parseConfig = {
    targetType: 'equipment' as const,
    expectedFields: ['name', 'category', 'quantity', 'insured_value', 'status', 'tracking_number'],
    description: 'Import equipment inventory from spreadsheets, manifests, or insurance documents. AI will categorize items and track their status.'
  };

  const handleSmartImport = (importedData: any[]) => {
    const newEquipment: EquipmentItem[] = importedData.map((item, index) => ({
      id: `imported-${Date.now()}-${index}`,
      name: item.name || item.equipment || item.item || 'Unknown Item',
      category: normalizeCategory(item.category || item.type || 'general'),
      quantity: parseInt(item.quantity) || 1,
      insuredValue: parseFloat(item.insured_value || item.value) || 0,
      status: normalizeStatus(item.status || 'packed'),
      trackingNumber: item.tracking_number || item.tracking || '',
      assignedTo: item.assigned_to || item.assignee || ''
    }));

    setEquipment(prev => [...prev, ...newEquipment]);
  };

  const normalizeCategory = (category: string): EquipmentItem['category'] => {
    const lower = category.toLowerCase();
    if (lower.includes('audio') || lower.includes('sound')) return 'audio';
    if (lower.includes('video') || lower.includes('camera')) return 'video';
    if (lower.includes('light')) return 'lighting';
    if (lower.includes('instrument') || lower.includes('music')) return 'instruments';
    if (lower.includes('sport')) return 'sports';
    return 'general';
  };

  const normalizeStatus = (status: string): EquipmentItem['status'] => {
    const lower = status.toLowerCase();
    if (lower.includes('transit') || lower.includes('shipping')) return 'in-transit';
    if (lower.includes('deliver')) return 'delivered';
    if (lower.includes('setup') || lower.includes('ready')) return 'setup';
    if (lower.includes('missing') || lower.includes('lost')) return 'missing';
    return 'packed';
  };
  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    {
      id: '1',
      name: 'Main PA System',
      category: 'audio' as const,
      quantity: 1,
      insuredValue: 85000,
      status: 'delivered' as const,
      trackingNumber: 'FDX123456789',
      assignedTo: 'Audio Crew Lead'
    },
    {
      id: '2',
      name: 'LED Wall Panels',
      category: 'video' as const,
      quantity: 48,
      insuredValue: 120000,
      status: 'in-transit' as const,
      trackingNumber: 'UPS987654321'
    },
    {
      id: '3',
      name: 'Lighting Rig',
      category: 'lighting' as const,
      quantity: 1,
      insuredValue: 95000,
      status: 'missing' as const,
      trackingNumber: 'DHL456789123'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/20 text-green-400';
      case 'in-transit': return 'bg-yellow-500/20 text-yellow-400';
      case 'setup': return 'bg-blue-500/20 text-blue-400';
      case 'missing': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const totalValue = equipment.reduce((sum, item) => sum + item.insuredValue, 0);

  const tabs = [
    { id: 'inventory', label: 'Inventory', icon: Package }
  ];

  const renderTabContent = () => {
    return renderInventoryContent();
  };

  const renderInventoryContent = () => (
    <>
      {/* Smart Import Component */}
      <SmartImport
        targetCollection="equipment_items"
        parseConfig={parseConfig}
        onDataImported={handleSmartImport}
        className="mb-6"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">{equipment.length}</div>
          <div className="text-sm text-gray-400">Total Items</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">${totalValue.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Insured Value</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">
            {equipment.filter(e => e.status === 'in-transit').length}
          </div>
          <div className="text-sm text-gray-400">In Transit</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">
            {equipment.filter(e => e.status === 'missing').length}
          </div>
          <div className="text-sm text-gray-400">Missing</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="space-y-4">
          {equipment.map((item) => (
            <div key={item.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-glass-orange" />
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.toUpperCase().replace('-', ' ')}
                  </span>
                  {item.status === 'missing' && <AlertTriangle size={16} className="text-red-400" />}
                </div>
                <div className="flex gap-2">
                  <button className="text-glass-orange hover:text-glass-orange/80 text-sm">Track</button>
                  <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                    <QrCode size={12} />
                    QR
                  </button>
                  <button className="text-gray-400 hover:text-white text-sm">Edit</button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="text-gray-400">
                  <span className="text-white">Qty:</span> {item.quantity}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <DollarSign size={12} />
                  ${item.insuredValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Truck size={12} />
                  {item.trackingNumber}
                </div>
                <div className="text-gray-400">
                  {item.assignedTo && <span className="text-white">Assigned:</span>} {item.assignedTo || 'Unassigned'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package size={24} className="text-glass-orange" />
          Equipment Inventory
        </h3>
        <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus size={16} />
          Add Equipment
        </button>
      </div>


      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

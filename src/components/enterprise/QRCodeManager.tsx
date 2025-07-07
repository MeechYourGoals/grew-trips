import React, { useState } from 'react';
import { QrCode, Download, Camera, Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: 'packed' | 'in-transit' | 'delivered' | 'setup' | 'missing';
  location: string;
  qrCode: string;
}

export const QRCodeManager = () => {
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [scanMode, setScanMode] = useState(false);

  const equipment: EquipmentItem[] = [
    {
      id: 'eq-001',
      name: 'LED Screen Panel Set',
      category: 'video',
      status: 'packed',
      location: 'Warehouse A',
      qrCode: 'QR-LED-001'
    },
    {
      id: 'eq-002',
      name: 'Sound Mixing Console',
      category: 'audio',
      status: 'in-transit',
      location: 'Truck 2',
      qrCode: 'QR-SND-002'
    },
    {
      id: 'eq-003',
      name: 'Camera Kit (4K)',
      category: 'video',
      status: 'delivered',
      location: 'Venue Setup',
      qrCode: 'QR-CAM-003'
    }
  ];

  const generateQRCode = (equipmentId: string) => {
    // In a real app, this would generate an actual QR code
    const equipmentItem = equipment.find(eq => eq.id === equipmentId);
    if (equipmentItem) {
      // Mock QR code data - would contain equipment ID, tour info, contact details
      const qrData = {
        equipmentId: equipmentItem.id,
        name: equipmentItem.name,
        tourId: 'tour-2024-summer',
        contactPhone: '+1-555-0123',
        emergencyContact: 'production@tours.com'
      };
      
      console.log('Generated QR Code Data:', qrData);
      alert(`QR Code generated for ${equipmentItem.name}\nData: ${JSON.stringify(qrData, null, 2)}`);
    }
  };

  const downloadQRCodes = () => {
    // Mock download functionality
    alert('Downloading QR codes for all equipment as PDF...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'packed': return 'bg-blue-600';
      case 'in-transit': return 'bg-yellow-600';
      case 'delivered': return 'bg-green-600';
      case 'setup': return 'bg-purple-600';
      case 'missing': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-white">QR Code Management</h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setScanMode(!scanMode)}
            variant={scanMode ? "default" : "outline"}
          >
            <Camera size={16} className="mr-2" />
            {scanMode ? 'Stop Scanning' : 'Scan QR Code'}
          </Button>
          <Button onClick={downloadQRCodes} variant="outline">
            <Download size={16} className="mr-2" />
            Download All QR Codes
          </Button>
        </div>
      </div>

      {/* QR Code Scanner Mode */}
      {scanMode && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Camera size={20} />
            QR Code Scanner
          </h4>
          <div className="bg-gray-900/50 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-4 bg-white/10 rounded-lg flex items-center justify-center">
              <QrCode size={64} className="text-gray-400" />
            </div>
            <p className="text-gray-300 mb-4">Point your camera at a QR code to scan equipment</p>
            <div className="flex justify-center gap-2">
              <Input 
                placeholder="Or enter QR code manually" 
                className="max-w-xs bg-gray-800/50 border-gray-600 text-white"
              />
              <Button>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* Equipment List with QR Codes */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Package size={20} />
          Equipment QR Codes
        </h4>
        <div className="space-y-4">
          {equipment.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                  <QrCode size={32} className="text-black" />
                </div>
                <div>
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-sm text-gray-400">ID: {item.id} • QR: {item.qrCode}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getStatusColor(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{item.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => generateQRCode(item.id)}
                  variant="ghost"
                  size="sm"
                >
                  <QrCode size={14} className="mr-1" />
                  Generate
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chain of Custody */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Chain of Custody Documentation</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Equipment Transfer Log</div>
              <div className="text-sm text-gray-400">Track who handled equipment and when</div>
            </div>
            <Button variant="ghost" size="sm">View Log</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Location History</div>
              <div className="text-sm text-gray-400">GPS tracking and manual check-ins</div>
            </div>
            <Button variant="ghost" size="sm">View History</Button>
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <div className="text-white font-medium">Damage Reports</div>
              <div className="text-sm text-gray-400">Photo documentation of any issues</div>
            </div>
            <Button variant="ghost" size="sm">View Reports</Button>
          </div>
        </div>
      </div>

      {/* Mobile App Integration */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Mobile Integration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </div>
            <div className="text-white font-medium mb-1">iOS App</div>
            <div className="text-sm text-gray-400 mb-2">Scan QR codes with iPhone camera</div>
            <Button size="sm" variant="outline">Download</Button>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 bg-green-600 rounded-lg flex items-center justify-center">
              <Camera size={24} className="text-white" />
            </div>
            <div className="text-white font-medium mb-1">Android App</div>
            <div className="text-sm text-gray-400 mb-2">Scan QR codes with Android camera</div>
            <Button size="sm" variant="outline">Download</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
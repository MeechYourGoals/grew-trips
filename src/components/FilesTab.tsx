
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, FileText, FileImage, FileVideo, Download, Trash2, Calendar, Sparkles, Crown, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { useToast } from '../hooks/use-toast';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';

interface TripFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  extractedEvents?: number;
}

interface FilesTabProps {
  tripId: string;
}

export const FilesTab = ({ tripId }: FilesTabProps) => {
  const [files, setFiles] = useState<TripFile[]>([
    {
      id: '1',
      name: 'Dodgers Game Tickets.pdf',
      type: 'application/pdf',
      size: 245600,
      url: '/files/dodgers-tickets.pdf',
      uploadedBy: 'John Smith',
      uploadedAt: '2025-01-15T10:30:00Z',
      extractedEvents: 1
    },
    {
      id: '2',
      name: 'Conference Schedule.jpg',
      type: 'image/jpeg',
      size: 1024000,
      url: '/files/conference-schedule.jpg',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2025-01-14T16:45:00Z',
      extractedEvents: 3
    }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const { toast } = useToast();
  const { isPlus } = useConsumerSubscription();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    for (const file of acceptedFiles) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit.`,
          variant: "destructive"
        });
        continue;
      }

      // Simulate file upload
      const newFile: TripFile = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedBy: 'You',
        uploadedAt: new Date().toISOString()
      };

      setFiles(prev => [newFile, ...prev]);

      // If user has Plus subscription, simulate AI parsing
      if (isPlus && (file.type.includes('pdf') || file.type.includes('image'))) {
        setTimeout(() => {
          const mockEvents = [
            {
              title: file.name.includes('Dodgers') ? 'LA Dodgers vs SF Giants' : 'Conference Opening Keynote',
              date: '2025-02-15',
              startTime: '19:10',
              endTime: '22:30',
              location: file.name.includes('Dodgers') ? 'Dodger Stadium, Los Angeles, CA' : 'Convention Center, Hall A',
              fileId: newFile.id
            }
          ];
          
          setPendingEvents(prev => [...prev, ...mockEvents]);
          newFile.extractedEvents = mockEvents.length;
          setFiles(prev => prev.map(f => f.id === newFile.id ? newFile : f));
          
          toast({
            title: "AI found events! ⚡",
            description: `Found ${mockEvents.length} potential events in ${file.name}. Review them?`,
            action: (
              <Button variant="outline" size="sm" onClick={() => setShowEventModal(true)}>
                Review
              </Button>
            )
          });
        }, 2000);
      }
    }

    setIsUploading(false);
  }, [isPlus, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'text/plain': ['.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/calendar': ['.ics']
    }
  });

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <FileImage className="text-green-500" size={20} />;
    if (type.includes('pdf')) return <FileText className="text-red-500" size={20} />;
    if (type.includes('video')) return <FileVideo className="text-blue-500" size={20} />;
    return <File className="text-gray-500" size={20} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "File has been removed from the trip."
    });
  };

  const handleDownloadFile = (file: TripFile) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Trip Files</h3>
          <p className="text-sm text-gray-400">
            Share tickets, itineraries, confirmations, and more
          </p>
        </div>
        {isPlus && (
          <Badge className="bg-gradient-to-r from-glass-orange to-glass-yellow text-black">
            <Sparkles size={12} className="mr-1" />
            AI Calendar Sync
          </Badge>
        )}
      </div>

      {/* Upload Area */}
      <Card className="bg-white/5 border-white/10">
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
            isDragActive 
              ? 'border-glass-orange bg-glass-orange/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
            <p className="text-white font-medium mb-2">
              {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              or click to browse • PDF, Images, Text, Excel, iCal supported
            </p>
            <p className="text-xs text-gray-500">
              Max 50MB per file {!isPlus && '• Upgrade to Plus for AI calendar sync'}
            </p>
            {isUploading && (
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-glass-orange mx-auto"></div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white/5 border-white/10 text-white"
        />
      </div>

      {/* Files List */}
      {filteredFiles.length === 0 && !isUploading ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <p className="text-gray-400">No files uploaded yet</p>
          <p className="text-sm text-gray-500">Upload your first file to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="bg-white/5 border-white/10 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{formatFileSize(file.size)}</span>
                      <span>by {file.uploadedBy}</span>
                      <span>{formatDate(file.uploadedAt)}</span>
                      {file.extractedEvents && isPlus && (
                        <Badge variant="outline" className="text-glass-orange border-glass-orange/50">
                          <Calendar size={10} className="mr-1" />
                          {file.extractedEvents} events found
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadFile(file)}
                    className="text-gray-400 hover:text-white"
                  >
                    <Download size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Plus Upsell for Free Users */}
      {!isPlus && files.length > 0 && (
        <Card className="bg-gradient-to-r from-glass-orange/10 to-glass-yellow/10 border-glass-orange/30 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-glass-orange to-glass-yellow p-3 rounded-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-semibold mb-1">Upgrade to Trips Plus</h4>
              <p className="text-gray-300 text-sm">
                Let AI automatically extract dates, times, and locations from your uploaded files and sync them to your trip calendar.
              </p>
            </div>
            <Button className="bg-gradient-to-r from-glass-orange to-glass-yellow text-white hover:opacity-90">
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

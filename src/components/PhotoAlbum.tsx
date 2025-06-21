
import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  timestamp: Date;
  uploadedBy: string;
  caption?: string;
}

export const PhotoAlbum = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto: Photo = {
            id: Date.now().toString() + Math.random(),
            url: e.target?.result as string,
            timestamp: new Date(),
            uploadedBy: 'You',
          };
          setPhotos(prev => [newPhoto, ...prev]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== photoId));
  };

  return (
    <div className="p-6 min-h-[400px]">
      {/* Upload Section */}
      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handlePhotoUpload}
          className="hidden"
        />
        <button
          onClick={triggerPhotoUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-200 hover:scale-105 shadow-lg"
        >
          <Camera size={20} />
          Add Photos
        </button>
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <div className="aspect-square bg-slate-800/50 rounded-lg overflow-hidden">
                <img
                  src={photo.url}
                  alt="Trip photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
              <div className="mt-2 text-xs text-slate-400">
                {photo.uploadedBy} • {photo.timestamp.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
              <Camera size={32} className="text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
          <p className="text-slate-400 mb-6">Start capturing memories from your trip!</p>
          <button
            onClick={triggerPhotoUpload}
            className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto"
          >
            <Upload size={18} />
            Upload Photos
          </button>
        </div>
      )}
    </div>
  );
};

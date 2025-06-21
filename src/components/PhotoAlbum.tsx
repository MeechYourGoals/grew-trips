
import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Plus } from 'lucide-react';

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
    <div className="p-8 min-h-[400px] bg-gradient-to-br from-gray-50 to-white">
      {/* Upload Section */}
      <div className="mb-8">
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-blue-500/25 group"
        >
          <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
            <Camera size={24} />
          </div>
          <span className="text-lg font-semibold">Add Photos</span>
        </button>
      </div>

      {/* Photos Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-200 group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300">
                <img
                  src={photo.url}
                  alt="Trip photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
              >
                <X size={16} />
              </button>
              <div className="mt-3 px-2">
                <div className="text-sm font-medium text-gray-900">{photo.uploadedBy}</div>
                <div className="text-xs text-gray-500">{photo.timestamp.toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Camera size={40} className="text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No photos yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">Start capturing memories from your trip! Upload photos to share with your group.</p>
          <button
            onClick={triggerPhotoUpload}
            className="bg-white hover:bg-gray-50 text-gray-900 px-8 py-4 rounded-2xl transition-all duration-200 flex items-center gap-3 mx-auto shadow-lg shadow-gray-200/50 border border-gray-200 hover:shadow-xl font-medium"
          >
            <Upload size={20} />
            Upload Photos
          </button>
        </div>
      )}
    </div>
  );
};

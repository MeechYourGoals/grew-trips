
import React from 'react';
import { Calendar, MapPin, Globe, Palette } from 'lucide-react';

export const EventProfileSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white">Event Profile & Branding</h3>
      
      {/* Basic Event Info */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Basic Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Event Name</label>
            <input 
              type="text" 
              defaultValue="Tech Innovation Summit 2025"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Event Type</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>Conference</option>
              <option>Seminar</option>
              <option>Workshop</option>
              <option>Networking Event</option>
              <option>Trade Show</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Start Date & Time</label>
            <input 
              type="datetime-local" 
              defaultValue="2025-03-15T09:00"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">End Date & Time</label>
            <input 
              type="datetime-local" 
              defaultValue="2025-03-17T17:00"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm text-gray-300 mb-2">Event Description</label>
          <textarea 
            rows={4}
            defaultValue="Join industry leaders and innovators for three days of cutting-edge presentations, networking, and collaboration."
            className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50 resize-none"
          />
        </div>
      </div>

      {/* Location Settings */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin size={20} />
          Location & Venue
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Venue Name</label>
            <input 
              type="text" 
              defaultValue="San Francisco Convention Center"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Event Format</label>
            <select className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50">
              <option>In-Person</option>
              <option>Virtual</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Full Address</label>
            <input 
              type="text" 
              defaultValue="747 Howard St, San Francisco, CA 94103"
              className="w-full bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
            />
          </div>
        </div>
      </div>

      {/* Branding & Theme */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Palette size={20} />
          Event Branding
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Primary Color</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                defaultValue="#ff6b35"
                className="w-12 h-12 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer"
              />
              <input 
                type="text" 
                defaultValue="#ff6b35"
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Secondary Color</label>
            <div className="flex gap-2 items-center">
              <input 
                type="color" 
                defaultValue="#4a90e2"
                className="w-12 h-12 bg-gray-800/50 border border-gray-600 rounded-lg cursor-pointer"
              />
              <input 
                type="text" 
                defaultValue="#4a90e2"
                className="flex-1 bg-gray-800/50 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-glass-orange/50"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-300 mb-2">Event Logo</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Globe size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400 mb-2">Upload your event logo</p>
              <button className="bg-glass-orange hover:bg-glass-orange/80 text-white px-4 py-2 rounded-lg font-medium">
                Choose File
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

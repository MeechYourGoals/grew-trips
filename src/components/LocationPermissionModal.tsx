import React from 'react';
import { MapPin, Shield, Clock, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  tripName: string;
}

export const LocationPermissionModal = ({ 
  isOpen, 
  onClose, 
  onAccept, 
  tripName 
}: LocationPermissionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <MapPin size={20} className="text-white" />
            </div>
            <DialogTitle className="text-xl text-white">Share Your Location</DialogTitle>
          </div>
          <DialogDescription className="text-gray-300">
            Enable location sharing to see where your friends are on <strong>{tripName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <Users size={16} className="text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">See Your Friends</p>
              <p className="text-gray-400 text-sm">View real-time locations of trip participants on the map</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Shield size={16} className="text-green-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Privacy Protected</p>
              <p className="text-gray-400 text-sm">Only visible to people on this trip. You can stop sharing anytime</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <p className="text-white font-medium text-sm">Auto-Cleanup</p>
              <p className="text-gray-400 text-sm">Location data is automatically deleted after 48 hours</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Not Now
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Enable Sharing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
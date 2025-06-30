
import React from 'react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

export const PremiumGate = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Audio Overviews</h1>
        </div>
        
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Volume2 size={32} className="text-yellow-500" />
          </div>
          <h2 className="text-xl font-semibold mb-4">Premium Feature</h2>
          <p className="text-gray-400 mb-8">This feature is available to Plus/Pro Subscribers</p>
          <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-8 py-3">
            Upgrade to Premium
          </Button>
        </div>
      </div>
    </div>
  );
};

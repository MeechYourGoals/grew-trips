
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, MessageCircle } from 'lucide-react';
import { TourDashboard } from '../components/TourDashboard';
import { BroadcastSystem } from '../components/BroadcastSystem';
import { MessageInbox } from '../components/MessageInbox';
import { TourChat } from '../components/TourChat';

const TourDetail = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', label: 'Tour Dashboard' },
    { id: 'messages', label: 'Message Inbox' },
    { id: 'tour-chat', label: 'Tour Chat' },
    { id: 'broadcasts', label: 'Broadcasts' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <TourDashboard />;
      case 'messages':
        return <MessageInbox />;
      case 'tour-chat':
        return <TourChat />;
      case 'broadcasts':
        return <BroadcastSystem tourId={tourId || '1'} />;
      default:
        return <TourDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Back Navigation */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-gray-300 hover:text-white mb-8 transition-colors group"
        >
          <div className="bg-gray-800 p-2 rounded-lg shadow-lg group-hover:shadow-glass-orange/20 transition-all border border-gray-700 hover:border-glass-orange/50">
            <ArrowLeft size={20} />
          </div>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Pro Badge */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-gradient-to-r from-glass-orange/20 to-glass-yellow/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 flex items-center gap-2">
            <Crown size={16} className="text-glass-orange" />
            <span className="text-glass-orange font-medium">TRIPS PRO</span>
          </div>
        </div>

        {/* Section Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-glass-orange to-glass-yellow text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {section.label}
              {section.id === 'messages' && (
                <MessageCircle size={16} className="ml-2" />
              )}
            </button>
          ))}
        </div>

        {/* Section Content */}
        {renderSection()}
      </div>
    </div>
  );
};

export default TourDetail;

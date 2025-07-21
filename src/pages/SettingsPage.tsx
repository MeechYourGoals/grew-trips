
import React, { useState } from 'react';
import { SettingsMenu } from '../components/SettingsMenu';
import { useIsMobile } from '../hooks/use-mobile';

const SettingsPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const isMobile = useIsMobile();

  // On mobile, we want to show the full SettingsMenu component
  // which includes all the consumer/enterprise/events functionality
  if (isMobile) {
    return (
      <SettingsMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
      />
    );
  }

  // On desktop, redirect to home since settings are handled via the SettingsMenu overlay
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p className="text-gray-400">Please use the settings menu in the top navigation</p>
      </div>
    </div>
  );
};

export default SettingsPage;

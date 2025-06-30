
import React from 'react';
import { Volume2 } from 'lucide-react';

export const EmptyState = () => {
  return (
    <div className="text-center py-20">
      <Volume2 size={48} className="text-gray-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">Generate Your First Audio Overview</h3>
      <p className="text-gray-400 mb-6">
        Paste a website URL above and we'll create an AI-powered audio summary using Google Notebook LM
      </p>
      <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto text-left">
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-medium text-white mb-2">1. Paste URL</h4>
          <p className="text-sm text-gray-400">Enter any website URL you want summarized</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-medium text-white mb-2">2. AI Analysis</h4>
          <p className="text-sm text-gray-400">Our AI reads and analyzes the content</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <h4 className="font-medium text-white mb-2">3. Audio Summary</h4>
          <p className="text-sm text-gray-400">Get a natural-sounding audio overview</p>
        </div>
      </div>
    </div>
  );
};

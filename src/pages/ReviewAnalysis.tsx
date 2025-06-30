
import React, { useState } from 'react';
import { BarChart3, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useReviewAnalysis } from '../hooks/useAiFeatures';
import { ReviewAnalysisHeader } from '../components/review/ReviewAnalysisHeader';
import { AnalysisResults } from '../components/review/AnalysisResults';
import { ReviewChat } from '../components/review/ReviewChat';
import { ReviewEmptyState } from '../components/review/ReviewEmptyState';
import { PremiumGate } from '../components/audio/PremiumGate';

const ReviewAnalysis = () => {
  const { isPlus } = useConsumerSubscription();
  const reviewAnalysis = useReviewAnalysis();
  const [urls, setUrls] = useState({
    google: '',
    yelp: '',
    facebook: '',
    tripadvisor: ''
  });
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [chatInput, setChatInput] = useState('');

  const handleAnalyze = () => {
    const allUrls = Object.values(urls).filter(url => url.trim());
    if (allUrls.length > 0) {
      reviewAnalysis.analyzeReviews(allUrls.join(','));
    }
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;
    
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Mock AI response for demo
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Based on the review analysis, I can see that ${chatInput.toLowerCase()} is mentioned frequently. The sentiment around this topic appears to be generally positive with a few areas for improvement. Would you like me to elaborate on specific aspects?`
      }]);
    }, 1000);
    
    setChatInput('');
  };

  if (!isPlus) {
    return <PremiumGate />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ReviewAnalysisHeader
        urls={urls}
        setUrls={setUrls}
        onAnalyze={handleAnalyze}
        isLoading={reviewAnalysis.isLoading}
      />

      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="analysis" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <BarChart3 size={16} className="mr-2" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              <MessageSquare size={16} className="mr-2" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="mt-6">
            {reviewAnalysis.result ? (
              <AnalysisResults result={reviewAnalysis.result} />
            ) : (
              <ReviewEmptyState />
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <ReviewChat
              messages={chatMessages}
              input={chatInput}
              onInputChange={setChatInput}
              onSubmit={handleChatSubmit}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewAnalysis;


import React, { useState } from 'react';
import { ArrowLeft, Globe, MessageSquare, BarChart3, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useConsumerSubscription } from '../hooks/useConsumerSubscription';
import { useReviewAnalysis } from '../hooks/useAiFeatures';

const ReviewAnalysis = () => {
  const navigate = useNavigate();
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

  const platforms = [
    { key: 'google', name: 'Google Reviews', icon: Globe, color: 'text-blue-400' },
    { key: 'yelp', name: 'Yelp', icon: Star, color: 'text-red-400' },
    { key: 'facebook', name: 'Facebook', icon: MessageSquare, color: 'text-blue-500' },
    { key: 'tripadvisor', name: 'TripAdvisor', icon: TrendingUp, color: 'text-green-400' }
  ];

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
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Universal Review Summaries</h1>
          </div>
          
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Globe size={32} className="text-yellow-500" />
            </div>
            <h2 className="text-xl font-semibold mb-4">Upgrade Required</h2>
            <p className="text-gray-400 mb-8">This feature is available to Plus/Pro Subscribers</p>
            <Button className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-8 py-3">
              Upgrade to Plus
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => navigate('/')} className="text-white hover:text-yellow-500">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Universal Review Summaries</h1>
              <p className="text-gray-400">Analyze reviews from multiple platforms with AI</p>
            </div>
          </div>

          {/* Platform URL Inputs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {platforms.map(({ key, name, icon: Icon, color }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className={color} />
                  <label className="text-sm font-medium">{name}</label>
                </div>
                <Input
                  placeholder={`${name} URL`}
                  value={urls[key as keyof typeof urls]}
                  onChange={(e) => setUrls(prev => ({ ...prev, [key]: e.target.value }))}
                  className="bg-gray-900 border-gray-700 text-white"
                />
              </div>
            ))}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={reviewAnalysis.isLoading || !Object.values(urls).some(url => url.trim())}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-medium px-8 py-3"
          >
            {reviewAnalysis.isLoading ? 'Analyzing...' : 'Analyze Reviews'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
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
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Analysis */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Overall Sentiment Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Overall Score</span>
                          <span className="text-2xl font-bold text-yellow-500">{reviewAnalysis.result.score}%</span>
                        </div>
                        <Progress value={reviewAnalysis.result.score} className="h-3" />
                        <p className="text-gray-300 leading-relaxed">{reviewAnalysis.result.text}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Breakdown */}
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Platform Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {reviewAnalysis.result.platforms.map((platform, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Globe size={20} className="text-yellow-500" />
                              <span className="font-medium">{platform}</span>
                            </div>
                            <ExternalLink size={16} className="text-gray-400" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats Sidebar */}
                <div className="space-y-6">
                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-500">142</div>
                        <div className="text-sm text-gray-400">Reviews Analyzed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{reviewAnalysis.result.score}%</div>
                        <div className="text-sm text-gray-400">Positive Sentiment</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">4.2</div>
                        <div className="text-sm text-gray-400">Average Rating</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gray-900 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white">Top Themes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {['Service Quality', 'Food Quality', 'Atmosphere', 'Value for Money'].map((theme, index) => (
                        <div key={theme} className="flex items-center justify-between">
                          <span className="text-gray-300">{theme}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={85 - index * 10} className="w-16 h-2" />
                            <span className="text-sm text-gray-400">{85 - index * 10}%</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <Globe size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Enter platform URLs and click "Analyze Reviews" to get started</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-700 h-96">
                  <CardHeader>
                    <CardTitle className="text-white">AI Analysis Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-80">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageSquare size={32} className="text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">Ask questions about the review analysis</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.role === 'user' 
                                ? 'bg-yellow-500 text-black' 
                                : 'bg-gray-800 text-white'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask about the reviews..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                        className="bg-gray-800 border-gray-600 text-white"
                      />
                      <Button onClick={handleChatSubmit} className="bg-yellow-500 text-black">
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewAnalysis;

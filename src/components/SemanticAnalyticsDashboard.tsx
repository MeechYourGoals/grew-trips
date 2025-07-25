import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  TrendingUp, 
  Search, 
  Brain, 
  Clock, 
  Target,
  Users,
  Zap,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface SemanticAnalytics {
  searchMetrics: {
    totalSearches: number;
    semanticSearches: number;
    keywordSearches: number;
    averageResponseTime: number;
    successRate: number;
    cacheHitRate: number;
  };
  qualityMetrics: {
    relevanceScore: number;
    userSatisfaction: number;
    clickThroughRate: number;
    zeroResultQueries: number;
  };
  performanceMetrics: {
    embeddingGenerationTime: number;
    searchLatency: number;
    cacheEfficiency: number;
    errorRate: number;
  };
  usagePatterns: Array<{
    date: string;
    semanticSearches: number;
    keywordSearches: number;
    hybridSearches: number;
  }>;
  topQueries: Array<{
    query: string;
    frequency: number;
    averageRelevance: number;
    resultCount: number;
  }>;
  tripClusters: Array<{
    name: string;
    tripCount: number;
    commonThemes: string[];
    averageSimilarity: number;
  }>;
}

interface SemanticAnalyticsDashboardProps {
  timeRange?: '24h' | '7d' | '30d' | '90d';
  onTimeRangeChange?: (range: string) => void;
}

export const SemanticAnalyticsDashboard = ({ 
  timeRange = '7d', 
  onTimeRangeChange 
}: SemanticAnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<SemanticAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to get analytics data
      const mockData = await generateMockAnalytics();
      setAnalytics(mockData);
    } catch (error) {
      console.error('Failed to load semantic analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockAnalytics = async (): Promise<SemanticAnalytics> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      searchMetrics: {
        totalSearches: 1247,
        semanticSearches: 892,
        keywordSearches: 355,
        averageResponseTime: 340,
        successRate: 94.3,
        cacheHitRate: 67.8
      },
      qualityMetrics: {
        relevanceScore: 8.7,
        userSatisfaction: 9.1,
        clickThroughRate: 73.5,
        zeroResultQueries: 23
      },
      performanceMetrics: {
        embeddingGenerationTime: 120,
        searchLatency: 85,
        cacheEfficiency: 82.4,
        errorRate: 2.1
      },
      usagePatterns: [
        { date: '2024-01-20', semanticSearches: 145, keywordSearches: 67, hybridSearches: 23 },
        { date: '2024-01-21', semanticSearches: 167, keywordSearches: 54, hybridSearches: 31 },
        { date: '2024-01-22', semanticSearches: 134, keywordSearches: 78, hybridSearches: 18 },
        { date: '2024-01-23', semanticSearches: 189, keywordSearches: 45, hybridSearches: 28 },
        { date: '2024-01-24', semanticSearches: 156, keywordSearches: 62, hybridSearches: 35 },
        { date: '2024-01-25', semanticSearches: 178, keywordSearches: 49, hybridSearches: 22 },
        { date: '2024-01-26', semanticSearches: 123, keywordSearches: 71, hybridSearches: 19 }
      ],
      topQueries: [
        { query: 'flight tickets', frequency: 89, averageRelevance: 9.2, resultCount: 156 },
        { query: 'restaurant recommendations', frequency: 67, averageRelevance: 8.8, resultCount: 234 },
        { query: 'hotel bookings', frequency: 54, averageRelevance: 9.5, resultCount: 89 },
        { query: 'activity suggestions', frequency: 43, averageRelevance: 8.1, resultCount: 167 },
        { query: 'travel documents', frequency: 38, averageRelevance: 9.7, resultCount: 78 }
      ],
      tripClusters: [
        { name: 'Adventure Trips', tripCount: 45, commonThemes: ['hiking', 'outdoor', 'nature'], averageSimilarity: 0.89 },
        { name: 'Cultural Experiences', tripCount: 38, commonThemes: ['museums', 'history', 'art'], averageSimilarity: 0.85 },
        { name: 'Business Travel', tripCount: 67, commonThemes: ['conferences', 'meetings', 'corporate'], averageSimilarity: 0.92 },
        { name: 'Family Vacations', tripCount: 29, commonThemes: ['family', 'kids', 'recreation'], averageSimilarity: 0.78 },
        { name: 'Culinary Tours', tripCount: 23, commonThemes: ['food', 'dining', 'local cuisine'], averageSimilarity: 0.94 }
      ]
    };
  };

  const getMetricColor = (value: number, threshold: { good: number; ok: number }): string => {
    if (value >= threshold.good) return 'text-green-400';
    if (value >= threshold.ok) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (value: number, threshold: { good: number; ok: number }) => {
    if (value >= threshold.good) return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (value >= threshold.ok) return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Semantic Analytics Dashboard</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const pieData = [
    { name: 'Semantic', value: analytics.searchMetrics.semanticSearches, color: '#8b5cf6' },
    { name: 'Keyword', value: analytics.searchMetrics.keywordSearches, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Semantic Analytics Dashboard</h2>
        </div>
        
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <Badge
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => onTimeRangeChange?.(range)}
            >
              {range}
            </Badge>
          ))}
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Searches</p>
                <p className="text-2xl font-bold text-white">{analytics.searchMetrics.totalSearches.toLocaleString()}</p>
              </div>
              <Search className="w-8 h-8 text-blue-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                +12% vs last period
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className={`text-2xl font-bold ${getMetricColor(analytics.searchMetrics.successRate, { good: 90, ok: 80 })}`}>
                  {analytics.searchMetrics.successRate}%
                </p>
              </div>
              {getStatusIcon(analytics.searchMetrics.successRate, { good: 90, ok: 80 })}
            </div>
            <div className="mt-2">
              <Progress value={analytics.searchMetrics.successRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Response Time</p>
                <p className={`text-2xl font-bold ${getMetricColor(500 - analytics.searchMetrics.averageResponseTime, { good: 200, ok: 150 })}`}>
                  {analytics.searchMetrics.averageResponseTime}ms
                </p>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                -23ms improved
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Cache Hit Rate</p>
                <p className={`text-2xl font-bold ${getMetricColor(analytics.searchMetrics.cacheHitRate, { good: 60, ok: 40 })}`}>
                  {analytics.searchMetrics.cacheHitRate}%
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
            <div className="mt-2">
              <Progress value={analytics.searchMetrics.cacheHitRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="bg-gray-800/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="clusters">Trip Clusters</TabsTrigger>
          <TabsTrigger value="queries">Top Queries</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Search Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {pieData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-sm text-gray-300">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Search Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.usagePatterns}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '0.5rem'
                      }}
                    />
                    <Line type="monotone" dataKey="semanticSearches" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="keywordSearches" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Relevance Score</span>
                  <span className="text-green-400 font-medium">{analytics.qualityMetrics.relevanceScore}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">User Satisfaction</span>
                  <span className="text-green-400 font-medium">{analytics.qualityMetrics.userSatisfaction}/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Click-through Rate</span>
                  <span className="text-blue-400 font-medium">{analytics.qualityMetrics.clickThroughRate}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Embedding Gen Time</span>
                  <span className="text-yellow-400 font-medium">{analytics.performanceMetrics.embeddingGenerationTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Search Latency</span>
                  <span className="text-green-400 font-medium">{analytics.performanceMetrics.searchLatency}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Error Rate</span>
                  <span className={analytics.performanceMetrics.errorRate < 5 ? 'text-green-400' : 'text-red-400'}>
                    {analytics.performanceMetrics.errorRate}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Embeddings API</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-300">Search Index</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Cache System</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.tripClusters.map((cluster, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-sm">{cluster.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {cluster.tripCount} trips
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Similarity Score</span>
                      <span className="text-purple-400 font-medium">
                        {Math.round(cluster.averageSimilarity * 100)}%
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Common Themes:</p>
                      <div className="flex flex-wrap gap-1">
                        {cluster.commonThemes.map((theme) => (
                          <Badge key={theme} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-4">
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-sm">Most Popular Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.topQueries.map((query, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{query.query}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-400">
                          {query.frequency} searches
                        </span>
                        <span className="text-xs text-gray-400">
                          {query.resultCount} results
                        </span>
                        <Badge variant="outline" className="text-xs bg-green-500/20 text-green-400">
                          {query.averageRelevance}/10 relevance
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Send, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../hooks/use-toast';
import { useAuth } from '../../hooks/useAuth';

interface Question {
  id: string;
  user_name: string;
  question: string;
  upvotes: number;
  answered: boolean;
  answer?: string;
  answered_by?: string;
  created_at: string;
}

interface LiveQAPanelProps {
  sessionId: string;
  eventId: string;
  userRole?: 'organizer' | 'speaker' | 'attendee';
}

export const LiveQAPanel = ({ sessionId, eventId, userRole = 'attendee' }: LiveQAPanelProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [upvotedQuestions, setUpvotedQuestions] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Mock data for now
    setQuestions([
      {
        id: '1',
        user_name: 'Alice Johnson',
        question: 'What are the main benefits of implementing AI in customer service?',
        upvotes: 15,
        answered: true,
        answer: 'AI can significantly improve response times, provide 24/7 support, and handle routine inquiries efficiently.',
        answered_by: 'Dr. Smith',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        user_name: 'Bob Chen',
        question: 'How can we ensure AI systems remain ethical and unbiased?',
        upvotes: 23,
        answered: false,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        user_name: 'Carol Davis',
        question: 'What skills should developers focus on in the AI era?',
        upvotes: 8,
        answered: false,
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        user_name: 'David Wilson',
        question: 'What are the best practices for implementing machine learning models in production?',
        upvotes: 12,
        answered: true,
        answer: 'Focus on data quality, model monitoring, A/B testing, and gradual rollouts to ensure reliable performance.',
        answered_by: 'Tech Lead',
        created_at: new Date().toISOString()
      }
    ]);
  }, [sessionId]);

  const fetchQuestions = async () => {
    // Mock implementation - will be replaced with real Supabase call
    console.log('Fetching questions for session:', sessionId);
  };

  const submitQuestion = async () => {
    if (!newQuestion.trim()) return;

    // If user is not logged in, get name from prompt
    let userName = user?.email?.split('@')[0] || 'Anonymous';
    if (!user) {
      const name = prompt('Please enter your name to ask a question:');
      if (!name) return;
      userName = name;
    }

    setIsSubmitting(true);
    try {
      // Mock implementation - add to local state
      const newQ: Question = {
        id: Date.now().toString(),
        user_name: userName,
        question: newQuestion.trim(),
        upvotes: 0,
        answered: false,
        created_at: new Date().toISOString()
      };
      
      setQuestions(prev => [newQ, ...prev]);
      setNewQuestion('');
      
      toast({
        title: "Question submitted",
        description: "Your question has been added to the Q&A queue."
      });
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const upvoteQuestion = async (questionId: string) => {
    if (upvotedQuestions.has(questionId)) return;

    try {
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      ));
      setUpvotedQuestions(prev => new Set([...prev, questionId]));
    } catch (error) {
      console.error('Error upvoting question:', error);
    }
  };

  const markAnswered = async (questionId: string, answer: string) => {
    if (userRole !== 'organizer' && userRole !== 'speaker') return;

    try {
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { 
          ...q, 
          answered: true, 
          answer,
          answered_by: user?.email?.split('@')[0] || 'Speaker'
        } : q
      ));
    } catch (error) {
      console.error('Error marking question as answered:', error);
    }
  };

  const canModerate = userRole === 'organizer' || userRole === 'speaker';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare size={24} className="text-glass-orange" />
        <h3 className="text-xl font-bold text-white">Live Q&A</h3>
        <span className="bg-glass-orange/20 text-glass-orange px-2 py-1 rounded-full text-sm">
          {questions.length} questions
        </span>
      </div>

      {/* Submit New Question */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <Textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this session..."
          className="bg-gray-800/50 border-gray-600 text-white mb-3"
          rows={3}
        />
        <Button
          onClick={submitQuestion}
          disabled={!newQuestion.trim() || isSubmitting}
          className="bg-glass-orange hover:bg-glass-orange/80 text-white"
        >
          <Send size={16} className="mr-2" />
          {isSubmitting ? 'Submitting...' : 'Submit Question'}
        </Button>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">{question.user_name}</span>
                  <span className="text-gray-500 text-xs">
                    {new Date(question.created_at).toLocaleTimeString()}
                  </span>
                  {question.answered && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <Check size={12} />
                      Answered
                    </span>
                  )}
                </div>
                <p className="text-white mb-3">{question.question}</p>
                {question.answer && (
                  <div className="bg-glass-orange/10 border border-glass-orange/20 rounded-lg p-3 mt-3">
                    <div className="text-glass-orange text-sm font-medium mb-1">
                      Answer by {question.answered_by}:
                    </div>
                    <p className="text-gray-300">{question.answer}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => upvoteQuestion(question.id)}
                disabled={upvotedQuestions.has(question.id)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  upvotedQuestions.has(question.id)
                    ? 'bg-glass-orange/20 text-glass-orange'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <ThumbsUp size={14} />
                {question.upvotes}
              </button>

              {canModerate && !question.answered && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const answer = prompt('Provide an answer to this question:');
                    if (answer) markAnswered(question.id, answer);
                  }}
                  className="text-glass-orange hover:text-glass-orange/80"
                >
                  Mark as Answered
                </Button>
              )}
            </div>
          </div>
        ))}

        {questions.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No questions yet. Be the first to ask!</p>
          </div>
        )}
      </div>
    </div>
  );
};
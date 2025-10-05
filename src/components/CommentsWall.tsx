
import React, { useState } from 'react';
import { MessageCircle, Heart, Reply, ExternalLink } from 'lucide-react';
import { PollComponent } from './PollComponent';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
  linkUrl?: string;
  linkTitle?: string;
}

export const CommentsWall = () => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Emma',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
      content: 'This place looks amazing! Has anyone been here before?',
      timestamp: '2 hours ago',
      likes: 3,
      linkUrl: 'https://lamijean.fr',
      linkTitle: "L'Ami Jean - Traditional Bistro"
    },
    {
      id: '2',
      author: 'Jake',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      content: 'The reviews are incredible! Definitely adding this to our must-visit list.',
      timestamp: '1 hour ago',
      likes: 5,
      replies: [
        {
          id: '2a',
          author: 'Sarah',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
          content: 'Should we make a reservation now?',
          timestamp: '45 min ago',
          likes: 2
        }
      ]
    }
  ]);

  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      content: newComment,
      timestamp: 'just now',
      likes: 0
    };
    
    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className="p-6 space-y-6 bg-glass-slate-bg min-h-screen">
      {/* Polls Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-glass-enterprise-blue" />
          Group Polls
        </h3>
        <PollComponent />
      </div>

      {/* Comments Section */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-purple-400" />
          Link Comments
        </h3>

        {/* Add Comment */}
        <div className="bg-glass-slate-bg rounded-2xl p-4 mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about the links posted..."
            className="w-full bg-glass-slate-card border border-glass-slate-border rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-glass-enterprise-blue focus:ring-2 focus:ring-glass-enterprise-blue/20 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="bg-gradient-to-r from-glass-enterprise-blue to-glass-enterprise-blue-light hover:from-glass-enterprise-blue-light hover:to-glass-enterprise-blue disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-semibold transition-all shadow-enterprise border border-glass-enterprise-blue/50"
            >
              Post Comment
            </button>
          </div>
        </div>

        {/* Comments List */}
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No comments yet</div>
            <div className="text-gray-400">Start the conversation about the places you're visiting!</div>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-glass-slate-card border border-glass-slate-border rounded-2xl p-6 shadow-enterprise">
                {/* Link Preview */}
                {comment.linkUrl && (
                  <div className="bg-glass-enterprise-blue/10 border border-glass-enterprise-blue/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-glass-enterprise-blue font-medium mb-1">
                      <ExternalLink size={16} />
                      {comment.linkTitle}
                    </div>
                    <a 
                      href={comment.linkUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-glass-enterprise-blue-light text-sm hover:underline break-all"
                    >
                      {comment.linkUrl}
                    </a>
                  </div>
                )}

                {/* Comment Content */}
                <div className="flex gap-3">
                  <img 
                    src={comment.avatar} 
                    alt={comment.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{comment.author}</span>
                      <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-300 mb-3">{comment.content}</p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Heart size={16} />
                        <span className="text-sm">{comment.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-glass-enterprise-blue transition-colors">
                        <Reply size={16} />
                        <span className="text-sm">Reply</span>
                      </button>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3 border-l-2 border-glass-slate-border pl-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <img 
                              src={reply.avatar} 
                              alt={reply.author}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-white text-sm">{reply.author}</span>
                                <span className="text-gray-400 text-xs">{reply.timestamp}</span>
                              </div>
                              <p className="text-gray-300 text-sm mb-2">{reply.content}</p>
                              <button
                                onClick={() => handleLike(reply.id)}
                                className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                              >
                                <Heart size={14} />
                                <span className="text-xs">{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { BarChart3, Plus, X } from 'lucide-react';
import { Button } from './ui/button';

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVote?: string;
}

export const PollComponent = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: '1',
      question: 'Which restaurant should we visit first?',
      options: [
        { id: 'a', text: "L'Ami Jean", votes: 8 },
        { id: 'b', text: 'Breizh Café', votes: 5 },
        { id: 'c', text: 'Le Comptoir du Relais', votes: 12 }
      ],
      totalVotes: 25
    }
  ]);

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(polls.map(poll => {
      if (poll.id === pollId && !poll.userVote) {
        const updatedOptions = poll.options.map(option => 
          option.id === optionId 
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        return {
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          userVote: optionId
        };
      }
      return poll;
    }));
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2) return;

    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollQuestion,
      options: pollOptions
        .filter(opt => opt.trim())
        .map((opt, index) => ({
          id: String.fromCharCode(97 + index),
          text: opt.trim(),
          votes: 0
        })),
      totalVotes: 0
    };

    setPolls([newPoll, ...polls]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setShowCreatePoll(false);
  };

  const addOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updateOption = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = value;
    setPollOptions(updated);
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Poll Button */}
      {!showCreatePoll && (
        <Button
          onClick={() => setShowCreatePoll(true)}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 font-semibold shadow-lg shadow-yellow-500/25 border border-yellow-500/50 text-black"
        >
          <BarChart3 size={20} className="mr-2" />
          Create Poll
        </Button>
      )}

      {/* Create Poll Form */}
      {showCreatePoll && (
        <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Create New Poll</h3>
            <button
              onClick={() => setShowCreatePoll(false)}
              className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Poll Question
              </label>
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="What would you like to ask the group?"
                className="w-full bg-gray-900 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Options
              </label>
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 6 && (
                  <button
                    onClick={addOption}
                    className="w-full h-10 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Option
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                onClick={() => setShowCreatePoll(false)}
                variant="outline"
                className="flex-1 h-10 rounded-lg border-2 border-gray-600 hover:border-gray-500 font-semibold bg-gray-800 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePoll}
                disabled={!pollQuestion.trim() || pollOptions.filter(opt => opt.trim()).length < 2}
                className="flex-1 h-10 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 font-semibold text-black border border-yellow-500/50"
              >
                Create Poll
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Polls */}
      {polls.map((poll) => (
        <div key={poll.id} className="bg-gray-800 border-2 border-gray-700 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">{poll.question}</h3>
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
              const isVoted = poll.userVote === option.id;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(poll.id, option.id)}
                  disabled={!!poll.userVote}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    poll.userVote
                      ? isVoted
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-gray-600 bg-gray-700/50'
                      : 'border-gray-600 hover:border-red-400 hover:bg-red-900/10'
                  } ${!poll.userVote ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">{option.text}</span>
                    {poll.userVote && (
                      <span className="text-sm font-semibold text-gray-400">
                        {option.votes} votes ({percentage.toFixed(0)}%)
                      </span>
                    )}
                  </div>
                  {poll.userVote && (
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {poll.userVote && (
            <p className="text-sm text-gray-400 mt-4 text-center">
              {poll.totalVotes} total votes
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

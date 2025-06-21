import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Poll as PollType } from './poll/types';
import { Poll } from './poll/Poll';
import { CreatePollForm } from './poll/CreatePollForm';

export const PollComponent = () => {
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [polls, setPolls] = useState<PollType[]>([
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

  const handleCreatePoll = (newPoll: PollType) => {
    setPolls([newPoll, ...polls]);
    setShowCreatePoll(false);
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
        <CreatePollForm
          onCreatePoll={handleCreatePoll}
          onCancel={() => setShowCreatePoll(false)}
        />
      )}

      {/* Existing Polls */}
      {polls.map((poll) => (
        <Poll
          key={poll.id}
          poll={poll}
          onVote={handleVote}
        />
      ))}
    </div>
  );
};

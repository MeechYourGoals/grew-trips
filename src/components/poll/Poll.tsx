
import React from 'react';
import { Poll as PollType } from './types';
import { PollOption } from './PollOption';

interface PollProps {
  poll: PollType;
  onVote: (pollId: string, optionId: string) => void;
}

export const Poll = ({ poll, onVote }: PollProps) => {
  const handleVote = (optionId: string) => {
    onVote(poll.id, optionId);
  };

  return (
    <div className="bg-white border border-glass-light-border rounded-2xl p-6 shadow-enterprise">
      <h3 className="text-lg font-semibold text-glass-enterprise-blue mb-4">{poll.question}</h3>
      <div className="space-y-3">
        {poll.options.map((option) => (
          <PollOption
            key={option.id}
            option={option}
            totalVotes={poll.totalVotes}
            userVote={poll.userVote}
            onVote={handleVote}
          />
        ))}
      </div>
      {poll.userVote && (
        <p className="text-sm text-muted-foreground mt-4 text-center">
          {poll.totalVotes} total votes
        </p>
      )}
    </div>
  );
};


import React from 'react';
import { PollOption as PollOptionType } from './types';

interface PollOptionProps {
  option: PollOptionType;
  totalVotes: number;
  userVote?: string;
  onVote: (optionId: string) => void;
}

export const PollOption = ({ option, totalVotes, userVote, onVote }: PollOptionProps) => {
  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
  const isVoted = userVote === option.id;
  
  return (
    <button
      onClick={() => onVote(option.id)}
      disabled={!!userVote}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        userVote
          ? isVoted
            ? 'border-glass-enterprise-blue bg-glass-enterprise-blue/10'
            : 'border-glass-light-border bg-gray-50'
          : 'border-glass-light-border hover:border-glass-enterprise-blue hover:bg-glass-enterprise-blue/5'
      } ${!userVote ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-glass-text-primary">{option.text}</span>
        {userVote && (
          <span className="text-sm font-semibold text-muted-foreground">
            {option.votes} votes ({percentage.toFixed(0)}%)
          </span>
        )}
      </div>
      {userVote && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-glass-enterprise-blue to-glass-accent-orange h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </button>
  );
};

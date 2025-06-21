
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
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        userVote
          ? isVoted
            ? 'border-red-500 bg-red-900/20'
            : 'border-gray-600 bg-gray-700/50'
          : 'border-gray-600 hover:border-red-400 hover:bg-red-900/10'
      } ${!userVote ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-white">{option.text}</span>
        {userVote && (
          <span className="text-sm font-semibold text-gray-400">
            {option.votes} votes ({percentage.toFixed(0)}%)
          </span>
        )}
      </div>
      {userVote && (
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </button>
  );
};


import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Poll } from './types';
import { usePollManager } from '@/hooks/usePollManager';

interface CreatePollFormProps {
  onCreatePoll: (poll: Poll) => void;
  onCancel: () => void;
}

export const CreatePollForm = ({ onCreatePoll, onCancel }: CreatePollFormProps) => {
  const {
    question,
    options,
    setQuestion,
    addOption,
    updateOption,
    removeOption,
    getPollData
  } = usePollManager();

  const handleCreatePoll = () => {
    const pollData = getPollData();
    if (!pollData) return;

    const newPoll: Poll = {
      id: Date.now().toString(),
      question: pollData.question,
      options: pollData.options.map((opt, index) => ({
        id: String.fromCharCode(97 + index),
        text: opt,
        votes: 0
      })),
      totalVotes: 0
    };

    onCreatePoll(newPoll);
  };

  return (
    <div className="bg-white border border-glass-light-border rounded-2xl p-6 shadow-enterprise">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-glass-enterprise-blue">Create New Poll</h3>
        <button
          onClick={onCancel}
          className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-glass-text-primary mb-2">
            Poll Question
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask the group?"
            className="w-full bg-gray-50 border border-glass-light-border rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-glass-enterprise-blue focus:ring-2 focus:ring-glass-enterprise-blue/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-glass-text-primary mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 bg-gray-50 border border-glass-light-border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-glass-enterprise-blue"
                />
                {options.length > 2 && (
                  <button
                    onClick={() => removeOption(index)}
                    className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
            {options.length < 6 && (
              <button
                onClick={addOption}
                className="w-full h-10 border-2 border-dashed border-glass-light-border rounded-lg text-gray-600 hover:border-glass-enterprise-blue hover:text-glass-enterprise-blue transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Option
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-10 rounded-lg border border-glass-light-border hover:border-gray-300 font-semibold bg-white text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreatePoll}
            disabled={!question.trim() || options.filter(opt => opt.text.trim()).length < 2}
            className="flex-1 h-10 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 font-semibold text-black border border-yellow-500/50"
          >
            Create Poll
          </Button>
        </div>
      </div>
    </div>
  );
};

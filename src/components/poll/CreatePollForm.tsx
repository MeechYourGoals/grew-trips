
import React from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { usePollManager } from '@/hooks/usePollManager';

interface CreatePollFormProps {
  onCreatePoll: (question: string, options: string[]) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CreatePollForm = ({ onCreatePoll, onCancel, isSubmitting = false }: CreatePollFormProps) => {
  const {
    question,
    options,
    setQuestion,
    addOption,
    updateOption,
    removeOption,
    getPollData,
    resetForm
  } = usePollManager();

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleCreatePoll = async () => {
    const pollData = getPollData();
    if (!pollData) return;

    await onCreatePoll(pollData.question, pollData.options);
    resetForm();
  };

  return (
    <div className="bg-glass-slate-card border border-glass-slate-border rounded-2xl p-6 shadow-enterprise-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Create New Poll</h3>
        <button
          onClick={handleCancel}
          className="w-8 h-8 rounded-full bg-glass-slate-bg hover:bg-glass-slate-border flex items-center justify-center transition-colors"
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
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What would you like to ask the group?"
            className="w-full bg-glass-slate-bg border border-glass-slate-border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-glass-enterprise-blue focus:ring-2 focus:ring-glass-enterprise-blue/20"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
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
                  className="flex-1 bg-glass-slate-bg border border-glass-slate-border rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-glass-enterprise-blue"
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
                className="w-full h-10 border-2 border-dashed border-glass-slate-border rounded-lg text-gray-400 hover:border-glass-enterprise-blue hover:text-glass-enterprise-blue transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Option
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 h-10 rounded-lg border border-glass-slate-border hover:border-gray-500 font-semibold bg-glass-slate-bg text-white hover:bg-glass-slate-border"
        >
          Cancel
        </Button>
          <Button
            onClick={handleCreatePoll}
            disabled={isSubmitting || !question.trim() || options.filter(opt => opt.text.trim()).length < 2}
            className="flex-1 h-10 rounded-lg bg-gradient-to-r from-glass-enterprise-blue to-glass-enterprise-blue-light hover:from-glass-enterprise-blue-light hover:to-glass-enterprise-blue font-semibold text-white border border-glass-enterprise-blue/50"
          >
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </div>
      </div>
    </div>
  );
};

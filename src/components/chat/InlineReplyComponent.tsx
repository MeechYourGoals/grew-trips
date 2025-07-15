import React from 'react';

interface ReplyData {
  id: string;
  text: string;
  senderName: string;
}

interface InlineReplyComponentProps {
  replyTo?: ReplyData;
  onRemoveReply?: () => void;
}

export const InlineReplyComponent: React.FC<InlineReplyComponentProps> = ({
  replyTo,
  onRemoveReply
}) => {
  if (!replyTo) return null;

  return (
    <div className="bg-gray-800/50 border-l-2 border-blue-500 p-2 mb-2 rounded-r-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Replying to {replyTo.senderName}</p>
          <p className="text-sm text-gray-300 truncate">{replyTo.text}</p>
        </div>
        {onRemoveReply && (
          <button
            onClick={onRemoveReply}
            className="text-gray-500 hover:text-gray-300 ml-2"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
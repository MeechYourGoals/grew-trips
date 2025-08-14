
import React, { useState, useRef } from 'react';
import { Send, MessageCircle, Megaphone, Plus, Image, Video, FileText, Mic, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ChatInputProps {
  inputMessage: string;
  onInputChange: (message: string) => void;
  onSendMessage: (isBroadcast?: boolean) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onFileUpload?: (files: FileList, type: 'image' | 'video' | 'document' | 'audio') => void;
  apiKey: string; // Keep for backward compatibility but won't be used
  isTyping: boolean;
}

export const ChatInput = ({ 
  inputMessage, 
  onInputChange, 
  onSendMessage, 
  onKeyPress, 
  onFileUpload,
  isTyping 
}: ChatInputProps) => {
  const [isBroadcastMode, setIsBroadcastMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    onSendMessage(isBroadcastMode);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      onKeyPress(e);
    }
  };

  const handleFileUpload = (type: 'image' | 'video' | 'document' | 'audio') => {
    if (!onFileUpload || !fileInputRef.current) return;
    
    const accept = {
      image: 'image/*',
      video: 'video/*',
      document: '.pdf,.doc,.docx,.txt,.xlsx,.pptx',
      audio: 'audio/*'
    };
    
    fileInputRef.current.accept = accept[type];
    fileInputRef.current.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        onFileUpload(files, type);
      }
    };
    fileInputRef.current.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && onFileUpload) {
      // Determine file type based on first file
      const file = files[0];
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');
      const type = isImage ? 'image' : isVideo ? 'video' : isAudio ? 'audio' : 'document';
      onFileUpload(files, type);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-3">
      {/* Message Type Toggle */}
      <div className="flex bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setIsBroadcastMode(false)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            !isBroadcastMode 
              ? 'bg-gray-700 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageCircle size={14} />
          Group Chat
        </button>
        <button
          onClick={() => setIsBroadcastMode(true)}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
            isBroadcastMode 
              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Megaphone size={14} />
          Broadcast
        </button>
      </div>

      {/* Message Input */}
      <div 
        className="flex gap-3 items-end"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Attachment Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={() => handleFileUpload('image')}>
              <Image className="w-4 h-4 mr-2" />
              Photo/Image
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload('video')}>
              <Video className="w-4 h-4 mr-2" />
              Video
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload('document')}>
              <FileText className="w-4 h-4 mr-2" />
              Document
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileUpload('audio')}>
              <Mic className="w-4 h-4 mr-2" />
              Audio/Voice
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <textarea
          value={inputMessage}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            isBroadcastMode 
              ? "Send an announcement to all trip members..." 
              : "Type a message or drag & drop files..."
          }
          rows={2}
          className={`flex-1 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none resize-none transition-all ${
            isBroadcastMode
              ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-500/50 focus:border-orange-400'
              : 'bg-gray-800 border-gray-700 focus:border-blue-500'
          }`}
        />
        <button
          onClick={handleSend}
          disabled={!inputMessage.trim() || isTyping}
          className={`text-white p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isBroadcastMode
              ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          <Send size={16} />
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
        />
      </div>
    </div>
  );
};

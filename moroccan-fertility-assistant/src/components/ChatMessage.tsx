import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatMessageProps {
  role: 'user' | 'model';
  content: string;
  attachments?: { url: string; mimeType: string; name: string }[];
}

export function ChatMessage({ role, content, attachments }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full gap-4 p-4 ${isUser ? 'bg-transparent' : 'bg-orange-50/50 rounded-2xl'}`}
      dir="auto"
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-orange-200 text-orange-700' : 'bg-emerald-600 text-white'}`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-medium text-sm text-gray-500">
          {isUser ? 'أنت' : 'المساعد الطبي المغربي'}
        </div>
        
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {attachments.map((att, i) => (
              <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-white">
                {att.mimeType.startsWith('image/') ? (
                  <img src={att.url} alt={att.name} className="h-24 object-cover" />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 text-sm text-gray-700">
                    <span className="truncate max-w-[150px]">{att.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-orange max-w-none text-gray-800 text-base leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
}

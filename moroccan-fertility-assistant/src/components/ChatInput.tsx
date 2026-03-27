import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, Paperclip, X, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatInputProps {
  onSend: (message: string, attachments: File[]) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-MA'; // Moroccan Arabic

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setMessage(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
  }, []);

  const handleSend = () => {
    if ((message.trim() || attachments.length > 0) && !disabled) {
      onSend(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setMessage('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-100 p-4 sticky bottom-0 z-10">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-3"
            >
              {attachments.map((file, i) => (
                <div key={i} className="flex items-center gap-2 bg-orange-50 text-orange-800 px-3 py-1.5 rounded-full text-sm border border-orange-200">
                  {file.type.startsWith('image/') ? <ImageIcon size={14} /> : <FileText size={14} />}
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button onClick={() => removeAttachment(i)} className="hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-end gap-2 bg-gray-50 rounded-3xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-orange-200 focus-within:border-orange-400 transition-all">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-gray-400 hover:text-orange-600 transition-colors rounded-full hover:bg-orange-50"
            disabled={disabled}
            title="إرفاق ملف (صورة أو PDF)"
          >
            <Paperclip size={20} />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*,application/pdf"
          />

          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder={isRecording ? "جاري الاستماع..." : "اكتب سؤالك هنا... (عربية، دارجة، فرنسية، إنجليزية)"}
            className="flex-1 max-h-48 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-gray-800 placeholder-gray-400"
            dir="auto"
            rows={1}
            disabled={disabled}
          />

          {recognitionRef.current && (
            <button
              onClick={toggleRecording}
              className={`p-3 transition-colors rounded-full ${isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'}`}
              disabled={disabled}
              title="تحدث بالصوت"
            >
              <Mic size={20} />
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={disabled || (!message.trim() && attachments.length === 0)}
            className="p-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {disabled ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="rtl:-scale-x-100" />}
          </button>
        </div>
        <div className="text-center mt-2 text-xs text-gray-400">
          يرجى استشارة طبيب مختص للحالات الطبية. هذه المعلومات للتوعية العامة فقط.
        </div>
      </div>
    </div>
  );
}

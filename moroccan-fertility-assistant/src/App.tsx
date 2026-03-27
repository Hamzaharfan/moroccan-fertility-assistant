import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { CycleTracker } from './components/CycleTracker';
import { PregnancyTracker } from './components/PregnancyTracker';
import { sendMessage } from './lib/gemini';
import { motion } from 'motion/react';
import { MessageCircle, CalendarDays, Baby } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  attachments?: { url: string; mimeType: string; name: string }[];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'tracker' | 'pregnancy'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: 'مرحباً بيك! أنا المساعد الطبي المغربي ديالك. أنا هنا باش نعاونك فكل ما يخص تأخر الإنجاب، العقم، ومشاكل الحمل. \n\nيمكن ليك تسولني بالدارجة، العربية، الفرنسية، أو الإنجليزية. نقدر نعطيك نصائح طبية عامة أو وصفات من الطب البديل المغربي (الأعشاب). \n\nكيفاش نقدر نعاونك اليوم؟',
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeTab]);

  const handleSend = async (message: string, files: File[]) => {
    if (!message.trim() && files.length === 0) return;

    // Convert files to base64
    const attachments = await Promise.all(
      files.map(async (file) => {
        return new Promise<{ url: string; mimeType: string; name: string; data: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve({
              url: reader.result as string,
              mimeType: file.type,
              name: file.name,
              data: base64String,
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      attachments: attachments.map(a => ({ url: a.url, mimeType: a.mimeType, name: a.name })),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const responseText = await sendMessage(
        message,
        history,
        attachments.map(a => ({ data: a.data, mimeType: a.mimeType }))
      );

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: responseText,
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: 'عذراً، وقع خطأ أثناء معالجة طلبك. المرجو المحاولة مرة أخرى.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans" dir="rtl">
      <Header />
      
      <div className="bg-white border-b border-gray-200 sticky top-16 z-10 flex justify-center px-4 shadow-sm overflow-x-auto">
        <div className="flex w-full max-w-4xl min-w-max">
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'chat' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <MessageCircle size={18} />
            الدردشة الطبية
          </button>
          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'tracker' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <CalendarDays size={18} />
            تتبع الدورة
          </button>
          <button 
            onClick={() => setActiveTab('pregnancy')} 
            className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 font-medium transition-colors whitespace-nowrap ${activeTab === 'pregnancy' ? 'text-fuchsia-600 border-b-2 border-fuchsia-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <Baby size={18} />
            حاسبة الحمل
          </button>
        </div>
      </div>

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 pb-32">
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} attachments={msg.attachments} />
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-orange-600 p-4"
              >
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {activeTab === 'tracker' && <CycleTracker />}
        
        {activeTab === 'pregnancy' && <PregnancyTracker />}
      </main>

      {activeTab === 'chat' && (
        <div className="fixed bottom-0 left-0 right-0">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { HeartPulse, Info } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
            <HeartPulse size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">المساعد الطبي المغربي</h1>
            <p className="text-xs text-orange-600 font-medium">تأخر الإنجاب، العقم، ومشاكل الحمل</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Info size={16} className="text-blue-500" />
          <span className="hidden sm:inline">نصائح طبية وعشبية</span>
        </div>
      </div>
    </header>
  );
}

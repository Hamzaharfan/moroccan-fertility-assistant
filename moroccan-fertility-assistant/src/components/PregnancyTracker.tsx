import React, { useState, useEffect } from 'react';
import { Baby, ChevronRight, ChevronLeft, Info, Ruler, Weight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { pregnancyWeeks } from '../data/pregnancyData';

const FetusIllustration = ({ week }: { week: number }) => {
  if (week <= 2) {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-fuchsia-300 drop-shadow-sm">
        <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.3" />
        <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
      </svg>
    );
  } else if (week <= 4) {
    return (
      <svg viewBox="0 0 100 100" className="w-24 h-24 text-fuchsia-400 drop-shadow-md">
        <circle cx="50" cy="50" r="25" fill="currentColor" opacity="0.2" />
        <circle cx="45" cy="45" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="55" cy="55" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="45" cy="55" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="55" cy="45" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="50" cy="40" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="50" cy="60" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="40" cy="50" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="60" cy="50" r="6" fill="currentColor" opacity="0.8" />
      </svg>
    );
  } else if (week <= 8) {
    return (
      <svg viewBox="0 0 100 100" className="w-28 h-28 text-fuchsia-400 drop-shadow-md">
        <path d="M60,30 C75,30 80,45 70,55 C60,65 45,70 35,60 C25,50 35,40 45,35 C50,32 55,30 60,30 Z" fill="currentColor" opacity="0.8" />
        <circle cx="62" cy="38" r="2.5" fill="white" />
      </svg>
    );
  } else if (week <= 16) {
    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 text-fuchsia-500 drop-shadow-md">
        {/* Head */}
        <circle cx="65" cy="35" r="14" fill="currentColor" opacity="0.9" />
        {/* Body */}
        <path d="M55,45 C40,45 30,60 35,75 C40,85 55,80 60,70 C65,60 65,50 55,45 Z" fill="currentColor" opacity="0.8" />
        {/* Eye */}
        <circle cx="70" cy="32" r="2" fill="white" />
        {/* Arm */}
        <path d="M55,55 Q45,60 50,65" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
      </svg>
    );
  } else if (week <= 28) {
    return (
      <svg viewBox="0 0 100 100" className="w-40 h-40 text-fuchsia-500 drop-shadow-lg">
        {/* Head */}
        <circle cx="60" cy="35" r="16" fill="currentColor" opacity="0.9" />
        {/* Body */}
        <path d="M48,45 C25,45 20,70 30,85 C40,95 60,85 65,70 C70,55 60,45 48,45 Z" fill="currentColor" opacity="0.85" />
        {/* Eye */}
        <circle cx="66" cy="32" r="2" fill="white" />
        {/* Arm */}
        <path d="M50,55 Q35,60 40,70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Leg */}
        <path d="M40,75 Q25,85 35,90" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.9" />
        {/* Umbilical cord */}
        <path d="M55,65 Q75,70 85,50" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4" strokeDasharray="3 2" />
      </svg>
    );
  } else {
    return (
      <svg viewBox="0 0 100 100" className="w-48 h-48 text-fuchsia-600 drop-shadow-xl" style={{ transform: 'rotate(180deg)' }}>
        {/* Head down */}
        <circle cx="50" cy="25" r="18" fill="currentColor" opacity="0.95" />
        {/* Body */}
        <path d="M35,38 C15,45 15,75 30,90 C45,100 70,95 75,75 C80,55 65,40 35,38 Z" fill="currentColor" opacity="0.9" />
        {/* Eye */}
        <circle cx="56" cy="20" r="2.5" fill="white" />
        {/* Arm */}
        <path d="M40,50 Q25,60 30,75" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.95" />
        {/* Leg */}
        <path d="M45,80 Q30,95 40,100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.95" />
      </svg>
    );
  }
};

export function PregnancyTracker() {
  const [lastPeriod, setLastPeriod] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 2); // Default to roughly 8 weeks pregnant
    return d.toISOString().split('T')[0];
  });
  
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [currentWeek, setCurrentWeek] = useState<number>(1);

  // Calculate Due Date
  const lmpDate = new Date(lastPeriod);
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280); // 40 weeks

  useEffect(() => {
    const today = new Date();
    const diffTime = today.getTime() - lmpDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let week = Math.floor(diffDays / 7) + 1;
    
    if (week < 1) week = 1;
    if (week > 40) week = 40;
    
    setCurrentWeek(week);
    setSelectedWeek(week);
  }, [lastPeriod]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-MA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const weekData = pregnancyWeeks[selectedWeek - 1];

  const handlePrevWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
  };

  const handleNextWeek = () => {
    if (selectedWeek < 40) setSelectedWeek(selectedWeek + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-fuchsia-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Baby className="text-fuchsia-500" />
          حاسبة الحمل ومتابعة الجنين
        </h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تاريخ أول يوم لآخر دورة شهرية
          </label>
          <input 
            type="date" 
            value={lastPeriod}
            onChange={(e) => setLastPeriod(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fuchsia-200 focus:border-fuchsia-500 outline-none transition-all text-gray-800"
          />
        </div>
      </div>

      {/* Due Date Display */}
      <div className="bg-fuchsia-50 p-6 rounded-2xl border border-fuchsia-100 text-center transition-transform hover:scale-[1.01]">
        <h3 className="font-bold text-fuchsia-900 mb-2">موعد الولادة المتوقع</h3>
        <p className="text-fuchsia-700 text-2xl font-bold">{formatDate(dueDate)}</p>
        <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full border border-fuchsia-200 text-fuchsia-800 font-medium text-sm shadow-sm">
          أنتِ الآن في الأسبوع: {currentWeek}
        </div>
      </div>

      {/* Baby Development Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={handlePrevWeek} 
            disabled={selectedWeek === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={24} className="text-gray-600" />
          </button>
          
          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-800">الأسبوع {selectedWeek}</h3>
            {selectedWeek === currentWeek && (
              <span className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-md mt-1 inline-block">
                أسبوعك الحالي
              </span>
            )}
          </div>
          
          <button 
            onClick={handleNextWeek} 
            disabled={selectedWeek === 40}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8" dir="ltr">
          <div 
            className="bg-fuchsia-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(selectedWeek / 40) * 100}%` }}
          ></div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedWeek}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-6"
          >
            {/* Visual Representation */}
            <div className="flex justify-center items-center h-56 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-300 via-transparent to-transparent"></div>
              <FetusIllustration week={selectedWeek} />
            </div>
            
            {/* Measurements */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2">
                <Ruler className="text-fuchsia-500" size={24} />
                <span className="text-sm text-gray-500">الطول التقريبي</span>
                <span className="font-bold text-gray-800" dir="ltr">{weekData.length}</span>
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center gap-2">
                <Weight className="text-fuchsia-500" size={24} />
                <span className="text-sm text-gray-500">الوزن التقريبي</span>
                <span className="font-bold text-gray-800" dir="ltr">{weekData.weight}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 text-gray-700 leading-relaxed text-right">
              {weekData.description}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm border border-blue-100">
        <Info className="shrink-0 mt-0.5 text-blue-500" size={18} />
        <p className="leading-relaxed">
          <strong>ملاحظة هامة:</strong> حساب موعد الولادة يعتمد على دورة منتظمة مدتها 28 يوماً. قد يختلف الموعد الفعلي للولادة، ولا يولد في الموعد المحدد سوى 5% من الأطفال. يرجى المتابعة الدورية مع طبيبك.
        </p>
      </div>
    </motion.div>
  );
}

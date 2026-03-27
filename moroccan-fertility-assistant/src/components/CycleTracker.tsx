import React, { useState } from 'react';
import { Calendar, Droplet, Heart, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

export function CycleTracker() {
  const [lastPeriod, setLastPeriod] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleLength, setCycleLength] = useState<number>(28);

  // Calculations
  const lastPeriodDate = new Date(lastPeriod);
  
  const nextPeriodDate = new Date(lastPeriodDate);
  nextPeriodDate.setDate(lastPeriodDate.getDate() + cycleLength);

  const ovulationDate = new Date(nextPeriodDate);
  ovulationDate.setDate(nextPeriodDate.getDate() - 14);

  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(ovulationDate.getDate() + 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-MA', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="text-orange-500" />
          حاسبة الدورة الشهرية والتبويض
        </h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاريخ أول يوم لآخر دورة شهرية
            </label>
            <input 
              type="date" 
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all text-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              طول الدورة الشهرية (بالأيام)
            </label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="21" 
                max="35" 
                value={cycleLength}
                onChange={(e) => setCycleLength(parseInt(e.target.value))}
                className="flex-1 h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                dir="ltr"
              />
              <span className="font-bold text-orange-600 w-12 text-center bg-orange-50 py-1.5 rounded-lg border border-orange-100">
                {cycleLength}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2" dir="ltr">
              <span>21</span>
              <span>المتوسط 28</span>
              <span>35</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        {/* Next Period */}
        <div className="bg-rose-50 p-5 rounded-2xl border border-rose-100 flex items-start gap-4 transition-transform hover:scale-[1.01]">
          <div className="bg-rose-200 text-rose-600 p-3 rounded-full shrink-0">
            <Droplet size={24} />
          </div>
          <div>
            <h3 className="font-bold text-rose-900">موعد الدورة القادمة المتوقع</h3>
            <p className="text-rose-700 mt-1 text-lg font-medium">{formatDate(nextPeriodDate)}</p>
          </div>
        </div>

        {/* Ovulation */}
        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100 flex items-start gap-4 transition-transform hover:scale-[1.01]">
          <div className="bg-orange-200 text-orange-600 p-3 rounded-full shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <h3 className="font-bold text-orange-900">يوم التبويض المتوقع</h3>
            <p className="text-orange-700 mt-1 text-lg font-medium">{formatDate(ovulationDate)}</p>
            <p className="text-sm text-orange-600/80 mt-1">أعلى فرصة لحدوث الحمل تكون في هذا اليوم</p>
          </div>
        </div>

        {/* Fertile Window */}
        <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex items-start gap-4 transition-transform hover:scale-[1.01]">
          <div className="bg-emerald-200 text-emerald-600 p-3 rounded-full shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900">أيام الخصوبة (نافذة الحمل)</h3>
            <p className="text-emerald-700 mt-1 text-lg font-medium leading-relaxed">
              من {formatDate(fertileStart)} <br/>
              إلى {formatDate(fertileEnd)}
            </p>
            <p className="text-sm text-emerald-600/80 mt-1">ينصح بزيادة فرص اللقاء الزوجي خلال هذه الفترة لزيادة فرص الحمل</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 text-blue-800 text-sm border border-blue-100">
        <Info className="shrink-0 mt-0.5 text-blue-500" size={18} />
        <p className="leading-relaxed">
          <strong>ملاحظة هامة:</strong> هذه الحسابات تقديرية وتعتمد على انتظام الدورة الشهرية. إذا كانت دورتك غير منتظمة، قد لا تكون هذه التواريخ دقيقة 100%. يرجى استشارة طبيبك المتابع لحالتك.
        </p>
      </div>
    </motion.div>
  );
}

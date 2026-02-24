import React from 'react';
import { cn } from '../../lib/utils';

export const DateFilter = ({ selectedDate, onDateSelect }) => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const dateStr = date.toISOString().split('T')[0];

    dates.push({ dayName, dayNum, month, dateStr });
  }

  return (
    <div className="flex justify-start md:justify-center items-center gap-3 py-8 px-4 overflow-x-auto scrollbar-hide w-full max-w-full">
      {dates.map((date) => (
        <button
          key={date.dateStr}
          onClick={() => onDateSelect(date.dateStr)}
          className={cn(
            "flex flex-col items-center justify-center min-w-[85px] h-[110px] rounded-[24px] transition-all duration-500",
            selectedDate === date.dateStr
              ? "bg-[#DAA520] text-black shadow-[0_0_20px_rgba(218,165,32,0.3)]"
              : "bg-[#0A0A0A]/60 hover:bg-white/5 text-foreground border border-white/5 backdrop-blur-md"
          )}
        >
          <span className={cn(
            "text-[11px] font-medium mb-1.5",
            selectedDate === date.dateStr ? "text-black/70" : "text-muted-foreground"
          )}>
            {date.dayName}
          </span>
          <span className={cn(
            "text-2xl font-bold leading-none mb-1.5",
            selectedDate === date.dateStr ? "text-black" : "text-white"
          )}>
            {date.dayNum}
          </span>
          <span className={cn(
            "text-[11px] font-medium",
            selectedDate === date.dateStr ? "text-black/70" : "text-muted-foreground"
          )}>
            {date.month}
          </span>
        </button>
      ))}
    </div>
  );
};

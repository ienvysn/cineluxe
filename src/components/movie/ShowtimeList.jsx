import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Monitor, ChevronRight } from 'lucide-react';
import { showtimes, screens } from '../../data/mockData';
import { cn } from '../../lib/utils';

export const ShowtimeList = ({ movieId, selectedDate }) => {
  const navigate = useNavigate();

  // Filter showtimes for the specific movie and date
  const filteredShowtimes = showtimes.filter(
    (st) => st.movieId === movieId && st.date === selectedDate
  );

  // Group by screen
  const screenIds = [...new Set(filteredShowtimes.map((st) => st.screenId))];

  if (filteredShowtimes.length === 0) {
    return (
      <div className="text-center py-16 px-6 glass-card border-dashed border-white/10 rounded-[32px] animate-fade-in">
        <p className="text-muted-foreground italic font-light">
          No showtimes available for this date. Please select another day to witness the magic.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Select <span className="text-primary italic">Showtime</span>
        </h2>
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
          <Clock className="w-3 h-3 text-primary" />
          Local Cinema Time
        </div>
      </div>

      <div className="grid gap-6">
        {screenIds.map((screenId) => {
          const screen = screens.find((s) => s.id === screenId);
          const screenShowtimes = filteredShowtimes.filter((st) => st.screenId === screenId);

          return (
            <div key={screenId} className="glass-card p-8 group hover:border-primary/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <div className="flex items-center gap-2 text-primary mb-2">
                      <Monitor className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-black tracking-[4px]">{screen?.name}</span>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-1">Experience Excellence</h3>
                   <p className="text-xs text-muted-foreground font-light tracking-wide">Premium visual and audio clarity in every frame.</p>
                </div>

                <div className="flex flex-wrap gap-4">
                  {screenShowtimes.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => navigate(`/booking/${st.id}`)}
                      className="group/time relative px-8 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 flex flex-col items-center gap-1 min-w-[120px]"
                    >
                      <span className="text-2xl font-display font-bold text-white group-hover/time:text-primary transition-colors tracking-tighter">
                        {st.time}
                      </span>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground opacity-60 group-hover/time:opacity-100">
                        Book Now
                      </span>
                      <div className="absolute top-2 right-2 opacity-0 group-hover/time:opacity-100 transition-opacity">
                         <ChevronRight className="w-3 h-3 text-primary" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '../../lib/utils';

export const ComingSoonCard = ({ movie }) => {
  const releaseDate = parseISO(movie.releaseDate);
  const formattedDate = format(releaseDate, 'MMM d, yyyy');

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card/40 border border-white/5 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]">
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[40%] group-hover:grayscale-0"
        />

        {/* Advanced Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-70" />

        {/* Top Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="gold" className="bg-primary/90 backdrop-blur-md shadow-lg">
            Stay Tuned
          </Badge>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {/* Genre */}
          <div className="flex flex-wrap gap-1.5 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-[9px] bg-white/5 border-white/10"
              >
                {g}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-display text-xl font-bold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors duration-300">
            {movie.title}
          </h3>

          {/* Release Date */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground group-hover:text-white transition-colors duration-300">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-widest opacity-60">Releasing on</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Progress Bar (Fake) */}
      <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full overflow-hidden">
        <div className="h-full bg-primary w-1/3 group-hover:w-full transition-all duration-1000 ease-in-out" />
      </div>
    </div>
  );
};

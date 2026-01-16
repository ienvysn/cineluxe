import React from "react";
import { Link } from "react-router-dom";
import { Clock, Star, PlayCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { cn, getPosterUrl } from "../../lib/utils";

export const MovieCard = ({ movie }) => {
  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <Link to={`/movie/${movie.id}`} className="group block h-full">
      <div className="glass-card flex flex-col h-full overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] hover:-translate-y-2 border-white/5 hover:border-primary/20 bg-card/40 backdrop-blur-md">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getPosterUrl(movie.poster)}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

          {/* Top Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="secondary" className="px-2 py-1">
              {movie.rating}
            </Badge>
          </div>



          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
            {movie.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="gold" className="text-[9px] py-0.5 px-2">
                {g}
              </Badge>
            ))}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300 mb-2">
              {movie.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                <span>{movie.language}</span>
              </div>
            </div>
          </div>

          {/* <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
              Book Now
            </span>
            <div className="w-6 h-[1px] bg-primary/30 group-hover:w-12 transition-all duration-500" />
          </div> */}
        </div>
      </div>
    </Link>
  );
};

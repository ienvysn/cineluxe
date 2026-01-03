import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Star, Calendar, Percent } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

export const MovieHero = ({ movie, pricing, isDiscountDay }) => {
  const navigate = useNavigate();

  const formatDuration = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  return (
    <section className="relative pt-20">
      {/* Background Backdrop */}
      <div className="absolute inset-0 h-[600px] md:h-[700px] overflow-hidden">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover opacity-30 blur-[80px] scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-4 pt-12 relative z-10">
        <Button
          variant="glass"
          onClick={() => navigate(-1)}
          className="mb-10 group bg-white/5 border-white/10 hover:border-primary/50 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Gallery
        </Button>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Movie Poster */}
          <div className="w-full md:w-[350px] mx-auto lg:mx-0 flex-shrink-0 animate-fade-in">
            <div className="relative glass-card overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border-white/10 group">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Movie Metadata */}
          <div className="flex-1 py-4 animate-slide-up">
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genre.map((g, index) => (
                <Badge
                  key={g}
                  variant="gold"
                  className="px-3 py-1 scale-100 hover:scale-110 transition-transform duration-300"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {g}
                </Badge>
              ))}
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tighter">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-muted-foreground mb-10 font-medium tracking-wide bg-white/5 w-fit px-6 py-4 rounded-2xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <span>{formatDuration(movie.duration)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="w-5 h-5 fill-primary" />
                </div>
                <span>{movie.rating}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <span>{movie.language}</span>
              </div>
            </div>

            <div className="space-y-6 max-w-2xl">
              <h3 className="font-display text-xl font-bold text-primary uppercase tracking-[3px]">Synopsis</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-light italic">
                "{movie.synopsis}"
              </p>
            </div>

            {isDiscountDay && (
              <div className="mt-10 inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-success/10 border border-success/20 animate-pulse-slow">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-success">
                  <Percent className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-success font-bold text-lg uppercase tracking-tight">Luxury Offer</span>
                  <span className="text-success/80 text-sm">
                    Enjoy {pricing.discountPercent}% off your booking today. Excellence at a privilege.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

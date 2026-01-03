import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movies, pricing } from '../data/mockData';
import { MovieHero } from '../components/movie/MovieHero';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <span className="text-4xl">🎬</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          The cinematic experience you are looking for has either moved or never existed.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const isDiscountDay = () => {
    const date = new Date(selectedDate);
    return pricing.discountDays.includes(date.getDay());
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <MovieHero
        movie={movie}
        pricing={pricing}
        isDiscountDay={isDiscountDay()}
      />

      {/* Showtimes Placeholder (On Hold) */}
      <section className="container mx-auto px-4 py-20">
        <div className="glass-card p-12 text-center border-dashed border-white/10 opacity-50">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Service Update</span>
          </div>
          <h2 className="font-display text-3xl font-bold mb-4 italic">Showtimes on Hold</h2>
          <p className="text-muted-foreground max-w-md mx-auto font-light leading-relaxed">
            The booking engine and showtime scheduler are currently undergoing maintenance to enhance your experience. Please check back shortly for the final curtain call.
          </p>
        </div>
      </section>
    </div>
  );
};

export default MovieDetail;

import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { movieService } from "../services/movieService";
import { useEffect } from "react";
import { MovieHero } from "../components/movie/MovieHero";
import { ShowtimeList } from "../components/movie/ShowtimeList";
import { DateFilter } from "../components/movies/DateFilter";
import { getPosterUrl } from "../lib/utils";
import { pricingService } from "../services/pricingService";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(
    location.state?.date || today,
  );
  const [movie, setMovie] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieData, pricingData] = await Promise.all([
          movieService.getMovieById(id),
          pricingService.getPricing()
        ]);

        if (movieData) setMovie(movieData);
        if (pricingData) setPricing(pricingData);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  if (isLoading && !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <span className="text-4xl">🎬</span>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">
          Movie Not Found
        </h2>
        <p className="text-muted-foreground mb-8 text-center max-w-sm">
          The cinematic experience you are looking for has either moved or never
          existed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-transform"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const isDiscountDay = () => {
    if (!pricing || !pricing.discountDays) return false;
    const date = new Date(selectedDate);
    return pricing.discountDays.includes(date.getDay());
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-32">
      <MovieHero
        movie={{ ...movie, poster: getPosterUrl(movie.poster) }}
        pricing={pricing}
        isDiscountDay={isDiscountDay()}
      />

      <div className="container mx-auto px-4 -mt-10 relative z-20 overflow-hidden">
        {/* Date Selection Control */}
        <div className="flex flex-col items-center mb-16 w-full max-w-full overflow-hidden">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6 shadow-2xl">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[3px] text-primary">
              Select Viewing Date
            </span>
          </div>
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Showtimes Section */}
        <div className="max-w-6xl mx-auto">
          <ShowtimeList movieId={movie.id} selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

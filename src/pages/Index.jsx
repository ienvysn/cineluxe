import React, { useState, useEffect } from "react";
import { DateFilter } from "../components/movies/DateFilter";
import { MovieCard } from "../components/movies/MovieCard";
import { ComingSoonCard } from "../components/movies/ComingSoonCard";
import { movies, showtimes, comingSoonMovies } from "../data/mockData";
import { Sparkles, Calendar, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const Index = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter movies that have showtimes on the selected date
  const availableMovieIds = new Set(
    showtimes.filter((st) => st.date === selectedDate).map((st) => st.movieId)
  );

  const filteredMovies = movies.filter((movie) =>
    availableMovieIds.has(movie.id)
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden min-h-[70vh] flex items-center">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />

        <div className="container mx-auto relative z-10">
          <div
            className={`max-w-4xl transition-all duration-1000 transform ${
              isLoaded
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >


            <h1 className="font-display text-5xl md:text-8xl font-bold mb-6 leading-[1.1] tracking-tight text-white">
              Elevating the <br />
              <span className="text-gold-gradient">Cinematic Art</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-light">
              Immerse yourself in unrivaled luxury. From curated world cinema to
              the latest blockbusters, experience every frame in its finest
              form.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 -mt-20 relative z-20">
        {/* Floating Date Filter */}
        <div className="flex justify-center mb-16">
          <DateFilter
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Movies Grid */}
        <section className="mb-32">
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
              {filteredMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 glass-card border-dashed border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <p className="text-2xl font-display font-semibold text-foreground italic">
                Dark Today, Bright Tomorrow
              </p>
              <p className="text-muted-foreground mt-3 max-w-sm mx-auto font-light">
                We don't have showtimes scheduled for this date yet. Try
                selecting another date to find your next masterpiece.
              </p>
              <Button
                variant="goldOutline"
                className="mt-8"
                onClick={() => setSelectedDate(today)}
              >
                Reset to Today
              </Button>
            </div>
          )}
        </section>

        {/* Coming Soon Section */}
        <section className="pb-32">
          <div className="flex items-end justify-between mb-12 px-2">
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">
                  The Future of Cinema
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Coming <span className="text-gold-gradient italic">Soon</span>
              </h2>
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:text-white group hidden sm:flex"
            >
              View All Releases{" "}
              <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="relative px-2">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-6">
                {comingSoonMovies.map((movie) => (
                  <CarouselItem
                    key={movie.id}
                    className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ComingSoonCard movie={movie} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="hidden xl:block">
                <CarouselPrevious className="-left-16" />
                <CarouselNext className="-right-16" />
              </div>
            </Carousel>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-black py-16 px-4 border-t border-white/10">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
                  <span className="font-display font-bold text-black italic">
                    CL
                  </span>
                </div>
                <span className="font-display text-3xl font-bold tracking-tighter">
                  Cine<span className="text-primary">Luxe</span>
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm font-light leading-relaxed">
                Defining the standard of excellence in cinematic experiences.
                Join our exclusive community and redefine how you watch movies.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg font-bold mb-6 text-white">
                Quick Links
              </h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Now Showing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Coming Soon
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Membership
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Private Hire
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-display text-lg font-bold mb-6 text-white">
                Contact
              </h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">London, UK</li>
                <li className="flex items-center gap-2">
                  concierge@cineluxe.vip
                </li>
                <li className="flex items-center gap-2">0800 LUXE CINEMA</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-[2px]">
            <p>© 2024 CineLuxe. Crafted for the Connoisseur.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

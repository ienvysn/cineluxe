import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { User, Ticket, Film } from 'lucide-react';

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shadow-lg">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            Cine<span className="text-primary">Luxe</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Now Showing
          </Link>
          <Link to="/coming-soon" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Coming Soon
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/bookings">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/5">
              <Ticket className="w-4 h-4" />
              <span className="hidden sm:inline">My Bookings</span>
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="goldOutline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

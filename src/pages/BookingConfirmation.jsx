import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { CheckCircle, Calendar, Clock, MapPin, Ticket, Copy, Download, Share2 } from 'lucide-react';
import { toast } from 'sonner';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
          <Ticket className="w-10 h-10 text-muted-foreground opacity-20" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">No Reservation Found</h2>
        <p className="text-muted-foreground mb-8 max-w-sm font-light">
          We couldn't find your booking details. Your journey starts at the gallery.
        </p>
        <Link to="/">
          <Button variant="gold" size="xl" className="px-10">Return to Gallery</Button>
        </Link>
      </div>
    );
  }

  const { bookingId, pin, movie, showtime, screen, seats, total, paymentMethod } = bookingData;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} Copied`, {
      description: "The identifier is now in your clipboard.",
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Cinematic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-[120px] -z-10 animate-glow-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-xl animate-fade-in">
        <div className="glass-card overflow-hidden border-white/5 shadow-2xl">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-success/20 via-success/5 to-transparent p-10 text-center relative">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-success/20 flex items-center justify-center shadow-xl border border-success/30 group">
              <CheckCircle className="w-12 h-12 text-success group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-success">Transaction Successful</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-2">
              Reservation <span className="text-success italic">Confirmed</span>
            </h1>
            <p className="text-muted-foreground font-light text-lg">
              Your cinematic journey is reserved and ready.
            </p>
          </div>

          {/* Booking Details */}
          <div className="p-10 space-y-10 relative">
            {/* Booking ID & PIN Area */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-white/10 transition-all duration-300">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2 font-bold">Booking Reference</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-lg font-bold text-white tracking-tighter">{bookingId}</p>
                  <button onClick={() => copyToClipboard(bookingId, 'Booking ID')} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 group hover:border-primary/40 transition-all duration-300">
                <p className="text-[10px] text-primary uppercase tracking-widest mb-2 font-bold">Gate Access PIN</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-3xl font-black text-primary tracking-tighter">{pin}</p>
                  <button onClick={() => copyToClipboard(pin, 'PIN')} className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                    <Copy className="w-4 h-4 text-primary/70 group-hover:text-primary transition-colors" />
                  </button>
                </div>
              </div>
            </div>

            {/* Movie Info Visual */}
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              <div className="relative flex-shrink-0 group">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-32 h-44 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 group-hover:ring-primary/30 transition-all" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-3xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  {movie.title}
                </h2>
                <div className="grid grid-cols-1 gap-y-3 font-medium text-muted-foreground">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm">{formatDate(showtime.date)}</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-sm">{showtime.time}</span>
                  </div>
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm">{screen.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seats Visualization */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white">Your Selection</p>
                </div>
                <span className="text-xs text-muted-foreground">{seats.length} Seats Assigned</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {seats.map((seat) => (
                  <span key={seat} className="px-4 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm font-black tracking-tight">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="flex justify-between items-center py-6 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold">Total Consideration</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-white/5 border-white/10 text-[9px] uppercase">{paymentMethod}</Badge>
                </div>
              </div>
              <p className="text-4xl font-black text-primary tracking-tighter">NPR {total}</p>
            </div>

            {/* Important Notes */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <p className="font-bold text-primary text-xs uppercase tracking-widest mb-4">Final Instructions</p>
              <ul className="space-y-3 text-sm text-muted-foreground font-light leading-relaxed">
                <li className="flex items-start gap-3 italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  Kindly present this digital confirmation or the Gate Access PIN at the entrance.
                </li>
                <li className="flex items-start gap-3 italic">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  To ensure complete immersion, we recommend arrival 15 minutes prior to showtime.
                </li>
              </ul>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-10 pt-0 flex flex-col sm:flex-row gap-4">
            <Link to="/bookings" className="flex-1">
              <Button variant="gold" size="xl" className="w-full">
                My Bookings
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="glass" size="xl" className="w-full">
                New Experience
              </Button>
            </Link>
          </div>

          {/* Functional Icons bar */}
          <div className="px-10 pb-10 flex justify-center gap-8">
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">
              <Share2 className="w-4 h-4" /> Share Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

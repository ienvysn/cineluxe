import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Copy,
  Download,
  Share2,
  Loader2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const bookingData = location.state;

  useEffect(() => {
    // Simulate payment verification/ticket issuance
    const timer = setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mb-8">
          <AlertCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tighter uppercase italic">Session Expired</h2>
        <p className="text-muted-foreground mb-10 max-w-sm font-light leading-relaxed italic">
          The cinematic experience could not be verified. Your journey starts back at the premiere gallery.
        </p>
        <Link to="/">
          <Button variant="gold" size="xl" className="px-10 rounded-2xl group">
            Revisit Gallery <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="relative">
           <div className="w-32 h-32 rounded-full border-2 border-primary/20 animate-[spin_3s_linear_infinite]" />
           <div className="w-32 h-32 rounded-full border-t-2 border-primary absolute inset-0 animate-spin" />
           <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-pulse" />
           </div>
        </div>
        <h2 className="text-xl font-display font-bold text-white mt-8 tracking-widest uppercase italic animate-pulse">
           Issuing <span className="text-primary italic">Digital Assets</span>
        </h2>
        <p className="text-muted-foreground text-[10px] uppercase font-bold tracking-[4px] mt-4 opacity-50">
           Verifying secure transaction node...
        </p>
      </div>
    );
  }

  const { bookingId, pin, movie, showtime, screen, seats, total, paymentMethod } = bookingData;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} Copied`, {
      description: "Identifier secured in clipboard.",
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-20 relative overflow-hidden animate-fade-in">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-xl">
        <div className="glass-card overflow-hidden border-white/5 shadow-2xl bg-gradient-to-b from-white/[0.05] to-transparent rounded-[32px]">
          {/* Header */}
          <div className="p-10 text-center border-b border-white/5">
            <div className="w-20 h-20 mx-auto mb-6 rounded-[28px] bg-success/20 flex items-center justify-center shadow-lg border border-success/30 group animate-slide-up">
              <CheckCircle className="w-10 h-10 text-success group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4 animate-slide-up">
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-success">Order Finalized</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-white mb-2 italic tracking-tighter">
              Reservation <span className="text-success">Confirmed</span>
            </h1>
            <p className="text-muted-foreground font-light text-md opacity-70 italic">
              Your assets are prepared. We await your presence.
            </p>
          </div>

          <div className="p-10 space-y-8 relative">
            {/* Core Info Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer" onClick={() => copyToClipboard(bookingId, 'Booking ID')}>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-2 font-bold opacity-50">Reference ID</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm font-bold text-white">{bookingId}</p>
                  <Copy className="w-3 h-3 text-muted-foreground" />
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all cursor-pointer" onClick={() => copyToClipboard(pin, 'Access PIN')}>
                <p className="text-[9px] text-primary uppercase tracking-widest mb-2 font-bold opacity-70 italic">Gate Access PIN</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-2xl font-black text-primary tracking-tight">{pin}</p>
                  <Copy className="w-4 h-4 text-primary/40" />
                </div>
              </div>
            </div>

            {/* Movie Info Visual */}
            <div className="flex gap-6 items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl shadow-2xl border border-white/10"
              />
              <div className="flex-1">
                <h2 className="font-display text-2xl font-bold text-white mb-3 italic tracking-tight uppercase">
                  {movie.title}
                </h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span>{formatDate(showtime.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3 text-primary" />
                    <span className="font-display font-medium text-white italic">{showtime.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selection Grid Summary */}
            <div className="space-y-4">
               <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                     <Ticket className="w-4 h-4 text-primary" />
                     <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Seats Issued</p>
                  </div>
                  <span className="text-[10px] font-black text-white px-2 py-0.5 rounded-md bg-primary/20 border border-primary/20">{seats.length} Tickets</span>
               </div>
               <div className="flex flex-wrap gap-2">
                 {seats.map((seat) => (
                   <span key={seat} className="px-4 py-2 bg-white/5 border border-white/5 hover:border-primary/30 transition-colors rounded-xl text-xs font-bold font-mono text-white">
                     {seat}
                   </span>
                 ))}
               </div>
            </div>

            {/* Final Financial Row */}
            <div className="flex justify-between items-end pt-6 border-t border-white/5">
              <div className="space-y-1">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold opacity-50 italic">Total Consideration</p>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit">
                   <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                   <span className="text-[9px] uppercase font-bold text-success/80 tracking-widest">{paymentMethod}</span>
                </div>
              </div>
              <p className="text-4xl font-display font-black text-white italic tracking-tighter uppercase">NPR {total.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-10 pt-4 flex flex-col sm:flex-row gap-4">
            <Link to="/bookings" className="flex-1">
              <Button variant="gold" size="xl" className="w-full h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold">
                My Bookings
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button variant="outline" size="xl" className="w-full h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold border-white/10 bg-white/5">
                New Experience
              </Button>
            </Link>
          </div>

          <div className="px-10 pb-10 flex justify-center gap-8 border-t border-white/5 pt-8">
            <button className="flex items-center gap-2 text-[9px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">
              <Download className="w-3 h-3" /> Save PDF
            </button>
            <button className="flex items-center gap-2 text-[9px] text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest">
              <Share2 className="w-3 h-3" /> Share Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

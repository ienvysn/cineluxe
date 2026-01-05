import React, { useState } from 'react';
import { CheckCircle, XCircle, Search, Ticket, AlertTriangle, ShieldCheck, ShieldAlert, Fingerprint, Scan, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { movies, screens, showtimes } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';


const mockBookings = [
  {
    id: 'BK12345',
    movieId: '1',
    showtimeId: '1-screen-1-2024-12-03-14:00',
    seats: ['E5', 'E6', 'E7'],
    totalAmount: 900,
    status: 'confirmed',
    pin: '7834',
    createdAt: new Date().toISOString(),
    userId: 'user1',
    checkedIn: false,
  },
  {
    id: 'BK12346',
    movieId: '2',
    showtimeId: '2-screen-2-2024-12-03-17:00',
    seats: ['D8', 'D9'],
    totalAmount: 600,
    status: 'confirmed',
    pin: '2156',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: 'user2',
    checkedIn: true,
  },
  {
    id: 'BK12347',
    movieId: '3',
    showtimeId: '3-screen-1-2024-12-02-20:00',
    seats: ['F10'],
    totalAmount: 300,
    status: 'cancelled',
    pin: '9421',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    userId: 'user3',
    checkedIn: false,
  },
];

const AdminValidate = () => {
  const [bookingId, setBookingId] = useState('');
  const [pin, setPin] = useState('');
  const [validationResult, setValidationResult] = useState('idle');
  const [foundBooking, setFoundBooking] = useState(null);
  const [bookings, setBookings] = useState(mockBookings);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = () => {
    if (!bookingId.trim() || !pin.trim()) {
      toast.error('Details Missing', {
        description: 'Please enter both Booking ID and PIN.',
      });
      return;
    }

    setIsValidating(true);


    setTimeout(() => {
      const booking = bookings.find(
        (b) => b.id.toLowerCase() === bookingId.toLowerCase() && b.pin === pin
      );

      if (!booking) {
        setValidationResult('invalid');
        setFoundBooking(null);
        toast.error('No Match Found', {
          description: 'We couldn\'t find a booking with those details.',
        });
      } else if (booking.status === 'cancelled') {
        setValidationResult('cancelled');
        setFoundBooking(booking);
        toast.warning('Cancelled Booking', {
          description: 'This booking was cancelled and cannot be used.',
        });
      } else if (booking.checkedIn) {
        setValidationResult('checked-in');
        setFoundBooking(booking);
        toast.info('Already Checked In', {
          description: 'This ticket has already been used for entry.',
        });
      } else {
        setValidationResult('valid');
        setFoundBooking(booking);
        toast.success('Valid Ticket', {
          description: 'Ticket is valid. You can now check them in.',
        });
      }

      setIsValidating(false);
    }, 1000);
  };

  const handleCheckIn = () => {
    if (!foundBooking) return;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === foundBooking.id ? { ...b, checkedIn: true } : b
      )
    );

    setFoundBooking({ ...foundBooking, checkedIn: true });
    setValidationResult('checked-in');

    toast.success('Check-in Successful', {
      description: `Booking ${foundBooking.id} is now checked in.`,
    });
  };

  const handleReset = () => {
    setBookingId('');
    setPin('');
    setValidationResult('idle');
    setFoundBooking(null);
  };

  const getResultDisplay = () => {
    switch (validationResult) {
      case 'valid':
        return {
          icon: ShieldCheck,
          iconColor: 'text-emerald-500',
          bgColor: 'bg-emerald-500/5',
          borderColor: 'border-emerald-500/20',
          title: 'Valid Ticket',
          message: 'This ticket is valid and ready for entry.',
        };
      case 'invalid':
        return {
          icon: ShieldAlert,
          iconColor: 'text-rose-500',
          bgColor: 'bg-rose-500/5',
          borderColor: 'border-rose-500/20',
          title: 'Invalid Ticket',
          message: 'No booking found with these details.',
        };
      case 'checked-in':
        return {
          icon: AlertTriangle,
          iconColor: 'text-amber-500',
          bgColor: 'bg-amber-500/5',
          borderColor: 'border-amber-500/20',
          title: 'Already Used',
          message: 'This ticket has already been used to check in.',
        };
      case 'cancelled':
        return {
          icon: XCircle,
          iconColor: 'text-rose-500',
          bgColor: 'bg-rose-500/5',
          borderColor: 'border-rose-500/20',
          title: 'Cancelled',
          message: 'This booking was previously cancelled.',
        };
      default:
        return null;
    }
  };

  const resultDisplay = getResultDisplay();

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="text-center">
         <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[4px] text-primary font-bold">Ticket Check</span>
          </div>
        <h1 className="font-display text-6xl font-bold tracking-tighter italic">
          Verify <span className="text-gold-gradient">Tickets</span>
        </h1>
        <p className="text-muted-foreground mt-4 font-light text-xl max-w-2xl mx-auto">Check-in customers by their Booking ID and PIN.</p>
      </div>

      <div className="max-w-2xl mx-auto w-full">

        <div className="glass-card p-10 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-6 opacity-5">
              <Scan className="w-32 h-32" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 relative z-10">
              <div className="md:col-span-3 space-y-3">
                 <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Booking ID</Label>
                 <Input
                    placeholder="e.g. BK12345"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    className="h-16 bg-white/5 border-white/5 rounded-2xl text-2xl font-mono font-bold px-6 focus:border-primary/40 transition-all shadow-xl"
                 />
              </div>
              <div className="md:col-span-2 space-y-3">
                 <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">PIN</Label>
                 <Input
                    placeholder="7834"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
                    maxLength={4}
                    className="h-16 bg-white/5 border-white/5 rounded-2xl text-2xl font-mono font-bold px-6 text-center tracking-[10px] shadow-xl"
                 />
              </div>
           </div>

           <div className="flex gap-4 relative z-10">
              <Button
                 variant="gold"
                 size="xl"
                 onClick={handleValidate}
                 disabled={isValidating}
                 className="flex-1 h-16 rounded-2xl shadow-2xl uppercase tracking-[4px] text-xs font-bold group"
              >
                 {isValidating ? (
                   <span className="flex items-center gap-3">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Checking...
                   </span>
                 ) : (
                   <span className="flex items-center gap-3">
                      <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Check Ticket
                   </span>
                 )}
              </Button>
              {validationResult !== 'idle' && (
                 <Button variant="outline" size="xl" onClick={handleReset} className="h-16 px-8 rounded-2xl border-white/10 uppercase tracking-widest text-[10px] font-bold">
                    Clear
                 </Button>
              )}
           </div>
        </div>


        {validationResult !== 'idle' && resultDisplay && (
          <div
            className={cn(
              'mt-10 p-10 rounded-[32px] border-2 animate-scale-in relative overflow-hidden',
              resultDisplay.bgColor,
              resultDisplay.borderColor
            )}
          >
            <div className="flex items-start gap-6 mb-10 relative z-10">
               <div className={cn('p-4 rounded-2xl bg-black/20 shadow-xl border border-white/5', resultDisplay.iconColor)}>
                  <resultDisplay.icon className="w-10 h-10" />
               </div>
               <div>
                  <h3 className="text-3xl font-display font-bold tracking-tight mb-2">{resultDisplay.title}</h3>
                  <p className="text-muted-foreground font-light text-lg italic leading-relaxed">{resultDisplay.message}</p>
               </div>
            </div>

            {foundBooking && (
              <div className="space-y-6 relative z-10">
                {(() => {
                  const movie = movies.find((m) => m.id === foundBooking.movieId);
                  const showtime = showtimes.find((s) => s.id === foundBooking.showtimeId);
                  const screen = showtime ? screens.find((s) => s.id === showtime.screenId) : null;

                  return (
                    <>
                      <div className="flex flex-col md:flex-row gap-8 p-8 bg-black/40 rounded-[32px] border border-white/5 shadow-inner">
                        <img
                          src={movie?.poster}
                          alt={movie?.title}
                          className="w-28 h-40 object-cover rounded-2xl shadow-2xl border border-white/10"
                        />
                        <div className="flex-1 flex flex-col justify-center">
                           <div className="flex items-center gap-2 mb-2">
                              <Badge variant="goldOutline" className="px-3 py-0.5 text-[8px] font-bold uppercase tracking-widest">{screen?.name || 'Screen'}</Badge>
                           </div>
                           <h4 className="font-display text-4xl font-bold text-white italic tracking-tighter mb-2">{movie?.title || 'Unknown Movie'}</h4>
                           <div className="flex items-center gap-4 text-muted-foreground">
                              <span className="text-sm font-medium">{showtime?.date && format(new Date(showtime.date), 'MMM dd, yyyy')}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                               <span className="text-xl font-bold italic text-primary">{showtime?.time || '--:--'}</span>
                           </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="p-6 rounded-[24px] bg-black/20 border border-white/5 flex flex-col gap-2">
                            <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-black">Booking ID</span>
                            <span className="text-xl font-mono font-bold text-white italic">{foundBooking.id}</span>
                         </div>
                         <div className="p-6 rounded-[24px] bg-black/20 border border-white/5 flex flex-col gap-2">
                             <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold">Seats</span>
                            <div className="flex flex-wrap gap-2">
                              {foundBooking.seats.map((seat) => (
                                <span
                                  key={seat}
                                  className="px-3 py-1 rounded-lg bg-primary/20 text-primary font-black uppercase text-[10px] tracking-widest border border-primary/20"
                                >
                                  {seat}
                                </span>
                              ))}
                            </div>
                         </div>
                      </div>


                      {validationResult === 'valid' && !foundBooking.checkedIn && (
                        <div className="pt-4">
                           <Button
                              variant="gold"
                              size="xl"
                              onClick={handleCheckIn}
                              className="w-full h-20 rounded-[28px] shadow-2xl animate-glow-pulse"
                           >
                              <CheckCircle className="w-8 h-8 mr-4" />
                              <span className="flex flex-col items-start leading-none">
                                 <span className="text-[10px] uppercase font-bold tracking-[4px] mb-1">Check In</span>
                                 <span className="text-xl font-bold tracking-tight italic">Confirm Arrival</span>
                              </span>
                           </Button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {validationResult === 'idle' && (
          <div className="mt-10 text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px]">
            <Scan className="w-16 h-16 text-muted-foreground/10 mx-auto mb-4" />
            <p className="text-muted-foreground italic text-sm">Enter booking details above to verify tickets.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminValidate;

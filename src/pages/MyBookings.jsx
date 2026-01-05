import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Clock, MapPin, Ticket, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';

// Mock bookings data
const mockBookings = [
  {
    id: 'BK12345',
    pin: '7834',
    movie: {
      title: 'Oppenheimer',
      poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    },
    date: '2024-12-15',
    time: '17:00',
    screen: 'Screen 1',
    seats: ['D5', 'D6', 'D7'],
    total: 750,
    status: 'confirmed',
    createdAt: '2024-12-10',
  },
  {
    id: 'BK12346',
    pin: '4521',
    movie: {
      title: 'Dune: Part Two',
      poster: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    },
    date: '2024-12-18',
    time: '20:00',
    screen: 'IMAX',
    seats: ['F8', 'F9'],
    total: 600,
    status: 'confirmed',
    createdAt: '2024-12-11',
  },
];

const MyBookings = () => {
  const [bookings] = useState(mockBookings);

  const upcomingBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = [];
  const cancelledBookings = [];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const canCancel = (dateStr, time) => {
    const showDate = new Date(`${dateStr}T${time}`);
    const now = new Date();
    const hoursUntilShow = (showDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilShow > 2;
  };

  const BookingCard = ({ booking }) => (
    <div className="group relative overflow-hidden rounded-3xl bg-card/40 border border-white/5 backdrop-blur-md transition-all duration-500 hover:border-primary/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">

      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Ticket className="w-32 h-32 rotate-12" />
      </div>

      <div className="flex flex-col sm:flex-row gap-6 p-6">

        <div className="w-full sm:w-32 flex-shrink-0 relative">
          <img
            src={booking.movie.poster}
            alt={booking.movie.title}
            className="w-full aspect-[2/3] object-cover rounded-2xl shadow-xl"
          />
          <Badge variant="gold" className="absolute -top-2 -right-2 px-2 py-1 shadow-lg">
            {booking.status === 'confirmed' ? 'Valid' : booking.status}
          </Badge>
        </div>

        {/* Info Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display text-2xl font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {booking.movie.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{booking.time}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{booking.screen}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover:text-white/80 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all duration-500">
                    <Ticket className="w-4 h-4" />
                  </div>
                  <span className="truncate font-medium">{booking.seats.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Booking ID</span>
              <span className="font-mono text-sm text-foreground">{booking.id}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-primary mb-1 font-bold">Access PIN</span>
              <span className="font-mono text-xl text-primary font-black tracking-tighter">{booking.pin}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Action */}
      <div className="flex items-center justify-between p-6 bg-white/[0.02] border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold">Premium Ticket</span>
          <span className="text-2xl font-black text-white">NPR {booking.total}</span>
        </div>
        {booking.status === 'confirmed' && canCancel(booking.date, booking.time) ? (
          <Button variant="ghost" size="sm" className="text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors font-bold uppercase tracking-widest text-[10px]">
            Void Ticket
          </Button>
        ) : (
          <Button disabled variant="outline" size="sm" className="opacity-30 border-white/10 text-[10px] uppercase tracking-widest">
            Non-Refundable
          </Button>
        )}
      </div>
    </div>
  );

  const EmptyState = ({ message }) => (
    <div className="text-center py-24 glass-card border-dashed border-white/10 max-w-2xl mx-auto">
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8 animate-pulse">
        <AlertCircle className="w-12 h-12 text-muted-foreground opacity-20" />
      </div>
      <h3 className="font-display text-2xl font-bold mb-3 italic">Quiet as a Closed Theater</h3>
      <p className="text-muted-foreground max-w-sm mx-auto font-light mb-10 leading-relaxed text-lg italic">
        {message}
      </p>
      <Link to="/">
        <Button variant="gold" size="xl" className="px-12 group">
          Browse Now Showing <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-20">
      <div className="container mx-auto px-4 py-12 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary/3 rounded-full blur-[100px] -z-10" />

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Personal Collections</span>
            </div>
            <h1 className="font-display text-5xl font-bold tracking-tighter">
              My <span className="text-gold-gradient italic">Bookings</span>
            </h1>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="w-full max-w-md gold-outline-tabs mb-12">
            <TabsTrigger value="upcoming" className="flex-1">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">Past</TabsTrigger>
            <TabsTrigger value="cancelled" className="flex-1">Voided</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length > 0 ? (
              <div className="grid gap-8 lg:grid-cols-2">
                {upcomingBookings.map((booking, index) => (
                  <div key={booking.id} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                    <BookingCard booking={booking} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="The stage is empty. No upcoming masterclasses or blockbusters are scheduled in your account." />
            )}
          </TabsContent>

          <TabsContent value="past">
            <EmptyState message="Your highlights are currently empty. Revisit the classics and book a new experience." />
          </TabsContent>

          <TabsContent value="cancelled">
            <EmptyState message="All tickets are in order. No voided or cancelled bookings found in your records." />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MyBookings;

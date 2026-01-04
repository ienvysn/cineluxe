import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Ticket, TrendingUp, CheckCircle2, XCircle, Clock, Wallet, ArrowUpRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { movies, screens, showtimes } from '../../data/mockData';
import { cn } from '../../lib/utils';

// Mock bookings data - ensure these work even if showtimes IDs change dynamically
const mockBookings = [
  {
    id: 'BK12345',
    movieId: '1',
    showtimeId: '1-screen-1-2024-12-03-14:00', // Example ID
    seats: ['E5', 'E6', 'E7'],
    totalAmount: 900,
    status: 'confirmed',
    pin: '7834',
    createdAt: new Date().toISOString(),
    userId: 'user1',
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
  },
];

const AdminBookings = () => {
  const [bookings] = useState(mockBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [movieFilter, setMovieFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pin.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesMovie = movieFilter === 'all' || booking.movieId === movieFilter;
    return matchesSearch && matchesStatus && matchesMovie;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="goldOutline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Movie', 'Date', 'Time', 'Seats', 'Amount', 'Status'];
    const rows = filteredBookings.map((booking) => {
      const movie = movies.find((m) => m.id === booking.movieId);
      const showtime = showtimes.find((s) => s.id === booking.showtimeId);
      return [
        booking.id,
        movie?.title || 'N/A',
        showtime?.date || 'N/A',
        showtime?.time || 'N/A',
        booking.seats.join(', '),
        `NPR ${booking.totalAmount}`,
        booking.status,
      ];
    });

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Booking Logs</span>
            </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Manage <span className="text-gold-gradient italic">Bookings</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">View and manage all customer movie bookings.</p>
        </div>
        <Button variant="outline" onClick={handleExportCSV} className="h-14 px-8 rounded-2xl border-white/10 hover:bg-white/5 transition-all text-muted-foreground hover:text-white font-bold uppercase tracking-widest text-[10px]">
          <Download className="w-4 h-4 mr-3" />
          Download CSV
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Bookings', value: bookings.length, icon: TrendingUp, color: 'text-white' },
          { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, icon: CheckCircle2, color: 'text-emerald-500' },
          { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length, icon: XCircle, color: 'text-rose-500' },
          { label: 'Total Revenue', value: `NPR ${bookings.filter((b) => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}`, icon: Wallet, color: 'text-primary' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 group relative overflow-hidden hover:border-primary/20 transition-all">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <stat.icon className="w-16 h-16" />
             </div>
             <p className="text-[10px] uppercase tracking-[3px] text-muted-foreground font-bold mb-3">{stat.label}</p>
             <p className={cn("text-3xl font-display font-bold tracking-tight", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[28px]">
        <div className="flex-1 min-w-[300px] relative">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
           <Input
              placeholder="Search by Booking ID or PIN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 h-14 bg-transparent border-white/5 rounded-2xl"
           />
        </div>

        <div className="flex items-center gap-3">
           <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-14 bg-transparent border-white/5 rounded-2xl">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
           </Select>

           <Select value={movieFilter} onValueChange={setMovieFilter}>
              <SelectTrigger className="w-48 h-14 bg-transparent border-white/5 rounded-2xl">
                <SelectValue placeholder="Movie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Movies</SelectItem>
                {movies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id}>{movie.title}</SelectItem>
                ))}
              </SelectContent>
           </Select>
        </div>
      </div>

      {/* Bookings List Table */}
      <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-[3px] font-bold text-muted-foreground">
                <th className="text-left p-8">Booking ID</th>
                <th className="text-left p-8">Movie</th>
                <th className="text-left p-8">Date & Time</th>
                <th className="text-left p-8">Seats</th>
                <th className="text-left p-8">Amount</th>
                <th className="text-left p-8">Status</th>
                <th className="text-right p-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => {
                const movie = movies.find((m) => m.id === booking.movieId);
                const showtime = showtimes.find((s) => s.id === booking.showtimeId);
                return (
                  <tr key={booking.id} className="group hover:bg-white/[0.03] transition-colors">
                    <td className="p-8">
                       <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-white group-hover:text-primary transition-colors">{booking.id}</span>
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">PIN: {booking.pin}</span>
                       </div>
                    </td>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <img
                          src={movie?.poster}
                          alt={movie?.title}
                          className="w-10 h-14 object-cover rounded-xl border border-white/10"
                        />
                        <span className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">{movie?.title || 'Unknown Movie'}</span>
                      </div>
                    </td>
                    <td className="p-8">
                      {showtime ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white">{format(new Date(showtime.date), 'MMM dd, yyyy')}</span>
                          <span className="text-sm font-bold text-primary">{showtime.time}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">N/A</span>
                      )}
                    </td>
                    <td className="p-8">
                      <div className="flex flex-wrap gap-1.5 max-w-[120px]">
                        {booking.seats.map((seat) => (
                          <span key={seat} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-muted-foreground">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-8 font-bold text-white italic">NPR {booking.totalAmount}</td>
                    <td className="p-8">{getStatusBadge(booking.status)}</td>
                    <td className="p-8 text-right">
                      <button
                        onClick={() => { setSelectedBooking(booking); setIsDetailDialogOpen(true); }}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-white"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={7} className="p-32 text-center text-muted-foreground italic">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-white/5 bg-[#070707] shadow-2xl p-0 overflow-hidden">
          {selectedBooking && (
             <>
               <div className="bg-[#0A0A0A] p-10 border-b border-white/5 flex flex-col md:flex-row items-center gap-8">
                  <img
                    src={movies.find(m => m.id === selectedBooking.movieId)?.poster}
                    alt="Poster"
                    className="w-32 h-48 object-cover rounded-[32px] shadow-2xl border border-white/10"
                  />
                  <div className="flex-1 text-center md:text-left">
                      <h3 className="text-4xl font-display font-bold text-white mb-2 italic tracking-tighter">
                        {movies.find(m => m.id === selectedBooking.movieId)?.title}
                      </h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
                        <span className="flex items-center gap-2 text-sm"><CalendarIcon className="w-4 h-4 text-primary" /> {showtimes.find(s => s.id === selectedBooking.showtimeId)?.date && format(new Date(showtimes.find(s => s.id === selectedBooking.showtimeId).date), 'MMM dd, yyyy')}</span>
                        <span className="flex items-center gap-2 text-sm font-bold text-primary"><Clock className="w-4 h-4" /> {showtimes.find(s => s.id === selectedBooking.showtimeId)?.time}</span>
                      </div>
                  </div>
               </div>

               <div className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { label: 'Booking ID', value: selectedBooking.id },
                       { label: 'PIN', value: selectedBooking.pin },
                       { label: 'Seats', value: selectedBooking.seats.join(', ') },
                       { label: 'Status', value: selectedBooking.status, badge: true },
                       { label: 'Total Paid', value: `NPR ${selectedBooking.totalAmount}` },
                       { label: 'Booked On', value: format(new Date(selectedBooking.createdAt), 'MMM dd, yyyy HH:mm') },
                     ].map((item, i) => (
                       <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground">{item.label}</span>
                          {item.badge ? getStatusBadge(item.value) : <span className="text-white font-medium">{item.value}</span>}
                       </div>
                     ))}
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                     <Button variant="gold" onClick={() => setIsDetailDialogOpen(false)} className="px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]">
                        Close
                     </Button>
                  </div>
               </div>
             </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Ticket,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Wallet,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../../components/ui/dialog";
import { cn, getPosterUrl } from "../../lib/utils";
import { bookingService } from "../../services/bookingService";
import { toast } from "sonner";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [movieFilter, setMovieFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [totalBookings, setTotalBookings] = useState(0);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    confirmedCount: 0,

    totalBookings: 0
  });

  const limit = 10;

  useEffect(() => {
    fetchBookings();
  }, [currentPage]);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await bookingService.getAll({ page: currentPage, limit });
      if (data && data.bookings) {
        setBookings(data.bookings);
        setTotalPages(data.totalPages);
        setTotalBookings(data.totalBookings);

        if (data.stats) {
            setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Error fetching bookings");
    } finally {
      setIsLoading(false);
    }
  };


  const uniqueMovies = Array.from(
    new Map(
      bookings
        .filter((b) => b.showtime?.movie)
        .map((b) => [b.showtime.movie.id, b.showtime.movie])
    ).values()
  );

  const getBookingStatus = (booking) => {
    if (booking.status === 'completed' || booking.isUsed) return 'Watched';


    if (!booking.showtime || !booking.showtime.date || !booking.showtime.time) return 'Booked';

    const showtimeDate = new Date(`${booking.showtime.date}T${booking.showtime.time}`);
    const now = new Date();
    // 3 hours buffer for movie duration
    const movieEnd = new Date(showtimeDate.getTime() + 3 * 60 * 60 * 1000);

    if (now > movieEnd) return 'No-show';
    return 'Booked';
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.pin.includes(searchQuery) ||
      booking.guestEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || getBookingStatus(booking) === statusFilter;

    const matchesMovie =
      movieFilter === "all" || booking.showtime?.movieId === movieFilter;

    return matchesSearch && matchesStatus && matchesMovie;
  });



  const getStatusBadge = (booking) => {
    const status = getBookingStatus(booking);

    switch (status) {
      case "Booked":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1"
          >
            Booked
          </Badge>
        );

      case "Watched":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1"
          >
            Watched
          </Badge>
        );
      case "No-show":
        return (
           <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20 font-bold uppercase text-[9px] tracking-widest px-3 py-1"
          >
            No-show
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Bookings",
            value: stats.totalBookings,
            icon: TrendingUp,
            color: "text-white",
          },
          {
            label: "Confirmed",
            value: stats.confirmedCount,
            icon: CheckCircle2,
            color: "text-emerald-500",
          },

          {
            label: "Total Revenue",
            value: `NPR ${Number(stats.totalRevenue).toLocaleString()}`,
            icon: Wallet,
            color: "text-primary",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-card p-8 group relative overflow-hidden hover:border-primary/20 transition-all"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="text-[10px] uppercase tracking-[3px] text-muted-foreground font-bold mb-3">
              {stat.label}
            </p>
            <p
              className={cn(
                "text-3xl font-display font-bold tracking-tight",
                stat.color
              )}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[28px]">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by Booking ID, PIN or Email..."
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
              <SelectItem value="Booked">Booked</SelectItem>
              <SelectItem value="Watched">Watched</SelectItem>
              <SelectItem value="No-show">No-show</SelectItem>

            </SelectContent>
          </Select>

          <Select value={movieFilter} onValueChange={setMovieFilter}>
            <SelectTrigger className="w-48 h-14 bg-transparent border-white/5 rounded-2xl">
              <SelectValue placeholder="Movie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Movies</SelectItem>
              {uniqueMovies.map((movie) => (
                <SelectItem key={movie.id} value={movie.id}>
                  {movie.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-[#0A0A0A] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[10px] uppercase tracking-[3px] font-bold text-muted-foreground">
                <th className="text-left p-8">Booking Number</th>
                <th className="text-left p-8">Movie</th>
                <th className="text-left p-8">Date & Time</th>
                <th className="text-left p-8">Seats</th>
                <th className="text-left p-8">Amount</th>
                <th className="text-left p-8">Status</th>
                <th className="text-right p-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => {
                  const movie = booking.showtime?.movie;
                  const showtime = booking.showtime;

                  return (
                    <tr
                      key={booking.id}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="p-8">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-bold text-white group-hover:text-primary transition-colors">
                            {(booking.bookingNumber || booking.id).substring(0, 10)}
                          </span>
                          <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
                            PIN: {booking.pin}
                          </span>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="flex items-center gap-4">
                          <img
                            src={getPosterUrl(movie?.poster)}
                            alt={movie?.title}
                            className="w-10 h-14 object-cover rounded-xl border border-white/10"
                          />
                          <span className="font-display text-base font-bold text-white group-hover:text-primary transition-colors">
                            {movie?.title || "Unknown Movie"}
                          </span>
                        </div>
                      </td>
                      <td className="p-8">
                        {showtime ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-white">
                              {format(new Date(showtime.date), "MMM dd, yyyy")}
                            </span>
                            <span className="text-sm font-bold text-primary">
                              {showtime.time?.substring(0, 5) || showtime.time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-sm">
                            N/A
                          </span>
                        )}
                      </td>
                      <td className="p-8">
                        <div className="flex flex-wrap gap-1.5 max-w-[120px]">
                          {booking.seats?.map((seat) => (
                            <span
                              key={seat}
                              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-muted-foreground"
                            >
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-8 font-bold text-white italic">
                        NPR {Number(booking.totalAmount).toLocaleString()}
                      </td>
                      <td className="p-8">{getStatusBadge(booking)}</td>
                      <td className="p-8 text-right">
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setIsDetailDialogOpen(true);
                          }}
                          className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-muted-foreground hover:text-white"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-32 text-center text-muted-foreground italic"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-4">
          <div className="text-sm text-muted-foreground">
            Showing page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span> ({totalBookings} total bookings)
          </div>
          <div className="flex gap-4">
            <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="border-white/10 hover:bg-white/5"
            >
                Previous
            </Button>
            <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border-white/10 hover:bg-white/5"
            >
                Next
            </Button>
          </div>
      </div>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-white/5 bg-[#070707] shadow-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Booking Details</DialogTitle>
          {selectedBooking && selectedBooking.showtime && selectedBooking.showtime.movie && (
            <>
              <div className="bg-[#0A0A0A] p-10 border-b border-white/5 flex flex-col md:flex-row items-center gap-8">
                <img
                  src={getPosterUrl(selectedBooking.showtime.movie.poster)}
                  alt="Poster"
                  className="w-32 h-48 object-cover rounded-[32px] shadow-2xl border border-white/10"
                />
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-4xl font-display font-bold text-white mb-2 italic tracking-tighter">
                    {selectedBooking.showtime.movie.title}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground">
                    <span className="flex items-center gap-2 text-sm">
                      <CalendarIcon className="w-4 h-4 text-primary" />{" "}
                      {format(new Date(selectedBooking.showtime.date), "MMM dd, yyyy")}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Clock className="w-4 h-4" />{" "}
                      {selectedBooking.showtime.time?.substring(0, 5) || selectedBooking.showtime.time}
                    </span>
                    <span className="flex items-center gap-2 text-sm">
                         <Badge variant="outline" className="border-white/10">{selectedBooking.showtime.screen?.name}</Badge>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Booking ID", value: selectedBooking.id },
                    { label: "PIN", value: selectedBooking.pin },
                    { label: "Seats", value: selectedBooking.seats.join(", ") },
                    {
                      label: "Status",
                      value: selectedBooking.status,
                      badge: true,
                    },
                    {
                      label: "Total Paid",
                      value: `NPR ${Number(selectedBooking.totalAmount).toLocaleString()}`,
                    },
                    {
                      label: "Booked On",
                      value: format(
                        new Date(selectedBooking.createdAt),
                        "MMM dd, yyyy HH:mm"
                      ),
                    },
                    {
                        label: "Payment Method",
                        value: selectedBooking.paymentMethod,
                    },
                    {
                        label: "User",
                        value: selectedBooking.guestEmail ? `Guest (${selectedBooking.guestEmail})` : 'Registered User',
                    }
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1"
                    >
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">
                        {item.label}
                      </span>
                      {item.badge ? (
                        getStatusBadge(selectedBooking)
                      ) : (
                        <span className="text-white font-medium">
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="gold"
                    onClick={() => setIsDetailDialogOpen(false)}
                    className="px-10 h-14 rounded-2xl font-bold uppercase tracking-widest text-[10px]"
                  >
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

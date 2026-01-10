import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Info,
  Armchair,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  Monitor,
  Wallet,
  ArrowRight,
  Ticket,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { showtimes, movies, screens, pricing } from "../data/mockData";
import { cn } from "../lib/utils";
import { toast } from "sonner";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const showtime = showtimes.find((st) => st.id === id);
  const movie = showtime ? movies.find((m) => m.id === showtime.movieId) : null;
  const screen = showtime
    ? screens.find((s) => s.id === showtime.screenId)
    : null;

  useEffect(() => {
    // Simulate loading for premium feel
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  //   if (!showtime || !movie || !screen) {
  //     return (
  //       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
  //         <h2 className="text-2xl font-display font-bold text-white mb-4">Showtime Not Found</h2>
  //         <Button onClick={() => navigate('/')} variant="gold">Return Home</Button>
  //       </div>
  //     );
  //   }

  const rows = "ABCDEFGHIJ".split("").slice(0, screen.rows);
  const seats = Array.from({ length: screen.seatsPerRow }, (_, i) => i + 1);

  const isDiscountDay = () => {
    const date = new Date(showtime.date);
    return pricing.discountDays.includes(date.getDay());
  };

  const getSeatPrice = (row) => {
    const basePrice =
      row === "A" || row === "B" ? pricing.frontRow : pricing.normal;
    if (isDiscountDay()) {
      return basePrice * (1 - pricing.discountPercent / 100);
    }
    return basePrice;
  };

  const toggleSeat = (seatId) => {
    if (
      showtime.bookedSeats.includes(seatId) ||
      showtime.heldSeats.includes(seatId)
    )
      return;

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const totalAmount = selectedSeats.reduce((sum, seatId) => {
    return sum + getSeatPrice(seatId.charAt(0));
  }, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error("No Seats Selected", {
        description: "Please select at least one seat to continue.",
      });
      return;
    }

    navigate("/booking/payment", {
      state: {
        showtimeId: id,
        selectedSeats,
        totalAmount,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#030303] text-foreground pb-20 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <div className="hidden md:block">
              <h2 className="text-lg font-bold text-white leading-tight font-display">
                {movie.title}
              </h2>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3 h-3 text-primary" /> {screen.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1 font-display italic text-primary">
                  {showtime.time}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                Total Amount
              </p>
              <p className="text-xl font-display font-bold text-primary italic">
                NPR {totalAmount.toLocaleString()}
              </p>
            </div>
            <Button
              variant="gold"
              size="lg"
              className="rounded-xl px-8 h-12 uppercase tracking-widest text-[10px] font-bold shadow-lg"
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="w-full max-w-2xl mb-20 relative">
              <div className="h-2 bg-gradient-to-b from-primary/40 to-transparent rounded-full shadow-[0_-10px_30px_rgba(218,165,32,0.3)]" />
              <p className="text-center text-[10px] uppercase tracking-[8px] text-muted-foreground mt-4 font-bold">
                Screen This Way
              </p>
            </div>

            <div className="relative overflow-x-auto pb-8 w-full flex justify-center custom-scrollbar">
              <div className="flex flex-col gap-3 min-w-fit px-4">
                {rows.map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <span className="w-6 text-[10px] font-bold text-muted-foreground uppercase text-center">
                      {row}
                    </span>
                    <div className="flex gap-2.5">
                      {seats.map((seat) => {
                        const seatId = `${row}${seat}`;
                        const isBooked = showtime.bookedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isBooked}
                            className={cn(
                              "w-8 h-8 md:w-10 md:h-10 rounded-xl transition-all duration-300 relative group flex items-center justify-center",
                              isBooked
                                ? "bg-white/[0.03] text-white/5 cursor-not-allowed border border-white/5"
                                : isSelected
                                ? "bg-primary text-black shadow-lg shadow-primary/20 scale-110 border-primary"
                                : "bg-white/5 border border-white/10 text-muted-foreground hover:border-primary/50 hover:bg-primary/5"
                            )}
                          >
                            <Armchair
                              className={cn(
                                "w-4 h-4 md:w-5 md:h-5",
                                isSelected ? "fill-current" : ""
                              )}
                            />
                            {!isBooked && (
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black border border-white/10 rounded-lg text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                Seat {seatId} - NPR {getSeatPrice(row)}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <span className="w-6 text-[10px] font-bold text-muted-foreground uppercase text-center">
                      {row}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-8 mt-12 p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Available
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/20">
                  <Armchair className="w-3 h-3" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Occupied
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-primary shadow-lg shadow-primary/20" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                  Selected
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card p-8 border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                <Ticket className="w-24 h-24" />
              </div>

              <h3 className="text-xl font-display font-bold text-white mb-6 italic tracking-tight flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Selection Details
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>
                    {format(new Date(showtime.date), "EEEE, MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-display font-bold text-white italic">
                    {showtime.time}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Monitor className="w-4 h-4 text-primary" />
                  <span>{screen.name}</span>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    Selected Seats
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    {selectedSeats.length > 0
                      ? selectedSeats.join(", ")
                      : "None"}
                  </span>
                </div>
                {isDiscountDay() && (
                  <div className="flex justify-between items-center text-success">
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Weekday Offer
                    </span>
                    <Badge variant="success" className="text-[9px] px-2">
                      -{pricing.discountPercent}%
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            <div className="glass-card p-8 bg-primary/5 border-primary/20 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Wallet className="w-5 h-5" />
                <span className="text-[10px] uppercase tracking-[4px] font-black">
                  Summary
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {selectedSeats.map((seatId) => (
                  <div
                    key={seatId}
                    className="flex justify-between items-center text-sm font-light"
                  >
                    <span className="text-muted-foreground">
                      Seat {seatId} (
                      {seatId.charAt(0) === "A" || seatId.charAt(0) === "B"
                        ? "Front"
                        : "Standard"}
                      )
                    </span>
                    <span className="text-white font-medium">
                      NPR {getSeatPrice(seatId.charAt(0))}
                    </span>
                  </div>
                ))}
                {selectedSeats.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">
                    No seats selected yet.
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-primary/20 flex justify-between items-end">
                <div>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-widest mb-1">
                    Total Payable
                  </p>
                  <p className="text-4xl font-display font-black text-white italic tracking-tighter">
                    NPR {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
              <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5" />
              <p className="text-[10px] text-blue-300/80 leading-relaxed font-light italic">
                Your selection is temporarily held. Complete payment within 10
                minutes to secure your tickets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  Wallet,
  ArrowRight,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { cn, getPosterUrl } from "../lib/utils";
import { toast } from "sonner";
import { bookingService } from "../services/bookingService";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { showtimeId, selectedSeats, totalAmount, movie, showtime, screen } =
    location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [walletVendor, setWalletVendor] = useState("esewa");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showtimeId || !selectedSeats || !movie || !showtime || !screen) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-display font-bold text-white mb-4">
          Payment Session Expired
        </h2>
        <Button onClick={() => navigate("/")} variant="gold">
          Return Home
        </Button>
      </div>
    );
  }

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const token = localStorage.getItem("cineluxe_token");
      console.log(token);
      const bookingData = {
        showtimeId,
        seats: selectedSeats,
        totalAmount,
        paymentMethod:
          paymentMethod === "card" ? "CARD" : walletVendor.toUpperCase(),
        //   userId: user.id || null,
      };

      const response = await bookingService.create(bookingData, token);

      setTimeout(() => {
        toast.success("Payment Successful", {
          description: "Your cinematic experience is confirmed.",
        });

        navigate("/booking/success", {
          state: {
            bookingId: response.id,
            bookingNumber: response.bookingNumber,
            pin: response.pin,
            movie,
            showtime,
            screen,
            seats: selectedSeats,
            total: totalAmount,
            paymentMethod:
              paymentMethod === "card"
                ? "Credit Card"
                : walletVendor.toUpperCase(),
          },
        });
        setIsProcessing(false);
      }, 1500);
    } catch (error) {
      console.error("Booking failed:", error.message);
      toast.error("Booking Failed", {
        description:
          error.message || "Could not process your booking. Please try again.",
      });
      setIsProcessing(false);
    }
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
            <div>
              <h2 className="text-lg font-bold text-white leading-tight font-display tracking-tight">
                Secure <span className="text-primary italic">Checkout</span>
              </h2>

            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Payment Form Area */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h3 className="text-xl font-display font-bold text-white mb-2 italic">
                Select Payment <span className="text-primary">Method</span>
              </h3>
              <p className="text-muted-foreground text-sm font-light italic">
                Choose your preferred way to settle the transaction.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: "wallet", label: "Wallet", icon: Wallet },
                { id: "card", label: "Credit Card", icon: CreditCard },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={cn(
                    "flex items-center gap-4 p-6 rounded-3xl border transition-all duration-300",
                    paymentMethod === method.id
                      ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/20",
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      paymentMethod === method.id
                        ? "bg-primary text-black"
                        : "bg-white/5",
                    )}
                  >
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs uppercase font-bold tracking-widest">
                    {method.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="glass-card p-10 border-white/5 relative overflow-hidden transition-all duration-500 min-h-[400px]">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                {paymentMethod === "card" ? (
                  <Lock className="w-32 h-32" />
                ) : (
                  <Smartphone className="w-32 h-32" />
                )}
              </div>

              <form
                onSubmit={handlePayment}
                className="space-y-8 relative z-10"
              >
                {paymentMethod === "card" ? (
                  <div className="space-y-6 animate-fade-in">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                        Cardholder Name
                      </Label>
                      <Input
                        placeholder="JOHN DOE"
                        className="h-14 bg-white/5 border-white/5 rounded-2xl"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                        Card Number
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="•••• •••• •••• ••••"
                          className="h-14 bg-white/5 border-white/5 rounded-2xl pl-12"
                          required
                        />
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                          Expiry Date
                        </Label>
                        <Input
                          placeholder="MM/YY"
                          className="h-14 bg-white/5 border-white/5 rounded-2xl"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                          CVV
                        </Label>
                        <Input
                          placeholder="•••"
                          className="h-14 bg-white/5 border-white/5 rounded-2xl"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { id: "esewa", name: "eSewa", color: "bg-[#60bb46]" },
                        { id: "paypal", name: "PayPal", color: "bg-[#003087]" },
                      ].map((vendor) => (
                        <button
                          type="button"
                          key={vendor.id}
                          onClick={() => setWalletVendor(vendor.id)}
                          className={cn(
                            "relative aspect-video rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden",
                            walletVendor === vendor.id
                              ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                              : "border-white/5 bg-white/5 hover:bg-white/10",
                          )}
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white font-black italic",
                              vendor.color,
                            )}
                          >
                            {vendor.name[0]}
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            {vendor.name}
                          </span>
                          {walletVendor === vendor.id && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 text-center">
                      <Fingerprint className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                      <p className="text-xs text-muted-foreground italic leading-relaxed">
                        You'll be redirected to secure{" "}
                        {walletVendor === "esewa" ? "eSewa" : "PayPal"} gateway
                        for authentication.
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="gold"
                  size="xl"
                  className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-2xl group mt-4 overflow-hidden relative"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-3">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Secure Interaction...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      Pay NPR {totalAmount.toLocaleString()} via{" "}
                      {paymentMethod === "card"
                        ? "Card"
                        : walletVendor.toUpperCase()}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Booking Summary Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-8 border-white/10 shadow-2xl">
              <h3 className="text-xl font-display font-bold text-white mb-8 italic flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Review Order
              </h3>

              <div className="flex gap-6 mb-8">
                <img
                  src={getPosterUrl(movie?.poster)}
                  className="w-20 h-28 object-cover rounded-2xl border border-white/10 shadow-xl"
                  alt={movie?.title}
                />
                <div className="flex-1 flex flex-col justify-center">
                  <p className="font-display text-2xl font-bold text-white tracking-tighter italic">
                    {movie?.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-white/5 rounded-full w-fit">
                    <span>
                      {showtime.time?.substring(0, 5) || showtime.time}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                    <span>{showtime.date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-sm font-light">
                  <span className="text-muted-foreground">
                    Seats ({selectedSeats.length})
                  </span>
                  <span className="text-white font-medium uppercase tracking-widest">
                    {selectedSeats.join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm font-light">
                  <span className="text-muted-foreground">
                    Gateway Provider
                  </span>
                  <span className="text-primary font-bold uppercase tracking-widest text-xs">
                    {paymentMethod === "card" ? "Visa/Master" : walletVendor}
                  </span>
                </div>
                <div className="pt-8 flex justify-between items-end">
                  <p className="text-[10px] uppercase font-bold text-primary tracking-[4px]">
                    Final Amount
                  </p>
                  <p className="text-4xl font-display font-black text-white italic tracking-tighter">
                    NPR {totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-success/5 border border-success/20 flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
              <p className="text-[10px] text-success/80 leading-relaxed font-light italic">
                Your selection is temporarily held. Complete payment within 10
                minutes to secure your seats in the cinema hall.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

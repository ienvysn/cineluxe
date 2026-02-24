import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Film, Mail, Lock, ShieldCheck, ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordSchema } from "../lib/schemas";
import { apiCall } from "../../api";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email },
  });

  const onSubmit = async (data) => {
    try {
      await apiCall("POST", "/users/reset-password", { data });
      toast.success("Password reset successful!", {
        description: "You can now sign in with your new password.",
      });
      navigate("/auth");
    } catch (error) {
      console.error("Reset error:", error);
      toast.error("Reset Failed", {
        description: error.message || "Invalid or expired reset code",
      });
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <Film className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-2xl font-display font-bold mb-4">Invalid Session</h2>
        <p className="text-muted-foreground mb-8">Please go back and request a new reset code.</p>
        <Button variant="gold" onClick={() => navigate("/auth")}>
          Back to Authentication
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center mb-8 shadow-2xl glow-gold scale-110">
            <ShieldCheck className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground mb-6 tracking-tight">
            Secure<span className="text-primary">Luxe</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
            Your security is our priority. Complete the verification to reclaim access to your cinematic world.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300 w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Email
            </button>
          </div>

          <div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              Verify Account
            </h2>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to <span className="text-primary font-semibold">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <input type="hidden" {...register("email")} />

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <div className="relative group">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="code"
                  placeholder="123456"
                  className="pl-11 bg-card/50 border-white/5 focus:border-primary/50 text-center tracking-[1em] font-bold text-xl"
                  {...register("code")}
                />
              </div>
              {errors.code && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 bg-card/50 border-white/5 focus:border-primary/50"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className="pl-11 bg-card/50 border-white/5 focus:border-primary/50"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="w-full mt-4 shadow-lg glow-gold"
            >
              Reset Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

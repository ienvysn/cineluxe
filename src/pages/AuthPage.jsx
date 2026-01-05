import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Film, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { loginSchema, registerSchema } from "../lib/schemas";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : registerSchema),
  });

  const onSubmit = (data) => {
    console.log(isLogin ? "Login Data:" : "Register Data:", data);

    toast.success(isLogin ? "Welcome back!" : "Account created!", {
      description: isLogin
        ? "You have successfully logged in"
        : "Please check your email to verify your account",
    });

    if (isLogin) {

      setTimeout(() => navigate("/"), 1500);
    }
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const handleGoogleSignIn = () => {
    toast.info("Google Sign In", {
      description: "This feature requires backend integration",
    });
  };

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center mb-8 shadow-2xl glow-gold scale-110">
            <Film className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl font-bold text-foreground mb-6 tracking-tight">
            Cine<span className="text-primary">Luxe</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-sm leading-relaxed">
            Where cinema reaches its zenith. Immerse yourself in the ultimate
            premium viewing experience.
          </p>
        </div>
      </div>


      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 animate-slide-up">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="lg:hidden flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center shadow-lg">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold text-foreground">
                Cine<span className="text-primary">Luxe</span>
              </span>
            </div>
          </div>

          <div>
            <h2 className="font-display text-4xl font-bold text-foreground mb-3">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your bookings"
                : "Join us for a premium cinema experience"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    className="pl-11 bg-card/50 border-white/5 focus:border-primary/50"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-11 bg-card/50 border-white/5 focus:border-primary/50"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
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
                <p className="text-xs text-destructive mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
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
                  <p className="text-xs text-destructive mt-1 ml-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            )}

            <Button
              type="submit"
              variant="gold"
              size="xl"
              className="w-full mt-2"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-4 bg-background text-muted-foreground">
                OR{" "}
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full border-white/10 hover:border-primary/30 transition-all duration-300"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "New to CineLuxe?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={handleToggleMode}
              className="text-primary hover:text-gold-light underline underline-offset-4 font-semibold transition-colors"
            >
              {isLogin ? "Create one now" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

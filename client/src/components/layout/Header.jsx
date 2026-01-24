import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { User, Ticket, Film, LogOut, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("cineluxe_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cineluxe_token");
    localStorage.removeItem("cineluxe_user");
    setUser(null);
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center shadow-lg">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            CineLuxe
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-white/5 text-primary"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              {user.role !== "admin" && (
                <Link to="/bookings">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 hover:bg-white/5"
                  >
                    <Ticket className="w-4 h-4" />
                    <span className="hidden sm:inline">My Bookings</span>
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {(user.fullName || user.name || "U")[0].toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="goldOutline" size="sm" className="gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

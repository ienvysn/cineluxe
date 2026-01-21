import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Film,
  Monitor,
  Calendar,
  Ticket,
  CheckCircle,
  Settings,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ChevronLeft,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Movies", url: "/admin/movies", icon: Film },
  { title: "Screens", url: "/admin/screens", icon: Monitor },
  { title: "Showtimes", url: "/admin/showtimes", icon: Calendar },
  { title: "Bookings", url: "/admin/bookings", icon: Ticket },
  { title: "Validate Tickets", url: "/admin/validate", icon: CheckCircle },
  { title: "Pricing", url: "/admin/pricing", icon: Settings },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("cineluxe_user") || "{}");
    const token = localStorage.getItem("cineluxe_token");
    if (!token || user.role !== "admin") {
      navigate("/admin/login");
    }
  }, [navigate]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cineluxe_token");
    localStorage.removeItem("cineluxe_user");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 bg-[#070707] border-r border-white/5 transition-all duration-500 ease-in-out",
          isSidebarOpen
            ? "w-72 translate-x-0"
            : "-translate-x-full lg:translate-x-0 lg:w-24",
        )}
      >
        <div className="flex flex-col h-full">
          <div
            className={cn(
              "h-24 border-b border-white/5 flex items-center transition-all duration-500",
              isSidebarOpen ? "px-6 justify-between" : "justify-center",
            )}
          >
            <div
              className={cn(
                "items-center gap-3 transition-all duration-300",
                isSidebarOpen ? "flex opacity-100" : "hidden lg:opacity-0",
              )}
            >
              <span className="font-display font-bold text-xl tracking-tight text-white whitespace-nowrap">
                CineLuxe{" "}
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1 font-bold">
                  Admin
                </span>
              </span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-white transition-all"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.url ||
                (item.url === "/admin" && location.pathname === "/admin/");
              return (
                <button
                  key={item.title}
                  onClick={() => {
                    navigate(item.url);
                    if (isMobile) setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "group w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 text-left relative overflow-hidden",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/5 hover:text-white",
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full" />
                  )}
                  <item.icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110",
                      isActive && "text-primary",
                    )}
                  />
                  {isSidebarOpen && (
                    <span className="font-semibold text-sm tracking-wide">
                      {item.title}
                    </span>
                  )}
                  {!isSidebarOpen && !isMobile && (
                    <div className="absolute left-full ml-6 px-3 py-1 bg-primary text-black text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl pointer-events-none uppercase tracking-widest">
                      {item.title}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User / Logout Area */}
          <div className="p-4 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && (
                <span className="font-semibold text-sm">Sign Out</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 bg-[#030303] overflow-y-auto h-screen custom-scrollbar relative">
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-white/5 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5 text-primary" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg">CineLuxe</span>
          </div>
          <div className="w-10" />
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

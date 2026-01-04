import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { Film } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="text-center max-w-lg space-y-8 animate-fade-in">
        <div className="relative inline-block">
          <h1 className="text-[180px] font-display font-black text-white/5 leading-none select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center shadow-2xl glow-gold rotate-12">
                <Film className="w-12 h-12 text-primary-foreground" />
             </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-display font-bold text-white tracking-tight">The Frame is <span className="text-primary">Missing</span></h2>
          <p className="text-muted-foreground text-lg font-light leading-relaxed italic">
            "It's not that we're lost, we're just exploring the cutting room floor."
            <br />
            This page hasn't made it to the final cut.
          </p>
        </div>

        <div className="pt-8">
          <Link to="/">
            <Button variant="gold" size="xl" className="px-12">
              Return to Premiere
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

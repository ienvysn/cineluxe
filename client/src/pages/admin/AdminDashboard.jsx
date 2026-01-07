import React from 'react';
import { Film, Monitor, Calendar, Ticket, TrendingUp, Users, ArrowUpRight, DollarSign } from 'lucide-react';
import { movies, screens, showtimes } from '../../data/mockData';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const mockStats = {
  todayBookings: 47,
  todayRevenue: 14100,
  weeklyRevenue: 98700,
  totalCustomers: 1250,
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  positive = true
}) => (
  <div className="glass-card p-6 border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
      <Icon className="w-20 h-20" />
    </div>

    <div className="flex items-start justify-between relative z-10">
      <div className="space-y-3">
        <p className="text-[10px] uppercase tracking-[2px] text-muted-foreground font-bold">{title}</p>
        <p className="text-3xl font-bold text-white tracking-tighter">{value}</p>
        {trend && (
          <div className="flex items-center gap-1.5 pt-1">
            <div className={cn(
              "p-1 rounded-md text-[10px] font-bold flex items-center gap-1",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
            )}>
              <ArrowUpRight className="w-3 h-3" />
              {trend}
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">vs yesterday</span>
          </div>
        )}
      </div>
      <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary shadow-lg shadow-primary/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const todayDate = new Date().toISOString().split('T')[0];
  const todayShowtimes = showtimes.filter((s) => s.date === todayDate);

  return (
    <div className="space-y-12 animate-fade-in">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Admin Dashboard</span>
            </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Dashboard <span className="text-gold-gradient italic">Summary</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">Quick overview of your cinema and bookings.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="outline" className="text-[10px] uppercase border-white/10 px-4 py-2 bg-white/5 font-bold tracking-widest h-auto">
            System Status: Active
          </Badge>
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

    {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Bookings"
          value={mockStats.todayBookings}
          icon={Ticket}
          trend="+12%"
        />
        <StatCard
          title="Today's Revenue"
          value={`NPR ${mockStats.todayRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Weekly Revenue"
          value={`NPR ${mockStats.weeklyRevenue.toLocaleString()}`}
          icon={TrendingUp}
          trend="+8.4%"
        />
        <StatCard
          title="Total Customers"
          value={mockStats.totalCustomers.toLocaleString()}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-1 space-y-6">
           <h2 className="font-display text-2xl font-bold italic mb-2 tracking-tight">Quick <span className="text-primary">Stats</span></h2>

           <div className="glass-card p-6 border-white/5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Movies Showing</h3>
                   <p className="text-3xl font-bold text-white leading-none mt-1">{movies.length}</p>
                </div>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">System Status</span>
                    <span className="text-white font-bold">100% Correct</span>
                 </div>
                 <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full shadow-[0_0_10px_rgba(218,165,32,0.5)]" />
                 </div>
              </div>
           </div>

           <div className="glass-card p-6 border-white/5 hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Cinema Screens</h3>
                   <p className="text-3xl font-bold text-white leading-none mt-1">{screens.length} Screens</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-light italic">All screens are working normally.</p>
           </div>
        </div>


        <div className="lg:col-span-2">
           <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-2xl font-bold italic tracking-tight">Today's <span className="text-primary">Shows</span></h2>
              <Badge variant="goldOutline" className="text-[9px] font-bold uppercase tracking-widest px-4 py-1.5">{todayShowtimes.length} Shows Today</Badge>
           </div>

           <div className="glass-card overflow-hidden border-white/5">
              <div className="divide-y divide-white/5">
                {todayShowtimes.length > 0 ? (
                  todayShowtimes.slice(0, 6).map((showtime, index) => {
                    const movie = movies.find((m) => m.id === showtime.movieId);
                    const screen = screens.find((s) => s.id === showtime.screenId);
                    return (
                      <div
                        key={showtime.id}
                        className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex items-center gap-5">
                          <div className="relative flex-shrink-0">
                            <img
                              src={movie?.poster}
                              alt={movie?.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-xl"
                            />
                            <div className="absolute inset-0 ring-1 ring-white/10 rounded-lg group-hover:ring-primary/40 transition-all" />
                          </div>
                          <div>
                            <h3 className="font-display text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">{movie?.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium uppercase tracking-widest">
                               <span className="flex items-center gap-1.5"><Monitor className="w-3 h-3 text-primary" /> {screen?.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                          <div className="px-4 py-1 bg-primary/10 border border-primary/20 rounded-full">
                            <p className="text-sm font-bold text-primary italic tracking-tighter">{showtime.time}</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            {showtime.bookedSeats.length} Bookings
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                     <p className="text-muted-foreground italic font-light">No shows scheduled for today.</p>
                  </div>
                )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

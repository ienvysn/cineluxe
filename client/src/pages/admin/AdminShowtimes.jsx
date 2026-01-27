import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar as CalendarIcon, Clock, Film, Monitor, Trash2, Filter, LayoutGrid, CalendarRange, Loader2 } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from 'sonner';
import { Badge } from '../../components/ui/badge';
import { cn, getPosterUrl } from '../../lib/utils';
import { showtimeService } from "../../services/showtimeService";
import { movieService } from "../../services/movieService";
import { screenService } from "../../services/screenService";

const AdminShowtimes = () => {
  const [scheduledShows, setScheduledShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filterMovie, setFilterMovie] = useState('all');
  const [filterDate, setFilterDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Form state
  const [addMode, setAddMode] = useState('single');
  const [formData, setFormData] = useState({
    movieId: '',
    screenId: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '14:00',
    recurringDays: 7,
    price: 300,
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load showtimes when filters change
  useEffect(() => {
    loadShowtimes();
  }, [filterMovie, filterDate]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [moviesData, screensData] = await Promise.all([
        movieService.getAllMovies(),
        screenService.getAll(),
      ]);
      setMovies(moviesData);
      setScreens(screensData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data', {
        description: error.message || 'Could not load movies and screens',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadShowtimes = async () => {
    try {
      const filters = {};
      if (filterMovie !== 'all') filters.movieId = filterMovie;
      if (filterDate) filters.date = filterDate;

      const data = await showtimeService.getAll(filters);
      setScheduledShows(data);
    } catch (error) {
      console.error('Error loading showtimes:', error);
      toast.error('Failed to load showtimes', {
        description: error.message || 'Could not fetch showtimes',
      });
    }
  };

  const filteredShowtimes = scheduledShows;

  const resetForm = () => {
    setFormData({
      movieId: '',
      screenId: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '14:00',
      recurringDays: 7,
      price: 300,
    });
  };

  const handleSaveShowtime = async () => {
    if (!formData.movieId || !formData.screenId) {
      toast.error('Missing Info', {
        description: 'Please select both a movie and a screen.',
      });
      return;
    }

    try {
      setIsCreating(true);

      if (addMode === 'single') {
        // Create single showtime
        await showtimeService.create({
          movieId: formData.movieId,
          screenId: formData.screenId,
          date: formData.date,
          time: formData.time,
          price: formData.price,
        });

        toast.success('Showtime Added', {
          description: 'New showtime has been created successfully.',
        });
      } else {
        // Create recurring showtimes
        const times = [formData.time];
        const startDate = formData.date;
        const endDate = format(addDays(new Date(formData.date), formData.recurringDays - 1), 'yyyy-MM-dd');

        const result = await showtimeService.createRecurring({
          movieId: formData.movieId,
          screenId: formData.screenId,
          startDate,
          endDate,
          times,
          price: formData.price,
        });

        toast.success('Showtimes Added', {
          description: `Added ${result.created} new showtime(s) to the schedule.`,
        });
      }

      setIsAddDialogOpen(false);
      resetForm();
      loadShowtimes();
    } catch (error) {
      console.error('Error saving showtime:', error);
      toast.error('Failed to create showtime', {
        description: error.message || 'An error occurred while creating the showtime',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteShowtime = async (id) => {
    try {
      await showtimeService.delete(id);
      toast.success('Showtime Removed', {
        description: 'The show has been deleted from the schedule.',
      });
      loadShowtimes();
    } catch (error) {
      console.error('Error deleting showtime:', error);
      toast.error('Failed to delete showtime', {
        description: error.message || 'Could not delete the showtime',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Manage Showtimes</span>
            </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Schedule <span className="text-gold-gradient italic">Movies</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">Schedule movies for each screen and time.</p>
        </div>
        <Button variant="gold" size="xl" onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="px-8 h-14 rounded-2xl group shadow-2xl uppercase tracking-widest text-xs font-bold">
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Add Showtime
        </Button>
      </div>


      <div className="flex flex-wrap items-center gap-6 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] shadow-xl">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
           <Filter className="w-5 h-5 text-primary" />
           <div className="flex-1">
              <Select value={filterMovie} onValueChange={setFilterMovie}>
                 <SelectTrigger className="h-14 bg-transparent border-white/5 rounded-2xl">
                    <SelectValue placeholder="All Movies" />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="all">All Movies</SelectItem>
                    {movies.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                 </SelectContent>
              </Select>
           </div>
           <div className="flex-1">
              <Input
                 type="date"
                 value={filterDate}
                 onChange={(e) => setFilterDate(e.target.value)}
                 className="h-14 bg-transparent border-white/5 rounded-2xl font-bold"
              />
           </div>
        </div>
        <Badge variant="goldOutline" className="h-10 px-6 rounded-xl uppercase tracking-widest font-bold text-[10px]">{filteredShowtimes.length} Shows Found</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {filteredShowtimes.map((showtime) => {
          const movie = showtime.movie || movies.find(m => m.id === showtime.movieId);
          const screen = showtime.screen || screens.find(s => s.id === showtime.screenId);
          return (
            <div key={showtime.id} className="glass-card p-6 group hover:border-primary/20 transition-all flex flex-col gap-5">
               <div className="flex gap-4">
                  <img src={getPosterUrl(movie?.poster)} alt="" className="w-16 h-24 object-cover rounded-xl border border-white/10" />
                  <div className="flex-1 overflow-hidden">
                     <h3 className="font-display text-lg font-bold text-white truncate group-hover:text-primary transition-colors leading-tight mb-2">{movie?.title || 'Unknown Movie'}</h3>
                     <div className="space-y-1.5">
                        <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground"><Monitor className="w-3 h-3 text-primary" /> {screen?.name || 'Unknown Screen'}</span>
                        <span className="flex items-center gap-2 text-[10px] uppercase font-bold text-muted-foreground"><CalendarIcon className="w-3 h-3 text-primary" /> {format(new Date(showtime.date), 'EEE, MMM dd')}</span>
                     </div>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <div className="px-5 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                     <span className="text-xl font-display font-bold text-primary italic tracking-tight">{showtime.time?.substring(0, 5) || showtime.time}</span>
                  </div>
                  <button onClick={() => handleDeleteShowtime(showtime.id)} className="p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all border border-destructive/20 opacity-0 group-hover:opacity-100">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          );
        })}

        {filteredShowtimes.length === 0 && (
          <div className="col-span-full py-20 text-center glass-card border-dashed border-white/10 italic text-muted-foreground">
             No showtimes found for the selected filters.
          </div>
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-white/5 bg-[#070707] p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">

             <div className="md:col-span-2 bg-[#0A0A0A] p-10 border-r border-white/5 flex flex-col justify-center items-center text-center">
                <div className="w-20 h-20 rounded-[30px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                   <LayoutGrid className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-bold italic mb-4">Add <span className="text-primary">Show</span></h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed uppercase tracking-widest px-4">Set up a single show or repeat it for multiple days.</p>
             </div>


             <div className="md:col-span-3 p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                   <button onClick={() => setAddMode('single')} className={cn("flex-1 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all", addMode === 'single' ? "bg-primary text-black" : "text-muted-foreground hover:text-white")}>Single Show</button>
                   <button onClick={() => setAddMode('recurring')} className={cn("flex-1 py-3 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all", addMode === 'recurring' ? "bg-primary text-black" : "text-muted-foreground hover:text-white")}>Recurring</button>
                </div>

                <div className="space-y-5">
                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Select Movie</Label>
                      <Select value={formData.movieId} onValueChange={(v) => setFormData({ ...formData, movieId: v })}>
                         <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl">
                            <SelectValue placeholder="Choose Movie" />
                         </SelectTrigger>
                         <SelectContent>
                            {movies.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Select Screen</Label>
                      <Select value={formData.screenId} onValueChange={(v) => setFormData({ ...formData, screenId: v })}>
                         <SelectTrigger className="h-12 bg-white/5 border-white/5 rounded-xl">
                            <SelectValue placeholder="Choose Screen" />
                         </SelectTrigger>
                         <SelectContent>
                            {screens.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                         </SelectContent>
                      </Select>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Date</Label>
                         <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Time</Label>
                         <Input
                            type="time"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                            className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                         />
                      </div>
                   </div>

                   {addMode === 'recurring' && (
                     <div className="space-y-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 animate-slide-up">
                        <Label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-2">
                           <CalendarRange className="w-3 h-3 text-primary" /> Repeat for (days)
                        </Label>
                        <Input
                           type="number"
                           min={1}
                           max={30}
                           value={formData.recurringDays}
                           onChange={(e) => setFormData({ ...formData, recurringDays: parseInt(e.target.value) || 1 })}
                           className="h-12 bg-white/5 border-white/10 rounded-xl mt-3 text-lg font-bold italic text-primary"
                        />
                     </div>
                   )}

                   <div className="pt-6 flex justify-end gap-3">
                      <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="px-8 h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold">
                         Cancel
                      </Button>
                      <Button
                        variant="gold"
                        size="xl"
                        onClick={handleSaveShowtime}
                        disabled={isCreating}
                        className="px-12 h-14 rounded-2xl shadow-xl uppercase tracking-widest text-xs font-bold"
                      >
                         {isCreating ? (
                           <>
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                             Creating...
                           </>
                         ) : (
                           'Save Showtime'
                         )}
                      </Button>
                   </div>
                </div>
             </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminShowtimes;

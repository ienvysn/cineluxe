import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Film, ExternalLink, Globe, Clock, Star, Calendar as CalendarIcon, PlayCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import { movies as initialMovies } from '../../data/mockData';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';

const AdminMovies = () => {
  const [movieList, setMovieList] = useState(initialMovies);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [tmdbSearch, setTmdbSearch] = useState('');
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    genre: '',
    rating: '',
    language: '',
    synopsis: '',
    releaseDate: '',
    trailerUrl: '',
  });

  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: '',
      poster: '',
      genre: '',
      rating: '',
      language: '',
      synopsis: '',
      releaseDate: '',
      trailerUrl: '',
    });
    setSelectedMovie(null);
    setTmdbSearch('');
    setTmdbResults([]);
  };

  const handleTmdbSearch = async () => {
    if (!tmdbSearch.trim()) return;
    setIsSearching(true);


    setTimeout(() => {
      setTmdbResults([
        {
          id: 1,
          title: tmdbSearch,
          poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
          genre: ['Drama', 'Biography'],
          duration: 180,
          rating: 'R',
          language: 'English',
          synopsis: `Details for ${tmdbSearch}. This info is fetched from the movie database.`,
          releaseDate: '2024-01-15',
        },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const selectTmdbMovie = (movie) => {
    setFormData({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre.join(', '),
      rating: movie.rating,
      language: movie.language,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate,
      trailerUrl: '',
    });
    toast.info('Info Loaded', {
      description: `Loaded details for "${movie.title}".`
    });
  };

  const handleSaveMovie = () => {
    if (!formData.title || !formData.poster) {
      toast.error('Missing Info', {
        description: 'Please add a movie title and a poster image.',
      });
      return;
    }

    const movieData = {
      id: selectedMovie?.id || Date.now().toString(),
      title: formData.title,
      poster: formData.poster,
      genre: formData.genre.split(',').map((g) => g.trim()),
      duration: 120,
      rating: formData.rating || 'PG-13',
      language: formData.language || 'English',
      synopsis: formData.synopsis,
      releaseDate: formData.releaseDate || new Date().toISOString().split('T')[0],
      trailerUrl: formData.trailerUrl || undefined,
    };

    if (selectedMovie) {
      setMovieList((prev) =>
        prev.map((m) => (m.id === selectedMovie.id ? movieData : m))
      );
      toast.success('Movie Updated', {
        description: `"${movieData.title}" has been saved.`
      });
    } else {
      setMovieList((prev) => [...prev, movieData]);
      toast.success('Movie Added', {
        description: `"${movieData.title}" has been added to your collection.`
      });
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre.join(', '),
      rating: movie.rating,
      language: movie.language,
      synopsis: movie.synopsis,
      releaseDate: movie.releaseDate,
      trailerUrl: movie.trailerUrl || '',
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteMovie = () => {
    if (selectedMovie) {
      setMovieList((prev) => prev.filter((m) => m.id !== selectedMovie.id));
      toast.success('Movie Deleted', {
        description: 'The movie has been removed from your list.'
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedMovie(null);
  };

  return (
    <div className="space-y-12 animate-fade-in">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Manage Movies</span>
            </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Movie <span className="text-gold-gradient italic">Collection</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">Add and manage movies in your cinema.</p>
        </div>
        <Button variant="gold" size="xl" onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="px-8 h-14 rounded-2xl group shadow-2xl uppercase tracking-widest text-xs font-bold">
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Add New Movie
        </Button>
      </div>
      <div className="relative max-w-2xl group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search movies by title, genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-14 h-16 bg-white/5 border-white/5 rounded-2xl text-lg font-light shadow-xl"
        />
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {filteredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className="group relative bg-[#0A0A0A] rounded-[32px] overflow-hidden border border-white/5 transition-all duration-500 hover:border-primary/30 hover:shadow-2xl animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="aspect-[2/3] relative overflow-hidden">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => handleEditMovie(movie)}
                  className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-all"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsDeleteDialogOpen(true);
                  }}
                  className="w-10 h-10 rounded-xl bg-destructive/10 backdrop-blur-md border border-destructive/20 flex items-center justify-center text-destructive hover:bg-destructive hover:text-white transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
               <h3 className="font-display text-xl font-bold text-white truncate mb-2 group-hover:text-primary transition-colors">{movie.title}</h3>
               <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold tracking-widest uppercase">
                  <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">{movie.rating} • {movie.language}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
          <p className="text-muted-foreground italic">No movies found in your collection.</p>
        </div>
      )}


      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl rounded-[40px] border-white/5 p-0 overflow-hidden bg-[#070707]">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full max-h-[90vh]">

            <div className="lg:col-span-2 bg-[#0A0A0A] p-10 flex flex-col items-center justify-center border-r border-white/5">
                {formData.poster ? (
                  <div className="w-full">
                    <img
                      src={formData.poster}
                      alt="Preview"
                      className="w-full aspect-[2/3] object-cover rounded-[32px] shadow-2xl border border-white/10"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[2/3] rounded-[32px] bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8">
                     <PlayCircle className="w-12 h-12 text-muted-foreground/20 mb-4" />
                     <p className="text-muted-foreground text-sm italic">Poster preview will appear here.</p>
                  </div>
                )}
            </div>


            <div className="lg:col-span-3 p-10 overflow-y-auto custom-scrollbar">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-display font-bold italic">{selectedMovie ? 'Edit' : 'Add'} <span className="text-primary italic">Movie</span></DialogTitle>
                <DialogDescription>Enter the movie details below.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue={selectedMovie ? 'manual' : 'tmdb'} className="w-full">
                <TabsList className="w-full bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
                  <TabsTrigger value="tmdb" className="flex-1 rounded-xl">Search Online</TabsTrigger>
                  <TabsTrigger value="manual" className="flex-1 rounded-xl">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="tmdb" className="space-y-4 pt-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search movie database..."
                      value={tmdbSearch}
                      onChange={(e) => setTmdbSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleTmdbSearch()}
                      className="h-12 bg-white/5 border-white/5"
                    />
                    <Button onClick={handleTmdbSearch} disabled={isSearching} variant="goldOutline" className="h-12 px-6 rounded-xl uppercase tracking-widest text-[10px] font-bold">
                      {isSearching ? '...' : 'Search'}
                    </Button>
                  </div>

                  {tmdbResults.length > 0 && (
                    <div className="space-y-2">
                      {tmdbResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all"
                          onClick={() => selectTmdbMovie(result)}
                        >
                          <img src={result.poster} className="w-12 h-16 object-cover rounded-lg" alt="" />
                          <div className="flex-1">
                            <p className="font-bold text-white">{result.title}</p>
                            <p className="text-[9px] text-muted-foreground uppercase">{result.releaseDate}</p>
                          </div>
                   <Badge variant="goldOutline" className="text-[10px]">Select</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manual" className="pt-2">
                   <p className="text-[10px] text-muted-foreground italic mb-4">Enter details manually in the form below.</p>
                </TabsContent>
              </Tabs>

              <div className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Movie Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 bg-white/5 border-white/5 rounded-xl font-bold font-display"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Poster URL</Label>
                  <Input
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    className="h-11 bg-white/5 border-white/5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Rating</Label>
                  <Input
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="h-11 bg-white/5 border-white/5 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Story Summary</Label>
                  <Textarea
                    value={formData.synopsis}
                    onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                    rows={4}
                    className="rounded-2xl bg-white/5 border-white/5"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 pb-8">
                  <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="px-8 h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold">
                    Cancel
                  </Button>
                  <Button variant="gold" size="xl" onClick={handleSaveMovie} className="px-10 h-14 rounded-2xl uppercase tracking-widest text-xs font-bold shadow-xl">
                    {selectedMovie ? 'Save Changes' : 'Add Movie'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-[40px] border-white/5 bg-[#0A0A0A] p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-bold">Delete Movie?</AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-muted-foreground">
              Are you sure you want to delete <span className="text-white font-bold">"{selectedMovie?.title}"</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="h-12 rounded-xl border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMovie}
              className="h-12 rounded-xl bg-destructive text-white hover:bg-destructive/80 font-bold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminMovies;

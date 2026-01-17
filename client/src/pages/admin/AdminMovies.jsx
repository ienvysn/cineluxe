import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  PlayCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

import { toast } from "sonner";
import { movies as initialMovies } from "../../data/mockData";
import { Badge } from "../../components/ui/badge";
import { cn, getPosterUrl } from "../../lib/utils";
import { movieService } from "../../services/movieService";

const AdminMovies = () => {
  const [movieList, setMovieList] = useState(initialMovies);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    poster: "",
    genre: "",
    rating: "",
    language: "",
    synopsis: "",
    releaseDate: "",
    trailerUrl: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await movieService.getAllMovies();
      if (data) {
        setMovieList(data);
      }
    } catch (error) {
      toast.error("Failed to fetch movies");
    }
  };

  const filteredMovies = movieList.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      title: "",
      poster: "",
      genre: "",
      rating: "",
      language: "",
      synopsis: "",
      releaseDate: "",
      trailerUrl: "",
    });
    setSelectedMovie(null);
    setPosterFile(null);
    setPosterPreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
      setFormData({ ...formData, poster: "" }); // Clear URL if file selected
    }
  };

  const handleEditMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      poster: movie.poster,
      genre: movie.genre || "",
      rating: movie.rating || "",
      language: movie.language || "",
      synopsis: movie.synopsis || "",
      releaseDate: movie.releaseDate || "",
      trailerUrl: movie.trailerUrl || "",
    });
    setPosterPreview(getPosterUrl(movie.poster));
    setPosterFile(null);
    setIsAddDialogOpen(true);
  };

  const handleSaveMovie = async () => {
    if (!formData.title && !posterFile && !formData.poster) {
      toast.error("Missing Info", {
        description: "Please add a movie title and a poster (file or URL).",
      });
      return;
    }
    const token = localStorage.getItem("cineluxe_token");

    const form = new FormData();
    form.append("title", formData.title);
    form.append("genre", formData.genre);
    form.append("duration", 120);
    form.append("rating", formData.rating || "PG-13");
    form.append("language", formData.language || "English");
    form.append("synopsis", formData.synopsis);
    form.append(
      "releaseDate",
      formData.releaseDate || new Date().toISOString().split("T")[0]
    );

    if (posterFile) {
      form.append("posterFile", posterFile);
    } else {
      form.append("poster", formData.poster);
    }

    try {
      if (selectedMovie) {
        const updated = await movieService.updateMovie(
          selectedMovie.id,
          form,
          token
        );
        setMovieList((prev) =>
          prev.map((m) => (m.id === selectedMovie.id ? updated : m))
        );
        toast.success("Movie Updated");
      } else {
        const newMovie = await movieService.addMovie(form, token);
        setMovieList((prev) => [...prev, newMovie]);
        toast.success("Movie Added");
      }

      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error("Error", { description: error.message });
    }
  };
  const handleDeleteMovie = async () => {
    if (selectedMovie) {
      try {
        const token = localStorage.getItem("cineluxe_token");
        await movieService.deleteMovie(selectedMovie.id, token);
        setMovieList((prev) => prev.filter((m) => m.id !== selectedMovie.id)); // display of movie by filtering the deleted
        toast.success("Movie Deleted", {
          description: "The movie has been removed from your list.",
        });
      } catch (error) {
        toast.error("Failed to delete movie");
      }
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
            <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">
              Manage Movies
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Movie <span className="text-gold-gradient italic">Collection</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">
            Add and manage movies in your cinema.
          </p>
        </div>
        <Button
          variant="gold"
          size="xl"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="px-8 h-14 rounded-2xl group shadow-2xl uppercase tracking-widest text-xs font-bold"
        >
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
                src={getPosterUrl(movie.poster)}
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
              <h3 className="font-display text-xl font-bold text-white truncate mb-2 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground font-bold tracking-widest uppercase">
                <span className="flex items-center gap-1.5 group-hover:text-white transition-colors">
                  {movie.rating} • {movie.language}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMovies.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] rounded-[40px] border border-dashed border-white/10">
          <p className="text-muted-foreground italic">
            No movies found in your collection.
          </p>
        </div>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl rounded-[40px] border-white/5 p-0 overflow-hidden bg-[#070707]">
          <div className="grid grid-cols-1 lg:grid-cols-5 h-full max-h-[90vh]">
            <div className="lg:col-span-2 bg-[#0A0A0A] p-10 flex flex-col items-center justify-center border-r border-white/5">
              {posterPreview || formData.poster ? (
                <div className="w-full">
                  <img
                    src={posterPreview || getPosterUrl(formData.poster)}
                    alt="Preview"
                    className="w-full aspect-[2/3] object-cover rounded-[32px] shadow-2xl border border-white/10"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[2/3] rounded-[32px] bg-white/[0.02] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-8">
                  <PlayCircle className="w-12 h-12 text-muted-foreground/20 mb-4" />
                  <p className="text-muted-foreground text-sm italic">
                    Poster preview will appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 p-10 overflow-y-auto custom-scrollbar">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-display font-bold italic">
                  {selectedMovie ? "Edit" : "Add"}{" "}
                  <span className="text-primary italic">Movie</span>
                </DialogTitle>
                <DialogDescription>
                  Enter the movie details below.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-8">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Movie Title
                  </Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-12 bg-white/5 border-white/5 rounded-xl font-bold font-display"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Poster Upload
                  </Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="h-11 bg-white/5 border-white/5 rounded-xl text-sm pt-2"
                  />
                  <p className="text-[9px] text-muted-foreground italic ml-1">
                    Or provide a URL below
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Poster URL
                  </Label>
                  <Input
                    value={formData.poster}
                    onChange={(e) => {
                      setFormData({ ...formData, poster: e.target.value });
                      setPosterFile(null);
                      setPosterPreview(null);
                    }}
                    placeholder="https://example.com/poster.jpg"
                    className="h-11 bg-white/5 border-white/5 rounded-xl text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Rating
                  </Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rating: value })
                    }
                  >
                    <SelectTrigger className="h-11 bg-white/5 border-white/5 rounded-xl">
                      <SelectValue placeholder="Select Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="G">G - General Audiences</SelectItem>
                      <SelectItem value="PG">PG - Parental Guidance</SelectItem>
                      <SelectItem value="PG-13">
                        PG-13 - Parents Strongly Cautioned
                      </SelectItem>
                      <SelectItem value="R">R - Restricted</SelectItem>
                      <SelectItem value="NC-17">NC-17 - Adults Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground ml-1">
                    Story Summary
                  </Label>
                  <Textarea
                    value={formData.synopsis}
                    onChange={(e) =>
                      setFormData({ ...formData, synopsis: e.target.value })
                    }
                    rows={4}
                    className="rounded-2xl bg-white/5 border-white/5"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-6 pb-8">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-8 h-14 rounded-2xl uppercase tracking-widest text-[10px] font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    size="xl"
                    onClick={handleSaveMovie}
                    className="px-10 h-14 rounded-2xl uppercase tracking-widest text-xs font-bold shadow-xl"
                  >
                    {selectedMovie ? "Save Changes" : "Add Movie"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-[40px] border-white/5 bg-[#0A0A0A] p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-bold">
              Delete Movie?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="text-white font-bold">
                "{selectedMovie?.title}"
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-4">
            <AlertDialogCancel className="h-12 rounded-xl border-white/10">
              Cancel
            </AlertDialogCancel>
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

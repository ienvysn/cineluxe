import React, { useState } from "react";
import {
  Plus,
  Monitor,
  Edit,
  Trash2,
  Users,
  Layout,
  Maximize2,
  Square,
  Grid3X3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { toast } from "sonner";
import { screens as initialScreens } from "../../data/mockData";
import { Badge } from "../../components/ui/badge";
import { cn } from "../../lib/utils";
import { apiCall } from "../../../api";

const AdminScreens = () => {
  const [screenList, setScreenList] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    rows: 8,
    seatsPerRow: 12,
  });

  const fetchScreens = async () => {
    try {
      const data = await apiCall("GET", "/screens");
      setScreenList(data);
    } catch (error) {
      console.error("Failed to fetch screens:", error);
      toast.error("Fetch Failed", {
        description: "Could not load screens from server.",
      });
      // Fallback to initialScreens if fetch fails totally or for development
      setScreenList(initialScreens);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchScreens();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", rows: 8, seatsPerRow: 12 });
    setSelectedScreen(null);
  };

  const handleSaveScreen = async () => {
    const token = localStorage.getItem("cineluxe_token");

    if (!formData.name) {
      toast.error("Name Missing", {
        description: "Please give a name to your cinema screen.",
      });
      return;
    }
    console.log(formData.rows);
    const rows = parseInt(formData.rows);
    const seatsPerRow = parseInt(formData.seatsPerRow);

    if (isNaN(rows) || rows < 1) {
      toast.error("Invalid Rows", {
        description: "Number of rows must be at least 1.",
      });
      return;
    }

    if (rows > 25) {
      toast.error("Too Many Rows", {
        description: "Maximum number of rows is 25.",
      });
      return;
    }

    if (isNaN(seatsPerRow) || seatsPerRow < 1) {
      toast.error("Invalid Seats Per Row", {
        description: "Seats per row must be at least 1.",
      });
      return;
    }

    if (seatsPerRow > 25) {
      toast.error("Too Many Seats", {
        description: "Maximum seats per row is 25.",
      });
      return;
    }

    console.log(typeof rows);
    const screenData = {
      name: formData.name,
      rows: rows,
      seatsPerRow: seatsPerRow,
      capacity: rows * seatsPerRow,
    };
    try {
      if (selectedScreen) {
        // API Call
        await apiCall("PUT", `/screens/${selectedScreen.id}`, {
          data: screenData,
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Screen Updated", {
          description: `"${screenData.name}" details have been saved.`,
        });
      } else {
        // API Call
        await apiCall("POST", "/screens", {
          data: screenData,
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success("Screen Added", {
          description: `"${screenData.name}" is now ready for showtimes.`,
        });
      }

      await fetchScreens();
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save screen:", error);
      toast.error("Save Failed", {
        description: error.message || "There was a problem saving your screen.",
      });
    }
  };

  const handleDeleteScreen = () => {
    if (selectedScreen) {
      setScreenList((prev) => prev.filter((s) => s.id !== selectedScreen.id));
      toast.success("Screen Removed", {
        description: "The screen has been deleted from your cinema.",
      });
    }
    setIsDeleteDialogOpen(false);
    setSelectedScreen(null);
  };

  const handleEditScreen = (screen) => {
    setSelectedScreen(screen);
    setFormData({
      name: screen.name,
      rows: screen.rows,
      seatsPerRow: screen.seatsPerRow,
    });
    setIsAddDialogOpen(true);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">
              Cinema Screens
            </span>
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter">
            Manage <span className="text-gold-gradient italic">Screens</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">
            Add and manage the screens in your cinema.
          </p>
        </div>
        <Button
          variant="gold"
          size="xl"
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
          className="px-8 h-14 rounded-2xl group shadow-2xl"
        >
          <Plus className="w-5 h-5 mr-3 group-hover:rotate-90 transition-transform duration-300" />
          Add New Screen
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {screenList.map((screen) => (
          <div
            key={screen.id}
            className="glass-card group hover:border-primary/20 transition-all p-8 flex flex-col justify-between min-h-[320px]"
          >
            <div>
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                  <Monitor className="w-6 h-6" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => handleEditScreen(screen)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-white transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedScreen(screen);
                      setIsDeleteDialogOpen(true);
                    }}
                    className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition-colors border border-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-display text-2xl font-bold text-white mb-2 italic tracking-tight">
                {screen.name}
              </h3>
              <div className="flex items-center gap-6 mt-6">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    Total Capacity
                  </span>
                  <span className="text-xl font-display font-black text-white italic">
                    {screen.rows * screen.seatsPerRow} Seats
                  </span>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    Layout
                  </span>
                  <span className="text-xl font-display font-black text-white italic">
                    {screen.rows}R × {screen.seatsPerRow}S
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col rounded-[40px] border-white/5 bg-[#070707] p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full overflow-hidden">
            <div className="bg-[#0A0A0A] p-10 border-r border-white/5 flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold italic tracking-wider">
                  Screen Layout
                </h3>
              </div>

              <div className="space-y-8 flex flex-col h-full">
                <div className="flex-1 min-h-0 bg-[#0A0A0A] rounded-2xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                  <div className="relative min-h-full flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(218,165,32,0.4)] rounded-full mb-8 shrink-0" />
                    <div
                      className="grid gap-1.5 w-full max-w-md mx-auto"
                      style={{
                        gridTemplateColumns: `repeat(${Math.min(
                          Math.max(formData.seatsPerRow, 1),
                          15,
                        )}, minmax(0, 1fr))`,
                      }}
                    >
                      {[
                        ...Array(
                          Math.min(
                            Math.max(formData.rows, 1) *
                              Math.max(formData.seatsPerRow, 1),
                            150,
                          ),
                        ),
                      ].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-sm bg-white/5 border border-white/5"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground italic text-center font-light uppercase tracking-widest pt-4 shrink-0">
                  Audience Seating Preview
                </p>
              </div>
            </div>

            <div className="p-10 space-y-8">
              <DialogHeader>
                <DialogTitle className="text-3xl font-display font-bold italic">
                  {selectedScreen ? "Edit" : "Add"}{" "}
                  <span className="text-primary">Screen</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                    Screen Name
                  </Label>
                  <Input
                    placeholder="e.g., Screen 1 or IMAX"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="h-14 bg-white/5 border-white/5 rounded-2xl text-xl font-bold italic"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                      Number of Rows
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="25"
                      value={formData.rows}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(parseInt(e.target.value) || 0, 25),
                        );
                        setFormData({ ...formData, rows: val });
                      }}
                      className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                      Seats Per Row
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      max="25"
                      value={formData.seatsPerRow}
                      onChange={(e) => {
                        const val = Math.max(
                          1,
                          Math.min(parseInt(e.target.value) || 0, 25),
                        );
                        setFormData({
                          ...formData,
                          seatsPerRow: val,
                        });
                      }}
                      className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-3 w-full">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-6 h-12 rounded-xl uppercase tracking-widest text-[10px] font-black hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    size="lg"
                    onClick={handleSaveScreen}
                    className="px-8 h-12 rounded-xl shadow-xl uppercase tracking-widest text-[10px] font-black"
                  >
                    {selectedScreen ? "Save Changes" : "Add Screen"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-[40px] border-white/5 bg-[#0A0A0A] p-10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-display font-bold">
              Delete Screen?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-4">
              Are you sure you want to delete{" "}
              <span className="text-white font-bold">
                "{selectedScreen?.name}"
              </span>
              ? This will also remove any showtimes linked to this screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-4">
            <AlertDialogCancel className="h-14 rounded-2xl px-8 uppercase tracking-widest text-[10px] font-black">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteScreen}
              className="h-14 rounded-2xl px-10 bg-destructive text-white hover:bg-destructive/80 transition-all uppercase tracking-widest text-[10px] font-black"
            >
              Delete Screen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminScreens;

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
  const screen = apiCall("GET", "/screen");
  console.log(screen);
  const [screenList, setScreenList] = useState(initialScreens);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    rows: 8,
    seatsPerRow: 12,
  });

  const resetForm = () => {
    setFormData({ name: "", rows: 8, seatsPerRow: 12 });
    setSelectedScreen(null);
  };

  const handleSaveScreen = () => {
    if (!formData.name) {
      toast.error("Name Missing", {
        description: "Please give a name to your cinema screen.",
      });
      return;
    }

    const screenData = {
      id: selectedScreen?.id || `screen-${Date.now()}`,
      name: formData.name,
      rows: parseInt(formData.rows) || 1,
      seatsPerRow: parseInt(formData.seatsPerRow) || 1,
    };

    if (selectedScreen) {
      setScreenList((prev) =>
        prev.map((s) => (s.id === selectedScreen.id ? screenData : s))
      );
      toast.success("Screen Updated", {
        description: `"${screenData.name}" details have been saved.`,
      });
    } else {
      setScreenList((prev) => [...prev, screenData]);
      apiCall("POST", "/screen", {
        headers: { Authorization: `Bearer ${token}` },
        data: screenData,
      });
      toast.success("Screen Added", {
        description: `"${screenData.name}" is now ready for showtimes.`,
      });
    }

    setIsAddDialogOpen(false);
    resetForm();
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

            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-4 flex items-center gap-2">
                <Layout className="w-3 h-3 text-primary" /> Visual Preview
              </p>
              <div className="space-y-1 max-w-[200px]">
                {[...Array(Math.min(screen.rows, 4))].map((_, i) => (
                  <div key={i} className="flex gap-1">
                    {[...Array(Math.min(screen.seatsPerRow, 8))].map((_, j) => (
                      <div
                        key={j}
                        className="w-2.5 h-2.5 rounded-sm bg-white/5 border border-white/10"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl rounded-[40px] border-white/5 bg-[#070707] p-0 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div className="bg-[#0A0A0A] p-10 border-r border-white/5">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Grid3X3 className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-bold italic tracking-wider">
                  Screen Layout
                </h3>
              </div>

              <div className="space-y-8">
                <div className="relative">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(218,165,32,0.4)] rounded-full mb-8" />
                  <div
                    className="grid gap-1.5"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        formData.seatsPerRow,
                        15
                      )}, minmax(0, 1fr))`,
                    }}
                  >
                    {[
                      ...Array(
                        Math.min(formData.rows * formData.seatsPerRow, 150)
                      ),
                    ].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-sm bg-white/5 border border-white/5"
                      />
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground italic text-center font-light uppercase tracking-widest pb-4">
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
                      value={formData.rows}
                      onChange={(e) =>
                        setFormData({ ...formData, rows: e.target.value })
                      }
                      className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">
                      Seats Per Row
                    </Label>
                    <Input
                      type="number"
                      value={formData.seatsPerRow}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          seatsPerRow: e.target.value,
                        })
                      }
                      className="h-12 bg-white/5 border-white/5 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="pt-8 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="px-8 h-14 rounded-2xl uppercase tracking-widest text-[10px] font-black"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="gold"
                    size="xl"
                    onClick={handleSaveScreen}
                    className="px-12 h-14 rounded-2xl shadow-xl uppercase tracking-widest text-xs font-black"
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

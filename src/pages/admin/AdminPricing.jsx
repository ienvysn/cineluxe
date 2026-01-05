import React, { useState } from 'react';
import { Save, Info, Wallet, Percent, Calendar as CalendarIcon, Tag, Coins } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { toast } from 'sonner';
import { pricing as initialPricing } from '../../data/mockData';
import { cn } from '../../lib/utils';
import { Badge } from '../../components/ui/badge';

const AdminPricing = () => {
  const [pricingData, setPricingData] = useState({
    frontRow: initialPricing.frontRow,
    normal: initialPricing.normal,
    discountPercent: initialPricing.discountPercent,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);

    setTimeout(() => {
      toast.success('Prices Updated', {
        description: 'Your ticket prices and discounts have been saved successfully.',
      });
      setIsSaving(false);
    }, 800);
  };

  const calculateDiscountedPrice = (price) => {
    return Math.round(price * (1 - pricingData.discountPercent / 100));
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[3px] text-primary font-bold">Pricing Manager</span>
            </div>
          <h1 className="font-display text-5xl font-bold tracking-tighter italic">
            Ticket <span className="text-gold-gradient">Prices</span>
          </h1>
          <p className="text-muted-foreground mt-3 font-light text-lg">Manage ticket rates and weekday discounts.</p>
        </div>
        <Button variant="gold" size="xl" onClick={handleSave} disabled={isSaving} className="h-16 px-10 rounded-2xl shadow-2xl uppercase tracking-[4px] text-xs font-black group">
          {isSaving ? 'Saving...' : (
            <>
              <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              Save Prices
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ticket Prices Card */}
        <div className="glass-card p-10 space-y-8 relative overflow-hidden">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                 <Coins className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-display font-bold text-white italic">Base Prices</h2>
                 <p className="text-[10px] uppercase tracking-[3px] text-muted-foreground font-black">Standard Seat Rates</p>
              </div>
           </div>

           <div className="space-y-6">
             <div className="space-y-3">
               <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Front Row (Rows 1-3)</Label>
               <div className="relative group">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xs tracking-widest opacity-40 group-focus-within:opacity-100 transition-opacity">
                   NPR
                 </span>
                 <Input
                   type="number"
                   value={pricingData.frontRow}
                   onChange={(e) => setPricingData({ ...pricingData, frontRow: parseInt(e.target.value) || 0 })}
                   className="h-16 bg-white/5 border-white/5 rounded-2xl pl-20 text-2xl font-display font-bold focus:border-primary/40 transition-all shadow-xl italic"
                 />
               </div>
             </div>

             <div className="space-y-3">
               <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Standard Row (Other Rows)</Label>
               <div className="relative group">
                 <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-xs tracking-widest opacity-40 group-focus-within:opacity-100 transition-opacity">
                   NPR
                 </span>
                 <Input
                   type="number"
                   value={pricingData.normal}
                   onChange={(e) => setPricingData({ ...pricingData, normal: parseInt(e.target.value) || 0 })}
                   className="h-16 bg-white/5 border-white/5 rounded-2xl pl-20 text-2xl font-display font-bold focus:border-primary/40 transition-all shadow-xl italic"
                 />
               </div>
             </div>
           </div>
        </div>


        <div className="glass-card p-10 space-y-8 relative overflow-hidden">
           <div className="flex items-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                 <Percent className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-2xl font-display font-bold text-white italic">Weekday Deals</h2>
                 <p className="text-[10px] uppercase tracking-[3px] text-muted-foreground font-black">Tuesday & Wednesday Discounts</p>
              </div>
           </div>

           <div className="space-y-6">
             <div className="space-y-3">
               <Label className="text-[10px] uppercase tracking-widest font-black text-muted-foreground ml-1">Discount Percentage (%)</Label>
               <div className="relative group max-w-xs">
                 <Input
                   type="number"
                   min={0}
                   max={100}
                   value={pricingData.discountPercent}
                   onChange={(e) => setPricingData({
                     ...pricingData,
                     discountPercent: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)),
                   })}
                   className="h-16 bg-white/5 border-white/5 rounded-2xl pr-16 text-2xl font-display font-bold focus:border-amber-500/40 transition-all shadow-xl italic"
                 />
                 <span className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-500 font-black text-xl italic opacity-40 group-focus-within:opacity-100 transition-opacity">
                   %
                 </span>
               </div>
             </div>

             <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                <CalendarIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground font-light leading-relaxed">
                  A <span className="text-emerald-500 font-bold">{pricingData.discountPercent}%</span> discount is automatically applied during ticket booking on <span className="text-white font-bold">Tuesday</span> and <span className="text-white font-bold">Wednesday</span>.
                </p>
             </div>
           </div>
        </div>
      </div>

       <div className="glass-card p-8 border-white/5 overflow-hidden">
         <div className="flex items-center gap-4 mb-6">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-display font-bold italic text-white tracking-widest uppercase">Price Preview</h2>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black mb-1">Front Row Special (Tue/Wed)</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-display font-black text-primary italic">NPR {calculateDiscountedPrice(pricingData.frontRow)}</span>
                   <span className="text-xs text-muted-foreground line-through">NPR {pricingData.frontRow}</span>
                </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-black mb-1">Standard Row Special (Tue/Wed)</p>
                <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-display font-black text-primary italic">NPR {calculateDiscountedPrice(pricingData.normal)}</span>
                   <span className="text-xs text-muted-foreground line-through">NPR {pricingData.normal}</span>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminPricing;

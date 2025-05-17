
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from '@/integrations/supabase/client';
import { useSecurity } from '@/context/SecurityContext';
import { useToast } from '@/hooks/use-toast';
import { usePerformanceData } from '@/hooks/usePerformanceData';

const AddMatchForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [opponent, setOpponent] = useState('');
  const [location, setLocation] = useState('');
  const [score, setScore] = useState('');
  const [result, setResult] = useState<'win' | 'loss'>('win');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useSecurity();
  const { toast } = useToast();
  const { updatePerformanceData } = usePerformanceData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para añadir un partido",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const date = new Date().toISOString();
      const month = new Date().toLocaleDateString('es-ES', { month: 'short' });
      
      const { data, error } = await supabase
        .from('matches')
        .insert({
          user_id: user.id,
          opponent,
          location,
          score,
          result,
          date
        })
        .select();
      
      if (error) throw error;

      // Update performance data
      await updatePerformanceData(month, result);
      
      toast({
        title: "¡Partido añadido!",
        description: `Has añadido tu partido contra ${opponent}`,
      });
      
      // Reset form and close dialog
      setOpponent('');
      setLocation('');
      setScore('');
      setResult('win');
      setIsOpen(false);
      
      // Reload page to refresh data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error al añadir el partido",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="md:hidden">+</span>
          <span className="hidden md:inline">Nuevo partido</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Añadir nuevo partido</DialogTitle>
            <DialogDescription>
              Registra los detalles de tu último partido de pádel.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="opponent" className="col-span-1">Oponente</Label>
              <Input
                id="opponent"
                className="col-span-3"
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="col-span-1">Lugar</Label>
              <Input
                id="location"
                className="col-span-3"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="score" className="col-span-1">Marcador</Label>
              <Input
                id="score"
                className="col-span-3"
                placeholder="6-4, 7-5"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-1">Resultado</Label>
              <RadioGroup
                className="col-span-3"
                value={result}
                onValueChange={(value) => setResult(value as 'win' | 'loss')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="win" id="win" />
                  <Label htmlFor="win" className="text-green-600">Victoria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="loss" id="loss" />
                  <Label htmlFor="loss" className="text-red-500">Derrota</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar partido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMatchForm;


import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/hooks/use-toast';
import { Pencil } from 'lucide-react';
import { demoSkills } from '@/utils/demoData';

const DEFAULT_SKILLS = [
  { name: 'Forehand', value: 50 },
  { name: 'Backhand', value: 50 },
  { name: 'Volley', value: 50 },
  { name: 'Smash', value: 50 },
  { name: 'Serve', value: 50 },
  { name: 'Lob', value: 50 }
];

const EditSkillsForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [skills, setSkills] = useState<{name: string, value: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Initialize with demo skills
      const initialSkills = demoSkills.map(skill => ({ 
        name: skill.name, 
        value: skill.value 
      }));
      
      setSkills(initialSkills);
    }
    setIsOpen(open);
  };

  const handleSliderChange = (index: number, value: number[]) => {
    const newSkills = [...skills];
    newSkills[index].value = value[0];
    setSkills(newSkills);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulating success with demo data
      setTimeout(() => {
        toast({
          title: "Habilidades actualizadas",
          description: "Tus habilidades han sido actualizadas exitosamente.",
        });
        
        setIsOpen(false);
        setIsSubmitting(false);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "No se pudieron actualizar las habilidades.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Pencil className="w-3 h-3" />
          <span>Editar habilidades</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar habilidades</DialogTitle>
          <DialogDescription>
            Actualiza tus niveles de habilidad en cada aspecto del juego.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {skills.map((skill, index) => (
            <div key={skill.name} className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-1">{skill.name}</Label>
              <div className="col-span-2">
                <Slider
                  value={[skill.value]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(value) => handleSliderChange(index, value)}
                />
              </div>
              <div className="col-span-1 text-center">{skill.value}/100</div>
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditSkillsForm;

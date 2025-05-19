
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { allPadelSkills, padelSkills, Skill } from '@/types/assessment';
import { Checkbox } from '@/components/ui/checkbox';

interface NewAssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (skills: Skill[]) => void;
  currentSkills: Skill[];
}

const NewAssessmentDialog: React.FC<NewAssessmentDialogProps> = ({ 
  open,
  onOpenChange,
  onSave,
  currentSkills = []
}) => {
  const [skillValues, setSkillValues] = useState<Skill[]>(
    allPadelSkills.map(name => {
      const existingSkill = currentSkills.find(skill => skill.name === name);
      return {
        name,
        value: existingSkill?.value || 0
      };
    })
  );
  
  const [notes, setNotes] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentSkills.map(skill => skill.name)
  );
  
  const handleSkillChange = (name: string, value: number) => {
    setSkillValues(prev => 
      prev.map(skill => 
        skill.name === name ? { ...skill, value } : skill
      )
    );
  };
  
  const toggleSkill = (name: string) => {
    setSelectedSkills(prev => 
      prev.includes(name) 
        ? prev.filter(skill => skill !== name) 
        : [...prev, name]
    );
  };
  
  const handleSave = () => {
    const filteredSkills = skillValues.filter(skill => 
      selectedSkills.includes(skill.name)
    );
    onSave(filteredSkills);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nueva evaluación</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="beginners" className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="beginners">Principiantes</TabsTrigger>
            <TabsTrigger value="intermediate">Intermedios</TabsTrigger>
            <TabsTrigger value="advanced">Avanzados</TabsTrigger>
            <TabsTrigger value="pro">PRO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="beginners" className="space-y-4 mt-4">
            {padelSkills.beginners.map(skillName => (
              <SkillAssessmentItem 
                key={skillName}
                name={skillName}
                value={skillValues.find(s => s.name === skillName)?.value || 0}
                onChange={handleSkillChange}
                checked={selectedSkills.includes(skillName)}
                onToggle={toggleSkill}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="intermediate" className="space-y-4 mt-4">
            {padelSkills.intermediate.map(skillName => (
              <SkillAssessmentItem 
                key={skillName}
                name={skillName}
                value={skillValues.find(s => s.name === skillName)?.value || 0}
                onChange={handleSkillChange}
                checked={selectedSkills.includes(skillName)}
                onToggle={toggleSkill}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4 mt-4">
            {padelSkills.advanced.map(skillName => (
              <SkillAssessmentItem 
                key={skillName}
                name={skillName}
                value={skillValues.find(s => s.name === skillName)?.value || 0}
                onChange={handleSkillChange}
                checked={selectedSkills.includes(skillName)}
                onToggle={toggleSkill}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="pro" className="space-y-4 mt-4">
            {padelSkills.pro.map(skillName => (
              <SkillAssessmentItem 
                key={skillName}
                name={skillName}
                value={skillValues.find(s => s.name === skillName)?.value || 0}
                onChange={handleSkillChange}
                checked={selectedSkills.includes(skillName)}
                onToggle={toggleSkill}
              />
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="space-y-2 mt-4">
          <label htmlFor="notes" className="text-sm font-medium">Notas adicionales</label>
          <Textarea 
            id="notes" 
            placeholder="Añade notas sobre el progreso o aspectos a mejorar..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave}>Guardar evaluación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface SkillAssessmentItemProps {
  name: string;
  value: number;
  onChange: (name: string, value: number) => void;
  checked: boolean;
  onToggle: (name: string) => void;
}

const SkillAssessmentItem: React.FC<SkillAssessmentItemProps> = ({
  name,
  value,
  onChange,
  checked,
  onToggle
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id={`skill-${name}`}
            checked={checked}
            onCheckedChange={() => onToggle(name)}
          />
          <label 
            htmlFor={`skill-${name}`}
            className={`text-sm font-medium ${!checked ? 'text-gray-400' : ''}`}
          >
            {name}
          </label>
        </div>
        <span className="text-sm font-medium">{value}</span>
      </div>
      <Slider
        disabled={!checked}
        value={[value]}
        min={0}
        max={100}
        step={1}
        className={!checked ? 'opacity-50' : ''}
        onValueChange={(values) => onChange(name, values[0])}
      />
    </div>
  );
};

export default NewAssessmentDialog;

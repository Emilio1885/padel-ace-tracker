
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Plus } from "lucide-react";
import { demoPlayer, demoSkills, demoPerformance } from '@/utils/demoData';
import SkillsRadar from '@/components/SkillsRadar';
import PerformanceChart from '@/components/PerformanceChart';
import StatCard from '@/components/StatCard';
import AssessmentHistory from '@/components/AssessmentHistory';
import NewAssessmentDialog from '@/components/NewAssessmentDialog';
import { playerLevels } from '@/types/assessment';
import { Award, ChartLine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isNewAssessmentOpen, setIsNewAssessmentOpen] = useState(false);
  
  // In a real app, fetch the player data from your API
  const player = {...demoPlayer, id: id || 'demo'};
  const [playerLevel, setPlayerLevel] = useState<string>(player.level || 'D');
  
  // Demo assessment history
  const [assessments, setAssessments] = useState([
    {
      id: "1",
      date: "2023-10-15",
      skills: demoSkills
    },
    {
      id: "2",
      date: "2023-11-15",
      skills: demoSkills.map(skill => ({
        ...skill,
        value: Math.min(100, skill.value + Math.floor(Math.random() * 15))
      }))
    }
  ]);
  
  // Stats for the player
  const skillsData = {
    skills: assessments[assessments.length - 1]?.skills || demoSkills,
    bestSkill: {
      name: "Derecha",
      value: 85
    },
    improvement: 12,
    improvementVsPrevious: 4
  };
  
  const handleLevelChange = (value: string) => {
    setPlayerLevel(value);
    toast({
      title: "Nivel actualizado",
      description: `El nivel de ${player.name} ha sido actualizado a ${value}`,
    });
  };
  
  const handleNewAssessment = (newSkills: any) => {
    const newAssessment = {
      id: `${assessments.length + 1}`,
      date: new Date().toISOString().split('T')[0],
      skills: newSkills
    };
    
    setAssessments([...assessments, newAssessment]);
    setIsNewAssessmentOpen(false);
    
    toast({
      title: "Evaluación completada",
      description: "La nueva evaluación ha sido guardada correctamente",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button variant="outline" onClick={() => window.history.back()} className="mb-4">
            &larr; Volver a alumnos
          </Button>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 border-2 border-padel-blue">
                  <AvatarImage src={player.image} />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <h1 className="text-2xl font-bold">{player.name}</h1>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">Nivel:</span>
                      <Select value={playerLevel} onValueChange={handleLevelChange}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="D-">D-</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                          <SelectItem value="D+">D+</SelectItem>
                          <SelectItem value="C-">C-</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="C+">C+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="A">A</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button 
                        onClick={() => setIsNewAssessmentOpen(true)}
                        className="flex items-center gap-2 bg-padel-green hover:bg-padel-green/90"
                      >
                        <Plus className="h-4 w-4" />
                        Nueva evaluación
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-padel-lightblue text-padel-blue border-padel-blue flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {Math.round((player.wins / player.matches) * 100)}% efectividad
                    </Badge>
                    <Badge variant="outline">
                      {assessments.length} evaluaciones
                    </Badge>
                    <Badge variant="outline">
                      Alumno desde {new Date(player.since || '2023-01-15').toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Mejor habilidad" 
            value={skillsData.bestSkill.name} 
            subtitle={`${skillsData.bestSkill.value}/100 puntos`}
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard 
            title="Mejora mensual" 
            value={`${skillsData.improvement}%`}
            trend={skillsData.improvement > 0 ? "up" : "neutral"}
            trendValue={`${skillsData.improvementVsPrevious > 0 ? '+' : ''}${skillsData.improvementVsPrevious}% vs. mes anterior`}
            icon={<ChartLine className="w-5 h-5" />}
          />
          <StatCard 
            title="Partidos jugados" 
            value={player.matches.toString()} 
            subtitle={`${player.wins} ganados, ${player.losses} perdidos`}
          />
          <StatCard 
            title="Último assessment" 
            value={new Date(assessments[assessments.length - 1]?.date || '').toLocaleDateString()} 
            subtitle={`${assessments.length} evaluaciones totales`}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SkillsRadar 
            data={assessments[assessments.length - 1]?.skills || demoSkills}
            onNewAssessment={() => setIsNewAssessmentOpen(true)}
            showAddButton
          />
          <PerformanceChart data={demoPerformance} />
        </div>
        
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader>
            <h3 className="text-lg font-semibold">Historial de evaluaciones</h3>
          </CardHeader>
          <CardContent>
            <AssessmentHistory assessments={assessments} />
          </CardContent>
        </Card>
      </main>
      
      <NewAssessmentDialog
        open={isNewAssessmentOpen}
        onOpenChange={setIsNewAssessmentOpen}
        onSave={handleNewAssessment}
        currentSkills={assessments[assessments.length - 1]?.skills || demoSkills}
      />
    </div>
  );
};

export default PlayerProfile;

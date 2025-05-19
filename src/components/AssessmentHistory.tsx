
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Assessment, Skill } from '@/types/assessment';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ChevronDown, ChevronRight, ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssessmentHistoryProps {
  assessments: Assessment[];
}

const AssessmentHistory: React.FC<AssessmentHistoryProps> = ({ assessments }) => {
  const [expandedAssessments, setExpandedAssessments] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({
    key: 'date',
    direction: 'descending',
  });

  const toggleAssessment = (id: string) => {
    setExpandedAssessments(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssessments = [...assessments].sort((a, b) => {
    if (sortConfig.key === 'date') {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortConfig.direction === 'ascending' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd MMM yyyy', { locale: es });
  };

  const getSkillDiff = (currentAssessmentIndex: number, skillName: string) => {
    if (currentAssessmentIndex === 0) return null;
    
    const currentValue = sortedAssessments[currentAssessmentIndex].skills.find(
      s => s.name === skillName
    )?.value || 0;
    
    const previousValue = sortedAssessments[currentAssessmentIndex - 1].skills.find(
      s => s.name === skillName
    )?.value || 0;
    
    return currentValue - previousValue;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => requestSort('date')}
                className="flex items-center"
              >
                Fecha
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Habilidades evaluadas</TableHead>
            <TableHead>Promedio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssessments.map((assessment, index) => {
            const isExpanded = expandedAssessments.includes(assessment.id);
            const averageScore = assessment.skills.reduce(
              (acc, skill) => acc + skill.value, 0
            ) / assessment.skills.length;
            
            return (
              <React.Fragment key={assessment.id}>
                <TableRow className="cursor-pointer hover:bg-slate-50" onClick={() => toggleAssessment(assessment.id)}>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium">{formatDate(assessment.date)}</TableCell>
                  <TableCell>{assessment.skills.length} habilidades</TableCell>
                  <TableCell>{Math.round(averageScore)}/100</TableCell>
                </TableRow>
                
                {isExpanded && (
                  <TableRow>
                    <TableCell colSpan={4} className="p-0">
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <h4 className="font-medium mb-2">Detalles de la evaluación</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {assessment.skills.map(skill => {
                            const diff = getSkillDiff(index, skill.name);
                            return (
                              <div key={skill.name} className="flex justify-between items-center p-2 border rounded">
                                <span>{skill.name}</span>
                                <div className="flex items-center">
                                  <span className="font-medium">{skill.value}</span>
                                  {diff !== null && (
                                    <span className={cn(
                                      "ml-2 text-xs",
                                      diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-500"
                                    )}>
                                      {diff > 0 ? `+${diff}` : diff}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      
      {assessments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay evaluaciones registradas todavía.
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;

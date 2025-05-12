
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { Match } from '@/utils/demoData';

interface MatchHistoryProps {
  matches: Match[];
}

const MatchHistory: React.FC<MatchHistoryProps> = ({ matches }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    }).format(date);
  };
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-lg font-semibold">Historial de partidos</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> 
          Últimos {matches.length}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {matches.map(match => (
            <div 
              key={match.id} 
              className="flex items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-12 text-center">
                <p className="font-medium text-gray-900">{formatDate(match.date)}</p>
              </div>
              
              <div className="ml-4 flex-1">
                <p className="font-medium">vs. {match.opponent}</p>
                <p className="text-sm text-gray-500">{match.location}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{match.score}</span>
                <Badge 
                  variant="outline" 
                  className={match.result === 'win' 
                    ? "bg-padel-lightgreen text-padel-green border-padel-green" 
                    : "bg-red-50 text-red-500 border-red-200"}
                >
                  {match.result === 'win' ? 'Victoria' : 'Derrota'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchHistory;

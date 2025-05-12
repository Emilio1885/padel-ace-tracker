
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { Player } from '@/utils/demoData';

interface PlayerProfileProps {
  player: Player;
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({ player }) => {
  const winRate = Math.round((player.wins / player.matches) * 100);
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Perfil del jugador</h3>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <Avatar className="w-24 h-24 border-2 border-padel-blue">
            <AvatarImage src={player.image} />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h2 className="text-xl font-bold text-center md:text-left">{player.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge variant="outline" className="bg-padel-lightblue text-padel-blue border-padel-blue">
                Nivel {player.level}
              </Badge>
              <Badge variant="outline" className="bg-padel-lightgreen text-padel-green border-padel-green flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {winRate}% victorias
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="text-center">
                <p className="stat-value">{player.matches}</p>
                <p className="stat-label">Partidos</p>
              </div>
              <div className="text-center">
                <p className="stat-value text-padel-green">{player.wins}</p>
                <p className="stat-label">Victorias</p>
              </div>
              <div className="text-center">
                <p className="stat-value text-red-500">{player.losses}</p>
                <p className="stat-label">Derrotas</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerProfile;

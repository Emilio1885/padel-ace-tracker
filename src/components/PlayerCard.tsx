
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { Player } from '@/utils/demoData';

interface PlayerCardProps {
  player: Player & { id: string };
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const winRate = Math.round((player.wins / player.matches) * 100);
  
  // Function to determine badge color based on level
  const getLevelBadgeClass = (level: string) => {
    if (level.startsWith('D')) return "bg-blue-100 text-blue-600 border-blue-200";
    if (level.startsWith('C')) return "bg-green-100 text-green-600 border-green-200";
    if (level.startsWith('B')) return "bg-orange-100 text-orange-600 border-orange-200";
    if (level.startsWith('A')) return "bg-red-100 text-red-600 border-red-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <Link to={`/player/${player.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-padel-blue">
              <AvatarImage src={player.image} />
              <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className={`${getLevelBadgeClass(player.level)}`}>
                  Nivel {player.level}
                </Badge>
                <Badge variant="outline" className="bg-padel-lightblue text-padel-blue border-padel-blue">
                  {winRate}% efectividad
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PlayerCard;

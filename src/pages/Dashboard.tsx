
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import { demoPlayer } from '@/utils/demoData';
import PlayerCard from '@/components/PlayerCard';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Demo players list - in a real app, this would come from a database
  const demoPlayers = Array(6).fill(null).map((_, index) => ({
    ...demoPlayer,
    id: `player-${index + 1}`,
    name: `${demoPlayer.name} ${index + 1}`,
    level: ['D-', 'D', 'D+', 'C-', 'C', 'C+', 'B-', 'B', 'B+', 'A'][index % 10]
  }));
  
  const filteredPlayers = demoPlayers.filter(player => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Mis Alumnos</h1>
          <Link to="/player/new">
            <Button className="flex items-center gap-2 bg-padel-green hover:bg-padel-green/90">
              <Plus className="h-4 w-4" />
              <span>Nuevo Alumno</span>
            </Button>
          </Link>
        </div>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar alumnos..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

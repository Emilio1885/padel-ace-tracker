
import React from 'react';
import Navbar from '@/components/Navbar';
import PlayerProfile from '@/components/PlayerProfile';
import MatchHistory from '@/components/MatchHistory';
import PerformanceChart from '@/components/PerformanceChart';
import SkillsRadar from '@/components/SkillsRadar';
import StatCard from '@/components/StatCard';
import { demoPlayer, demoMatches, demoPerformance, demoSkills } from '@/utils/demoData';
import { Award, Calendar, ChartLine, Trophy } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Panel de seguimiento</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            <PlayerProfile player={demoPlayer} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Partidos este mes" 
            value="6" 
            trend="up"
            trendValue="+2 vs. mes anterior"
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard 
            title="Victorias consecutivas" 
            value="3" 
            trend="neutral"
            trendValue="Sin cambios"
            icon={<Trophy className="w-5 h-5" />}
          />
          <StatCard 
            title="Mejor habilidad" 
            value="Forehand" 
            subtitle="85/100 puntos"
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard 
            title="Mejora mensual" 
            value="12%" 
            trend="up"
            trendValue="+4% vs. mes anterior"
            icon={<ChartLine className="w-5 h-5" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceChart data={demoPerformance} />
          <SkillsRadar data={demoSkills} />
        </div>
        
        <div className="mb-6">
          <MatchHistory matches={demoMatches} />
        </div>
      </main>
    </div>
  );
};

export default Index;

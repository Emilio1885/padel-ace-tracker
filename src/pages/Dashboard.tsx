
import React from 'react';
import Navbar from '@/components/Navbar';
import PlayerProfile from '@/components/PlayerProfile';
import MatchHistory from '@/components/MatchHistory';
import PerformanceChart from '@/components/PerformanceChart';
import SkillsRadar from '@/components/SkillsRadar';
import StatCard from '@/components/StatCard';
import { demoPlayer, demoMatches, demoPerformance, demoSkills } from '@/utils/demoData';
import { Award, Calendar, ChartLine, Trophy } from 'lucide-react';

const Dashboard: React.FC = () => {
  // Use demo data instead of authenticated data
  const player = demoPlayer;
  const matches = demoMatches;
  const performanceData = demoPerformance;
  const skillsData = {
    skills: demoSkills,
    bestSkill: {
      name: "Forehand",
      value: 85
    },
    improvement: 12,
    improvementVsPrevious: 4
  };
  
  const matchStats = {
    total: 24,
    wins: 16,
    losses: 8,
    streak: 3,
    streakTrend: 'up' as const,
    streakTrendValue: '+1 victoria',
    thisMonth: 6,
    trend: 'up' as const,
    trendValue: '+2'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Panel de seguimiento</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            <PlayerProfile player={player} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard 
            title="Partidos este mes" 
            value={matchStats.thisMonth.toString()} 
            trend={matchStats.trend}
            trendValue={`${matchStats.trendValue} vs. mes anterior`}
            icon={<Calendar className="w-5 h-5" />}
          />
          <StatCard 
            title="Victorias consecutivas" 
            value={matchStats.streak.toString()} 
            trend={matchStats.streakTrend}
            trendValue={matchStats.streakTrendValue}
            icon={<Trophy className="w-5 h-5" />}
          />
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
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceChart data={performanceData} />
          <SkillsRadar data={demoSkills} />
        </div>
        
        <div className="mb-6">
          <MatchHistory matches={matches} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

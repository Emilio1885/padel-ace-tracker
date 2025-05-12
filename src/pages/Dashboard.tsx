
import React from 'react';
import Navbar from '@/components/Navbar';
import PlayerProfile from '@/components/PlayerProfile';
import MatchHistory from '@/components/MatchHistory';
import PerformanceChart from '@/components/PerformanceChart';
import SkillsRadar from '@/components/SkillsRadar';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { useMatchData } from '@/hooks/useMatchData';
import { usePerformanceData } from '@/hooks/usePerformanceData';
import { useSkillsData } from '@/hooks/useSkillsData';
import { Award, Calendar, ChartLine, Trophy } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { matches, matchStats } = useMatchData();
  const { performanceData } = usePerformanceData();
  const { skillsData } = useSkillsData();

  if (!user || !profile) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Panel de seguimiento</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-3">
            {profile && (
              <PlayerProfile 
                player={{
                  id: profile.id,
                  name: profile.name,
                  image: profile.image || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
                  level: profile.level,
                  matches: matchStats.total,
                  wins: matchStats.wins,
                  losses: matchStats.losses
                }} 
              />
            )}
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
            value={skillsData.bestSkill.name || "N/A"} 
            subtitle={`${skillsData.bestSkill.value || 0}/100 puntos`}
            icon={<Award className="w-5 h-5" />}
          />
          <StatCard 
            title="Mejora mensual" 
            value={`${skillsData.improvement || 0}%`} 
            trend={skillsData.improvement > 0 ? "up" : "neutral"}
            trendValue={`${skillsData.improvementVsPrevious > 0 ? '+' : ''}${skillsData.improvementVsPrevious}% vs. mes anterior`}
            icon={<ChartLine className="w-5 h-5" />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PerformanceChart data={performanceData} />
          <SkillsRadar data={skillsData.skills} />
        </div>
        
        <div className="mb-6">
          <MatchHistory matches={matches} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

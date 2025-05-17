
import React from 'react';
import Navbar from '@/components/Navbar';
import PlayerProfile from '@/components/PlayerProfile';
import MatchHistory from '@/components/MatchHistory';
import PerformanceChart from '@/components/PerformanceChart';
import SkillsRadar from '@/components/SkillsRadar';
import StatCard from '@/components/StatCard';
import { demoPlayer, demoMatches, demoPerformance, demoSkills } from '@/utils/demoData';
import { Award, Calendar, ChartLine, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSecurity } from '@/context/SecurityContext';
import { Navigate } from 'react-router-dom';

const Index: React.FC = () => {
  const { user } = useSecurity();
  
  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/" />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-padel-blue to-padel-green rounded-lg"></div>
            <h1 className="text-xl font-bold text-gray-900">PadelTracker</h1>
          </div>
          
          <div>
            <Link to="/login">
              <Button>Iniciar Sesión</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Seguimiento de crecimiento para jugadores de pádel</h1>
          <p className="text-xl text-gray-700 mb-6">
            Registra tus partidos, monitorea tu progreso y mejora tu juego con PadelTracker
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="font-semibold">Comenzar ahora</Button>
            </Link>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">Panel de seguimiento (Demo)</h1>
        
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
        
        <div className="text-center mt-10 mb-6">
          <h2 className="text-2xl font-bold mb-4">¿Listo para mejorar tu juego?</h2>
          <Link to="/login">
            <Button size="lg" className="font-semibold">Registrarse gratis</Button>
          </Link>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2025 PadelTracker - Seguimiento de jugadores de pádel</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

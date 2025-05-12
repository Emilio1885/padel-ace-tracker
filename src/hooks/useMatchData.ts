
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type Match = Tables<'matches'> & {
  formattedDate?: string;
};

type MatchStats = {
  total: number;
  wins: number;
  losses: number;
  thisMonth: number;
  lastMonth: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  streak: number;
  streakTrend: 'up' | 'down' | 'neutral';
  streakTrendValue: string;
};

export function useMatchData() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [matchStats, setMatchStats] = useState<MatchStats>({
    total: 0,
    wins: 0,
    losses: 0,
    thisMonth: 0,
    lastMonth: 0,
    trend: 'neutral',
    trendValue: '0',
    streak: 0,
    streakTrend: 'neutral',
    streakTrendValue: 'Sin cambios'
  });

  useEffect(() => {
    if (!user) return;
    
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
        
        if (error) {
          throw new Error(error.message);
        }

        // Process the data
        const processedMatches = data.map(match => ({
          ...match,
          formattedDate: new Date(match.date).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short'
          })
        }));
        
        setMatches(processedMatches);
        
        // Calculate stats
        const total = processedMatches.length;
        const wins = processedMatches.filter(m => m.result === 'win').length;
        const losses = total - wins;
        
        // Calculate matches this month
        const now = new Date();
        const thisMonth = processedMatches.filter(m => {
          const matchDate = new Date(m.date);
          return matchDate.getMonth() === now.getMonth() && 
                 matchDate.getFullYear() === now.getFullYear();
        }).length;
        
        // Calculate matches last month
        const lastMonthDate = new Date(now);
        lastMonthDate.setMonth(now.getMonth() - 1);
        const lastMonth = processedMatches.filter(m => {
          const matchDate = new Date(m.date);
          return matchDate.getMonth() === lastMonthDate.getMonth() && 
                 matchDate.getFullYear() === lastMonthDate.getFullYear();
        }).length;
        
        // Calculate trend
        let trend: 'up' | 'down' | 'neutral' = 'neutral';
        let trendValue = '0';
        
        if (thisMonth > lastMonth) {
          trend = 'up';
          trendValue = `+${thisMonth - lastMonth}`;
        } else if (thisMonth < lastMonth) {
          trend = 'down';
          trendValue = `${thisMonth - lastMonth}`;
        } else {
          trend = 'neutral';
          trendValue = '0';
        }
        
        // Calculate streak
        let streak = 0;
        let currentStreak = 0;
        let previousStreak = 0;
        let lastResult = '';
        
        // Get current streak
        for (const match of processedMatches) {
          if (match.result === 'win') {
            if (lastResult === 'win' || lastResult === '') {
              currentStreak++;
            } else {
              break;
            }
          } else {
            break;
          }
          lastResult = match.result;
        }
        
        // Get streak from previous reporting period
        const previousPeriodMatches = [...processedMatches].slice(currentStreak);
        lastResult = '';
        for (const match of previousPeriodMatches) {
          if (match.result === 'win') {
            if (lastResult === 'win' || lastResult === '') {
              previousStreak++;
            } else {
              break;
            }
          } else {
            break;
          }
          lastResult = match.result;
        }
        
        streak = currentStreak;
        
        // Calculate streak trend
        let streakTrend: 'up' | 'down' | 'neutral' = 'neutral';
        let streakTrendValue = 'Sin cambios';
        
        if (currentStreak > previousStreak) {
          streakTrend = 'up';
          streakTrendValue = `+${currentStreak - previousStreak}`;
        } else if (currentStreak < previousStreak) {
          streakTrend = 'down';
          streakTrendValue = `${currentStreak - previousStreak}`;
        } else {
          streakTrend = 'neutral';
          streakTrendValue = 'Sin cambios';
        }
        
        setMatchStats({
          total,
          wins,
          losses,
          thisMonth,
          lastMonth,
          trend,
          trendValue,
          streak,
          streakTrend,
          streakTrendValue
        });

      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  return { matches, matchStats, isLoading, error };
}

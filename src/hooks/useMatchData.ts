
import { useState, useEffect } from 'react';
import { useSecurity } from '@/context/SecurityContext';
import { supabase } from '@/integrations/supabase/client';
import { Match } from '@/types/match';

interface MatchStats {
  total: number;
  wins: number;
  losses: number;
  streak: number;
  streakTrend: 'up' | 'down' | 'neutral';
  streakTrendValue: string;
  thisMonth: number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export function useMatchData() {
  const { user } = useSecurity();
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchStats, setMatchStats] = useState<MatchStats>({
    total: 0,
    wins: 0,
    losses: 0,
    streak: 0,
    streakTrend: 'neutral',
    streakTrendValue: 'Sin cambios',
    thisMonth: 0,
    trend: 'neutral',
    trendValue: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

        // Convert the database result to Match type
        const typedMatches: Match[] = data.map(match => ({
          id: match.id,
          date: match.date,
          opponent: match.opponent,
          result: match.result as "win" | "loss",
          score: match.score,
          location: match.location
        }));

        setMatches(typedMatches);
        
        // Calculate statistics
        const total = typedMatches.length;
        const wins = typedMatches.filter(match => match.result === 'win').length;
        const losses = total - wins;
        
        // Calculate streak
        let currentStreak = 0;
        let streakType = typedMatches[0]?.result;
        
        for (let i = 0; i < typedMatches.length; i++) {
          if (typedMatches[i].result === streakType) {
            currentStreak++;
          } else {
            break;
          }
        }
        
        // Calculate this month matches
        const now = new Date();
        const thisMonth = typedMatches.filter(match => {
          const matchDate = new Date(match.date);
          return matchDate.getMonth() === now.getMonth() &&
                 matchDate.getFullYear() === now.getFullYear();
        }).length;
        
        // Random values for demo purposes (in a real app, compare with previous period)
        const monthDiff = Math.floor(Math.random() * 5) - 2;
        const trend = monthDiff > 0 ? 'up' : monthDiff < 0 ? 'down' : 'neutral';
        const streakTrend = Math.random() > 0.5 ? 'up' : 'neutral';
        
        setMatchStats({
          total,
          wins,
          losses,
          streak: currentStreak,
          streakTrend,
          streakTrendValue: streakTrend === 'up' ? '+1 victoria' : 'Sin cambios',
          thisMonth,
          trend,
          trendValue: monthDiff.toString()
        });
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  // Function to add a new match
  const addMatch = async (match: Omit<Match, 'id'>) => {
    if (!user) return null;

    try {
      // Insert match
      const { data, error } = await supabase
        .from('matches')
        .insert({
          user_id: user.id,
          date: match.date,
          opponent: match.opponent,
          result: match.result,
          score: match.score,
          location: match.location
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Update performance data for the month
      const date = new Date(match.date);
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      const monthName = monthNames[date.getMonth()];
      
      // Update performance table for the month
      const { data: performanceData } = await supabase
        .from('performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', monthName)
        .maybeSingle();
      
      if (performanceData) {
        // Update existing record
        await supabase
          .from('performance')
          .update({
            wins: match.result === 'win' ? performanceData.wins + 1 : performanceData.wins,
            losses: match.result === 'loss' ? performanceData.losses + 1 : performanceData.losses
          })
          .eq('id', performanceData.id);
      } else {
        // Insert new record
        await supabase
          .from('performance')
          .insert({
            user_id: user.id,
            month: monthName,
            wins: match.result === 'win' ? 1 : 0,
            losses: match.result === 'loss' ? 1 : 0
          });
      }
      
      // Refresh matches
      const newMatch: Match = {
        id: data.id,
        date: data.date,
        opponent: data.opponent,
        result: data.result as "win" | "loss",
        score: data.score,
        location: data.location
      };
      
      setMatches(prev => [newMatch, ...prev]);
      
      // Update stats
      setMatchStats(prev => {
        const newTotal = prev.total + 1;
        const newWins = prev.wins + (match.result === 'win' ? 1 : 0);
        const newLosses = prev.losses + (match.result === 'loss' ? 1 : 0);
        
        return {
          ...prev,
          total: newTotal,
          wins: newWins,
          losses: newLosses,
          thisMonth: prev.thisMonth + 1
        };
      });
      
      return newMatch;
    } catch (err) {
      console.error('Error adding match:', err);
      return null;
    }
  };

  return { matches, matchStats, isLoading, error, addMatch };
}

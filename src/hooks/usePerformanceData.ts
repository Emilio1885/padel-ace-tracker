
import { useState, useEffect } from 'react';
import { useSecurity } from '@/context/SecurityContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

export type PerformanceData = Tables<'performance'>;

export function usePerformanceData() {
  const { user } = useSecurity();
  const [performanceData, setPerformanceData] = useState<{month: string, wins: number, losses: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchPerformanceData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('performance')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at');
        
        if (error) {
          throw new Error(error.message);
        }

        // If no data, generate default months with zeroes
        if (data.length === 0) {
          const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"];
          const defaultData = months.map(month => ({
            month,
            wins: 0,
            losses: 0
          }));
          setPerformanceData(defaultData);
        } else {
          setPerformanceData(data.map(item => ({
            month: item.month,
            wins: item.wins,
            losses: item.losses
          })));
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerformanceData();
  }, [user]);

  // Function to update performance data for a specific month
  const updatePerformanceData = async (month: string, result: 'win' | 'loss') => {
    if (!user) return;

    try {
      // Check if data exists for this month
      const { data: existingData } = await supabase
        .from('performance')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', month)
        .single();

      if (existingData) {
        // Update existing record
        const updates = {
          wins: result === 'win' ? existingData.wins + 1 : existingData.wins,
          losses: result === 'loss' ? existingData.losses + 1 : existingData.losses
        };

        await supabase
          .from('performance')
          .update(updates)
          .eq('id', existingData.id);
      } else {
        // Insert new record
        await supabase
          .from('performance')
          .insert({
            user_id: user.id,
            month,
            wins: result === 'win' ? 1 : 0,
            losses: result === 'loss' ? 1 : 0
          });
      }

      // Refetch data
      const { data, error } = await supabase
        .from('performance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');
        
      if (error) throw new Error(error.message);
      
      setPerformanceData(data.map(item => ({
        month: item.month,
        wins: item.wins,
        losses: item.losses
      })));
    } catch (err) {
      console.error('Error updating performance data:', err);
    }
  };

  return { performanceData, isLoading, error, updatePerformanceData };
}

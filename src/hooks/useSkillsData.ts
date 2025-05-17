import { useState, useEffect } from 'react';
import { useSecurity } from '@/context/SecurityContext';
import { supabase } from '@/integrations/supabase/client';

export type Skill = Tables<'skills'> & {
  fullMark?: number;
};

type SkillsDataState = {
  skills: Skill[];
  bestSkill: {
    name: string;
    value: number;
  };
  improvement: number;
  improvementVsPrevious: number;
};

export function useSkillsData() {
  const { user } = useSecurity();
  const [skillsData, setSkillsData] = useState<SkillsDataState>({
    skills: [],
    bestSkill: { name: '', value: 0 },
    improvement: 0,
    improvementVsPrevious: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) return;
    
    const fetchSkillsData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          throw new Error(error.message);
        }

        // Process skills for radar chart
        const processedSkills = data.map(skill => ({
          ...skill,
          fullMark: 100
        }));
        
        // Determine best skill
        let bestSkill = { name: '', value: 0 };
        if (processedSkills.length > 0) {
          bestSkill = processedSkills.reduce((prev, current) => {
            return (prev.value > current.value) ? prev : current;
          });
        }
        
        // Calculate improvement (placeholder logic)
        // In a real app, you'd compare historical skill data
        const improvement = data.length > 0 
          ? Math.round(data.reduce((sum, skill) => sum + skill.value, 0) / data.length / 10)
          : 0;
        
        // Generate improvement vs previous (random for demo)
        const improvementVsPrevious = Math.round((Math.random() * 10) - 3);

        setSkillsData({
          skills: processedSkills,
          bestSkill: {
            name: bestSkill.name,
            value: bestSkill.value
          },
          improvement,
          improvementVsPrevious
        });
      } catch (err: any) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillsData();
  }, [user]);

  // Function to update or create a skill
  const updateSkill = async (name: string, value: number) => {
    if (!user) return;

    try {
      // Check if skill exists
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .eq('name', name)
        .maybeSingle();

      if (existingSkill) {
        // Update existing skill
        await supabase
          .from('skills')
          .update({ value })
          .eq('id', existingSkill.id);
      } else {
        // Insert new skill
        await supabase
          .from('skills')
          .insert({
            user_id: user.id,
            name,
            value
          });
      }

      // Refetch skills
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw new Error(error.message);
      
      const processedSkills = data.map(skill => ({
        ...skill,
        fullMark: 100
      }));
      
      // Determine best skill
      let bestSkill = { name: '', value: 0 };
      if (processedSkills.length > 0) {
        bestSkill = processedSkills.reduce((prev, current) => {
          return (prev.value > current.value) ? prev : current;
        });
      }
      
      // Recalculate improvement
      const improvement = data.length > 0 
        ? Math.round(data.reduce((sum, skill) => sum + skill.value, 0) / data.length / 10)
        : 0;
      
      setSkillsData(prev => ({
        ...prev,
        skills: processedSkills,
        bestSkill: {
          name: bestSkill.name,
          value: bestSkill.value
        },
        improvement
      }));
    } catch (err) {
      console.error('Error updating skill:', err);
    }
  };

  return { skillsData, isLoading, error, updateSkill };
}

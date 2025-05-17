
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { SkillData } from '@/utils/demoData';
import { Skill } from '@/hooks/useSkillsData';
import EditSkillsForm from './EditSkillsForm';
import { useSecurity } from '@/context/SecurityContext';

interface SkillsRadarProps {
  data: Skill[] | SkillData[];
}

const SkillsRadar: React.FC<SkillsRadarProps> = ({ data }) => {
  const { user } = useSecurity();
  
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Habilidades</h3>
        {user && <EditSkillsForm />}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Habilidades"
                dataKey="value"
                stroke="#147BD1"
                fill="#147BD1"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsRadar;

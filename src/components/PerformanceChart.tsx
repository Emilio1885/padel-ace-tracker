
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PerformanceData } from '@/utils/demoData';

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Rendimiento mensual</h3>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
              barSize={20}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  border: 'none', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }}
                formatter={(value, name) => [
                  value, 
                  name === 'wins' ? 'Victorias' : 'Derrotas'
                ]} 
              />
              <Legend 
                formatter={(value) => (
                  value === 'wins' ? 'Victorias' : 'Derrotas'
                )}
              />
              <Bar dataKey="wins" fill="#17A87B" radius={[5, 5, 0, 0]} />
              <Bar dataKey="losses" fill="#F87171" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;

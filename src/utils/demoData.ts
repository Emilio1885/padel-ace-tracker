
export interface Player {
  id: string;
  name: string;
  image: string;
  level: number;
  matches: number;
  wins: number;
  losses: number;
}

export interface Match {
  id: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss';
  score: string;
  location: string;
}

export interface SkillData {
  name: string;
  value: number;
  fullMark: number;
}

export interface PerformanceData {
  month: string;
  wins: number;
  losses: number;
}

export const demoPlayer: Player = {
  id: '1',
  name: 'Carlos Rodriguez',
  image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=200&auto=format&fit=crop',
  level: 4.5,
  matches: 24,
  wins: 16,
  losses: 8
};

export const demoMatches: Match[] = [
  {
    id: '1',
    date: '2023-05-10',
    opponent: 'Miguel Sanchez',
    result: 'win',
    score: '6-4, 7-5',
    location: 'Club de Padel Madrid'
  },
  {
    id: '2',
    date: '2023-05-05',
    opponent: 'Antonio Fernandez',
    result: 'loss',
    score: '3-6, 4-6',
    location: 'Padel Arena Barcelona'
  },
  {
    id: '3',
    date: '2023-04-28',
    opponent: 'Javier Gutierrez',
    result: 'win',
    score: '6-2, 6-3',
    location: 'Club de Padel Madrid'
  },
  {
    id: '4',
    date: '2023-04-20',
    opponent: 'Luis Martinez',
    result: 'win',
    score: '7-6, 6-4',
    location: 'Padel Elite Valencia'
  },
  {
    id: '5',
    date: '2023-04-15',
    opponent: 'Pedro Gomez',
    result: 'loss',
    score: '4-6, 6-7',
    location: 'Club de Padel Madrid'
  }
];

export const demoSkills: SkillData[] = [
  { name: 'Forehand', value: 85, fullMark: 100 },
  { name: 'Backhand', value: 70, fullMark: 100 },
  { name: 'Volley', value: 75, fullMark: 100 },
  { name: 'Smash', value: 80, fullMark: 100 },
  { name: 'Serve', value: 65, fullMark: 100 },
  { name: 'Lob', value: 60, fullMark: 100 }
];

export const demoPerformance: PerformanceData[] = [
  { month: 'Ene', wins: 2, losses: 1 },
  { month: 'Feb', wins: 3, losses: 2 },
  { month: 'Mar', wins: 2, losses: 0 },
  { month: 'Abr', wins: 4, losses: 1 },
  { month: 'May', wins: 3, losses: 3 },
  { month: 'Jun', wins: 2, losses: 1 }
];


import { Skill, PlayerLevel } from '@/types/assessment';

export interface Player {
  name: string;
  image: string;
  level: string;
  matches: number;
  wins: number;
  losses: number;
  since?: string;
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
  fullMark?: number;
}

export const demoPlayer: Player = {
  name: "Carlos Moyano",
  image: "https://randomuser.me/api/portraits/men/42.jpg",
  level: "B",
  matches: 24,
  wins: 16,
  losses: 8,
  since: "2023-01-15"
};

export const demoMatches: Match[] = [
  {
    id: "1",
    date: "2023-06-12",
    opponent: "Juan/Miguel",
    result: "win",
    score: "6-3, 7-5",
    location: "Club Padel Madrid"
  },
  {
    id: "2",
    date: "2023-06-05",
    opponent: "Pedro/Luis",
    result: "loss",
    score: "4-6, 2-6",
    location: "Club Padel Barcelona"
  },
  {
    id: "3",
    date: "2023-05-28",
    opponent: "Roberto/Daniel",
    result: "win",
    score: "7-6, 6-3",
    location: "Club Padel Valencia"
  },
  {
    id: "4",
    date: "2023-05-20",
    opponent: "Javier/Antonio",
    result: "win",
    score: "6-2, 6-4",
    location: "Club Padel Madrid"
  },
  {
    id: "5",
    date: "2023-05-15",
    opponent: "Diego/Manuel",
    result: "loss",
    score: "5-7, 4-6",
    location: "Club Padel Sevilla"
  }
];

export const demoSkills: SkillData[] = [
  { name: "Derecha", value: 85, fullMark: 100 },
  { name: "Revés", value: 70, fullMark: 100 },
  { name: "Volea de derecha", value: 75, fullMark: 100 },
  { name: "Volea de revés", value: 60, fullMark: 100 },
  { name: "Servicio", value: 80, fullMark: 100 },
  { name: "Bandeja", value: 65, fullMark: 100 },
  { name: "Pared de fondo", value: 55, fullMark: 100 },
  { name: "Remate", value: 50, fullMark: 100 }
];

export const demoPerformance = [
  { month: 'Ene', wins: 3, losses: 2 },
  { month: 'Feb', wins: 4, losses: 1 },
  { month: 'Mar', wins: 2, losses: 2 },
  { month: 'Abr', wins: 3, losses: 1 },
  { month: 'May', wins: 4, losses: 2 },
  { month: 'Jun', wins: 0, losses: 0 }
];

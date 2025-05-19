
export interface Skill {
  name: string;
  value: number;
  fullMark?: number;
}

export type PlayerLevel = 'D-' | 'D' | 'D+' | 'C-' | 'C' | 'C+' | 'B-' | 'B' | 'B+' | 'A';

export interface Assessment {
  id: string;
  date: string;
  skills: Skill[];
  notes?: string;
}

export const padelSkills = {
  beginners: [
    'Derecha',
    'Revés',
    'Volea de derecha',
    'Volea de revés',
    'Servicio',
  ],
  intermediate: [
    'Bandeja',
    'Pared de fondo',
    'Pared lateral',
    'Remate',
    'Táctica básica',
  ],
  advanced: [
    'Vibora',
    'Bajada de pared',
    'Defensa de smash',
    'Doble pared',
    'Táctica avanzada',
  ],
  pro: [
    'Globo ofensivo',
    'Contraataque',
    'Saque con efecto',
    'X3 y X4',
    'Finta',
  ]
};

export const allPadelSkills = [
  ...padelSkills.beginners,
  ...padelSkills.intermediate,
  ...padelSkills.advanced,
  ...padelSkills.pro
];

export const playerLevels: PlayerLevel[] = [
  'D-', 'D', 'D+',  // Principiantes
  'C-', 'C', 'C+',  // Intermedios
  'B-', 'B', 'B+',  // Avanzados
  'A'               // Profesionales
];

export const levelGroups = {
  principiantes: ['D-', 'D', 'D+'],
  intermedios: ['C-', 'C', 'C+'],
  avanzados: ['B-', 'B', 'B+'],
  profesionales: ['A']
};

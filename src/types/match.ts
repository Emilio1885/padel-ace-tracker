
// Common Match type to be used throughout the application
export interface Match {
  id: string;
  date: string; 
  opponent: string;
  result: "win" | "loss";
  score: string;
  location: string;
}

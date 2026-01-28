export type GameMode = 'schedule' | 'observe' | 'summary';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type MTGColor = 'white' | 'blue' | 'black' | 'red' | 'green';

export interface PatientData {
  id: string;
  name: string;
  energy: number;
  primaryColor: MTGColor;
  secondaryColor?: MTGColor;
}

export interface ActivityData {
  id: string;
  name: string;
  energyCost: number; // negative = costs energy, positive = restores
  color: MTGColor;    // activity's natural affinity
}

export interface ScheduleEntry {
  patientId: string;
  timeSlot: TimeSlot;
  activityId: string | null;
}

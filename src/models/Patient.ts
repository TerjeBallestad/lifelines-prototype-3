import { makeAutoObservable } from 'mobx';
import type { MTGColor, PatientData } from './types';

export class Patient {
  id: string;
  name: string;
  energy: number;
  readonly maxEnergy: number = 10;
  primaryColor: MTGColor;
  secondaryColor?: MTGColor;

  constructor(data: PatientData) {
    this.id = data.id;
    this.name = data.name;
    this.energy = data.energy;
    this.primaryColor = data.primaryColor;
    this.secondaryColor = data.secondaryColor;
    makeAutoObservable(this);
  }

  get energyPercent(): number {
    return (this.energy / this.maxEnergy) * 100;
  }

  get energyStatus(): 'high' | 'medium' | 'low' {
    if (this.energy >= 6) return 'high';
    if (this.energy >= 3) return 'medium';
    return 'low';
  }
}

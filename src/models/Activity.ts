import { makeAutoObservable } from 'mobx';
import type { MTGColor, ActivityData } from './types';

export class Activity {
  id: string;
  name: string;
  energyCost: number;
  color: MTGColor;

  constructor(data: ActivityData) {
    this.id = data.id;
    this.name = data.name;
    this.energyCost = data.energyCost;
    this.color = data.color;
    makeAutoObservable(this);
  }

  get isRestoring(): boolean {
    return this.energyCost > 0;
  }

  get formattedCost(): string {
    return this.energyCost > 0 ? `+${this.energyCost}` : `${this.energyCost}`;
  }
}

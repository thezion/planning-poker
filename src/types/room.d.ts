import { Players } from './player';

export interface Room {
  time: string;
  showPoints: 0 | 1;
  players: Players;
}

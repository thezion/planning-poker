export interface Player {
  point: number;
  connected: boolean;
  cheated: boolean;
}

export interface Players {
  [index: string]: Player;
}

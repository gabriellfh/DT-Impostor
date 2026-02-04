
export enum GamePhase {
  LOBBY = 'LOBBY',
  CATEGORY_SELECTION = 'CATEGORY_SELECTION',
  WORD_DISTRIBUTION = 'WORD_DISTRIBUTION',
  DISCUSSION = 'DISCUSSION',
  VOTING = 'VOTING',
  REVEAL = 'REVEAL'
}

export enum GameMode {
  IMPOSTOR = 'IMPOSTOR',
  SPY = 'SPY'
}

export enum PlayerRole {
  CITIZEN = 'CITIZEN',
  IMPOSTOR = 'IMPOSTOR',
  UNDERCOVER = 'UNDERCOVER'
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  word: string;
  isEliminated: boolean;
  avatar: string;
}

export interface GameSettings {
  category: string;
  impostorCount: number;
  undercoverCount: number;
  mode: GameMode;
}

export interface WordPair {
  citizenWord: string;
  undercoverWord: string;
}

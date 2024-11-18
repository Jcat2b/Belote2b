export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
export type BidPoints = number | 'capot';

export interface Bid {
  playerId: string;
  suit: Suit;
  points: BidPoints;
  contre?: boolean;
  surContre?: boolean;
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  team: 1 | 2;
  position: number;
}

export interface GameState {
  id: string;
  players: Player[];
  currentTrick: Card[];
  trump: Suit | null;
  scores: {
    team1: number;
    team2: number;
  };
  currentPlayer: number;
  phase: 'bidding' | 'playing' | 'finished';
  bids: Bid[];
  currentBid: Bid | null;
  consecutivePasses: number;
  tricks: {
    team1: Card[][];
    team2: Card[][];
  };
}
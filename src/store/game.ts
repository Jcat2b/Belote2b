import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { GameState, Card, Suit, Player, Bid, BidPoints } from '../types/game';
import { createDeck, shuffleDeck, dealCards, getTrickWinner, calculateTrickPoints } from '@/lib/cards';

interface GameStore extends GameState {
  initGame: () => void;
  playCard: (playerId: string, card: Card) => void;
  setBid: (playerId: string, suit: Suit, points: BidPoints) => void;
  passBid: (playerId: string) => void;
  contre: (playerId: string) => void;
  surContre: (playerId: string) => void;
}

const initialState: GameState = {
  id: '',
  players: [],
  currentTrick: [],
  trump: null,
  scores: {
    team1: 0,
    team2: 0,
  },
  currentPlayer: 0,
  phase: 'bidding',
  bids: [],
  currentBid: null,
  consecutivePasses: 0,
  tricks: {
    team1: [],
    team2: [],
  },
};

const PLAYER_NAMES = ['Nord', 'Est', 'Sud', 'Ouest'];

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  initGame: () => {
    const deck = shuffleDeck(createDeck());
    const hands = dealCards(deck, 4, 8);
    
    const players: Player[] = PLAYER_NAMES.map((name, index) => ({
      id: uuidv4(),
      name,
      hand: hands[index],
      team: index % 2 === 0 ? 1 : 2,
      position: index,
    }));

    set({
      ...initialState,
      id: uuidv4(),
      players,
    });
  },

  setBid: (playerId: string, suit: Suit, points: BidPoints) => {
    const state = get();
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    
    if (playerIndex !== state.currentPlayer || state.phase !== 'bidding') return;
    
    // Vérifier si l'enchère est valide
    if (state.currentBid) {
      const currentPoints = state.currentBid.points === 'capot' ? 170 : state.currentBid.points;
      const newPoints = points === 'capot' ? 170 : points;
      if (newPoints <= currentPoints) return;
    }

    const newBid: Bid = { playerId, suit, points };
    
    set({
      currentBid: newBid,
      bids: [...state.bids, newBid],
      consecutivePasses: 0,
      currentPlayer: (state.currentPlayer + 1) % 4,
    });
  },

  passBid: (playerId: string) => {
    const state = get();
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    
    if (playerIndex !== state.currentPlayer || state.phase !== 'bidding') return;

    const newConsecutivePasses = state.consecutivePasses + 1;

    // Si 3 passes consécutifs après une enchère, la phase d'enchères se termine
    if (newConsecutivePasses === 3 && state.currentBid) {
      set({
        phase: 'playing',
        trump: state.currentBid.suit,
        consecutivePasses: newConsecutivePasses,
        currentPlayer: (state.currentPlayer + 1) % 4,
      });
      return;
    }

    // Si 4 passes sans enchère, on redistribue
    if (newConsecutivePasses === 4 && !state.currentBid) {
      get().initGame();
      return;
    }

    set({
      consecutivePasses: newConsecutivePasses,
      currentPlayer: (state.currentPlayer + 1) % 4,
    });
  },

  contre: (playerId: string) => {
    const state = get();
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    const player = state.players[playerIndex];
    
    if (!state.currentBid || 
        playerIndex !== state.currentPlayer || 
        state.phase !== 'bidding' ||
        player.team === state.players.find(p => p.id === state.currentBid.playerId)?.team ||
        state.currentBid.contre) return;

    set({
      currentBid: { ...state.currentBid, contre: true },
      consecutivePasses: 0,
      currentPlayer: (state.currentPlayer + 1) % 4,
    });
  },

  surContre: (playerId: string) => {
    const state = get();
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    const player = state.players[playerIndex];
    
    if (!state.currentBid || 
        playerIndex !== state.currentPlayer || 
        state.phase !== 'bidding' ||
        player.team !== state.players.find(p => p.id === state.currentBid.playerId)?.team ||
        !state.currentBid.contre ||
        state.currentBid.surContre) return;

    set({
      currentBid: { ...state.currentBid, surContre: true },
      consecutivePasses: 0,
      currentPlayer: (state.currentPlayer + 1) % 4,
    });
  },

  playCard: (playerId, card) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const playerIndex = state.players.findIndex((p) => p.id === playerId);
    if (playerIndex !== state.currentPlayer) return;

    // Vérifier si la carte peut être jouée
    if (state.currentTrick.length > 0) {
      const leadSuit = state.currentTrick[0].suit;
      const hasSuit = state.players[playerIndex].hand.some(c => c.suit === leadSuit);
      if (hasSuit && card.suit !== leadSuit) return;
    }

    // Jouer la carte
    const newPlayers = [...state.players];
    const player = newPlayers[playerIndex];
    player.hand = player.hand.filter(
      (c) => !(c.suit === card.suit && c.rank === card.rank)
    );

    const newTrick = [...state.currentTrick, card];

    // Si le pli est complet (4 cartes)
    if (newTrick.length === 4) {
      const winnerIndex = getTrickWinner(newTrick, state.trump);
      const trickPoints = calculateTrickPoints(newTrick, state.trump);
      const winningTeam = state.players[(state.currentPlayer + winnerIndex) % 4].team;

      const newTricks = {
        team1: [...state.tricks.team1],
        team2: [...state.tricks.team2],
      };
      
      if (winningTeam === 1) {
        newTricks.team1.push(newTrick);
      } else {
        newTricks.team2.push(newTrick);
      }

      const newScores = {
        team1: winningTeam === 1 ? state.scores.team1 + trickPoints : state.scores.team1,
        team2: winningTeam === 2 ? state.scores.team2 + trickPoints : state.scores.team2,
      };

      // Si c'était la dernière carte
      if (newPlayers.every(p => p.hand.length === 0)) {
        set({
          players: newPlayers,
          currentTrick: [],
          phase: 'finished',
          scores: newScores,
          tricks: newTricks,
          currentPlayer: (state.currentPlayer + winnerIndex) % 4,
        });
        return;
      }

      // Sinon, continuer avec le prochain pli
      set({
        players: newPlayers,
        currentTrick: [],
        scores: newScores,
        tricks: newTricks,
        currentPlayer: (state.currentPlayer + winnerIndex) % 4,
      });
      return;
    }

    // Continuer le pli en cours
    set({
      players: newPlayers,
      currentTrick: newTrick,
      currentPlayer: (state.currentPlayer + 1) % 4,
    });
  },
}));
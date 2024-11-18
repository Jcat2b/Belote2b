import type { Card, Suit, Rank } from '@/types/game';

const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const RANKS: Rank[] = ['7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const TRUMP_VALUES: Record<Rank, number> = {
  'J': 20,
  '9': 14,
  'A': 11,
  '10': 10,
  'K': 4,
  'Q': 3,
  '8': 0,
  '7': 0,
};

const NORMAL_VALUES: Record<Rank, number> = {
  'A': 11,
  '10': 10,
  'K': 4,
  'Q': 3,
  'J': 2,
  '9': 0,
  '8': 0,
  '7': 0,
};

export function createDeck(): Card[] {
  const deck: Card[] = [];
  
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({
        suit,
        rank,
        value: NORMAL_VALUES[rank],
      });
    }
  }
  
  return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function dealCards(deck: Card[], numPlayers: number, cardsPerPlayer: number): Card[][] {
  const hands: Card[][] = Array(numPlayers).fill([]).map(() => []);
  
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      hands[j].push(deck[i * numPlayers + j]);
    }
  }
  
  return hands;
}

export function getTrickWinner(trick: Card[], trump: Suit | null): number {
  if (trick.length !== 4) return -1;

  const leadSuit = trick[0].suit;
  let winningCardIndex = 0;
  let highestValue = getCardValue(trick[0], leadSuit, trump);

  for (let i = 1; i < trick.length; i++) {
    const cardValue = getCardValue(trick[i], leadSuit, trump);
    if (cardValue > highestValue) {
      highestValue = cardValue;
      winningCardIndex = i;
    }
  }

  return winningCardIndex;
}

export function calculateTrickPoints(trick: Card[], trump: Suit | null): number {
  return trick.reduce((sum, card) => {
    const value = card.suit === trump ? TRUMP_VALUES[card.rank] : NORMAL_VALUES[card.rank];
    return sum + value;
  }, 0);
}

function getCardValue(card: Card, leadSuit: Suit, trump: Suit | null): number {
  if (card.suit === trump) {
    return TRUMP_VALUES[card.rank] + 100; // Ensure trumps always win over non-trumps
  }
  if (card.suit === leadSuit) {
    return NORMAL_VALUES[card.rank];
  }
  return -1; // Card neither trump nor lead suit
}
import React, { useEffect } from 'react';
import { useGameStore } from '@/store/game';
import { PlayingCard } from './PlayingCard';
import { ScoreDisplay } from './ScoreDisplay';
import { Button } from '@/components/ui/Button';
import { Heart, Diamond, Club, Spade, X } from 'lucide-react';
import type { Card } from '@/types/game';

const SUITS = [
  { name: 'spades', icon: Spade },
  { name: 'hearts', icon: Heart },
  { name: 'diamonds', icon: Diamond },
  { name: 'clubs', icon: Club },
] as const;

const BID_VALUES = [...Array.from({ length: 9 }, (_, i) => (i + 8) * 10), 'capot'];

const POSITIONS = [
  { id: 'north', index: 2, className: 'top-0 left-1/2 -translate-x-1/2' },
  { id: 'east', index: 3, className: 'top-1/2 right-0 -translate-y-1/2' },
  { id: 'south', index: 0, className: 'bottom-0 left-1/2 -translate-x-1/2' },
  { id: 'west', index: 1, className: 'top-1/2 left-0 -translate-y-1/2' },
];

export const GameTable = () => {
  const { 
    players, 
    currentTrick, 
    currentPlayer, 
    phase, 
    trump, 
    scores, 
    currentBid,
    setBid,
    passBid,
    contre,
    surContre,
    consecutivePasses,
    initGame,
    playCard
  } = useGameStore();

  useEffect(() => {
    if (players.length === 0) {
      initGame();
    }
  }, []);

  useEffect(() => {
    if (currentPlayer === 0 || players.length === 0) return;

    const botTimeout = setTimeout(() => {
      const player = players[currentPlayer];
      
      if (phase === 'bidding') {
        if (!currentBid) {
          const randomPoints = Math.floor(Math.random() * (110 - 80 + 1)) + 80;
          const randomSuit = SUITS[Math.floor(Math.random() * SUITS.length)].name;
          setBid(player.id, randomSuit, randomPoints);
        } else {
          passBid(player.id);
        }
      }
    }, 1000);

    return () => clearTimeout(botTimeout);
  }, [currentPlayer, phase, players, currentTrick]);

  if (players.length === 0) {
    return <div>Initialisation de la partie...</div>;
  }

  const handleCardPlay = (card: Card) => {
    const player = players[currentPlayer];
    if (!player || phase !== 'playing') return;

    if (currentTrick.length > 0) {
      const leadSuit = currentTrick[0].suit;
      const hasSuit = player.hand.some(c => c.suit === leadSuit);
      if (hasSuit && card.suit !== leadSuit) return;
    }

    playCard(player.id, card);
  };

  const renderCurrentTrick = () => {
    if (currentTrick.length === 0) return null;

    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="grid grid-cols-2 gap-2">
          {currentTrick.map((card, index) => (
            <div key={index} className={`transform ${
              index === 0 ? '-translate-y-8' :
              index === 1 ? 'translate-x-8' :
              index === 2 ? 'translate-y-8' :
              '-translate-x-8'
            }`}>
              <PlayingCard card={card} className="transform-none" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderBiddingControls = () => {
    if (phase !== 'bidding' || currentPlayer !== 0) return null;

    return (
      <div className="rounded-lg bg-white/90 p-4 shadow-lg">
        <h3 className="mb-3 text-lg font-bold">Enchères</h3>
        <p className="text-sm text-gray-600 mb-2">
          Passes consécutifs: {consecutivePasses}/3
        </p>
        
        <Button
          variant="outline"
          onClick={() => passBid(players[currentPlayer].id)}
          className="mb-4 w-full"
        >
          <X className="mr-2 h-4 w-4" />
          Passer
        </Button>

        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <div className="h-10 flex items-center font-medium">Points</div>
            {BID_VALUES.map((points) => (
              <Button
                key={points}
                variant="outline"
                size="sm"
                disabled={currentBid && (
                  typeof points === 'number' ? 
                    points <= (currentBid.points === 'capot' ? 160 : currentBid.points) : 
                    false
                )}
                className={`w-16 font-medium ${points === 'capot' ? 'bg-yellow-50' : ''}`}
              >
                {points}
              </Button>
            ))}
          </div>

          {SUITS.map(({ name, icon: Icon }) => (
            <div key={name} className="flex flex-col gap-2">
              <div className="h-10 flex items-center justify-center">
                <Icon className={`h-6 w-6 ${
                  name === 'hearts' || name === 'diamonds' ? 'text-red-600' : 'text-gray-900'
                } fill-current`} />
              </div>
              {BID_VALUES.map((points) => (
                <Button
                  key={`${name}-${points}`}
                  size="sm"
                  disabled={currentBid && (
                    typeof points === 'number' ? 
                      points <= (currentBid.points === 'capot' ? 160 : currentBid.points) : 
                      false
                  )}
                  onClick={() => setBid(players[currentPlayer].id, name, points)}
                  className={`w-12 ${
                    currentBid?.suit === name && currentBid?.points === points
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : ''
                  } ${points === 'capot' ? 'bg-yellow-50' : ''}`}
                >
                  <Icon className={`h-4 w-4 ${
                    name === 'hearts' || name === 'diamonds' ? 'text-red-600' : 'text-gray-900'
                  } fill-current`} />
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPlayerPosition = (position: typeof POSITIONS[number]) => {
    const player = players[position.index];
    if (!player) return null;

    const isCurrentPlayer = currentPlayer === position.index;
    const isVerticalPosition = position.id === 'east' || position.id === 'west';

    return (
      <div key={position.id} className={`absolute ${position.className}`}>
        <div className={`rounded-lg bg-white/90 p-2 shadow-lg ${
          isCurrentPlayer ? 'ring-2 ring-blue-500' : ''
        } ${isVerticalPosition ? 'transform-gpu rotate-90' : ''}`}>
          <div className={`${isVerticalPosition ? '-rotate-90' : ''}`}>
            <p className="text-center font-medium">
              {player.name}
              {position.index !== 0 && ' (Bot)'}
            </p>
            {isCurrentPlayer && (
              <p className="text-center text-xs text-blue-600">
                Tour actuel
              </p>
            )}
          </div>
          <div className={`mt-2 ${
            isVerticalPosition 
              ? 'flex flex-wrap gap-0.5 justify-start items-start max-h-[400px]' 
              : 'flex flex-row gap-0.5 justify-center'
          }`}>
            {player.hand.map((card, index) => (
              <PlayingCard
                key={`${card.suit}-${card.rank}-${index}`}
                card={card}
                className={`transform scale-90 origin-top ${
                  isCurrentPlayer && phase === 'playing' 
                    ? 'hover:-translate-y-1 cursor-pointer' 
                    : ''
                } ${isVerticalPosition ? '-rotate-180' : ''}`}
                onClick={isCurrentPlayer && phase === 'playing' 
                  ? () => handleCardPlay(card) 
                  : undefined}
                faceDown={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative mx-auto h-[800px] w-full max-w-6xl rounded-3xl bg-gradient-to-br from-green-700 to-green-900 p-8 shadow-2xl">
      <ScoreDisplay team1Score={scores.team1} team2Score={scores.team2} />
      
      {POSITIONS.map(renderPlayerPosition)}
      {renderCurrentTrick()}

      {currentBid && (
        <div className="absolute left-4 top-4 rounded-lg bg-white/90 p-4 shadow-lg">
          <h3 className="text-lg font-bold">Enchère actuelle</h3>
          <div className="mt-2 flex items-center gap-2">
            {React.createElement(SUITS.find(s => s.name === currentBid.suit)?.icon || Spade, { 
              className: `h-6 w-6 ${
                currentBid.suit === 'hearts' || currentBid.suit === 'diamonds' 
                  ? 'text-red-600' 
                  : 'text-gray-900'
              } fill-current` 
            })}
            <span className="text-xl font-bold">{currentBid.points}</span>
            {currentBid.contre && <span className="text-red-600 font-bold">Contré</span>}
            {currentBid.surContre && <span className="text-purple-600 font-bold">Sur-contré</span>}
          </div>
        </div>
      )}

      <div className="absolute right-4 top-24 space-y-4">
        {renderBiddingControls()}
      </div>
    </div>
  );
};
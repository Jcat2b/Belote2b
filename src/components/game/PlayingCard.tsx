import React from 'react';
import { Heart, Diamond, Club, Spade } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Card as CardType } from '@/types/game';

interface PlayingCardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  faceDown?: boolean;
}

const SuitIcon = {
  hearts: Heart,
  diamonds: Diamond,
  clubs: Club,
  spades: Spade,
};

export const PlayingCard: React.FC<PlayingCardProps> = ({
  card,
  onClick,
  className,
  faceDown = false,
}) => {
  const Icon = SuitIcon[card.suit];
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  if (faceDown) {
    return (
      <div
        className={cn(
          'h-24 w-16 rounded-lg bg-blue-600 p-1.5 shadow-md',
          'bg-gradient-to-br from-blue-500 to-blue-700',
          className
        )}
      />
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'h-24 w-16 rounded-lg bg-white p-1.5 shadow-md transition-transform hover:-translate-y-1',
        'cursor-pointer select-none',
        className
      )}
    >
      <div className="flex justify-between">
        <span className={cn('text-base font-bold', isRed ? 'text-red-600' : 'text-gray-900')}>
          {card.rank}
        </span>
        <Icon className={cn('h-4 w-4 fill-current', isRed ? 'text-red-600' : 'text-gray-900')} />
      </div>
      <div className="flex h-full items-center justify-center">
        <Icon className={cn('h-8 w-8 fill-current', isRed ? 'text-red-600' : 'text-gray-900')} />
      </div>
    </div>
  );
};
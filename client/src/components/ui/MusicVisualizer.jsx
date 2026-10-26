import React from 'react';

/**
 * MusicVisualizer Component
 * 
 * Accurately reflects actual music playback state:
 * - When isPlaying is TRUE: equalizer frequency bars animate with organic heights and neon gradient.
 * - When isPlaying is FALSE: bars gracefully collapse to a calm resting state.
 * - Respects prefers-reduced-motion via CSS.
 */
export const MusicVisualizer = ({
  isPlaying = false,
  barCount = 18,
  size = 'md',
  className = '',
  colorScheme = 'purple-pink'
}) => {
  // Height profiles for different sizes
  const heightClasses = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-14'
  }[size] || 'h-10';

  const barWidthClasses = {
    sm: 'w-1',
    md: 'w-1.5',
    lg: 'w-2'
  }[size] || 'w-1.5';

  // Specific animation classes mapped to cyclic keyframes (8 unique organic rhythms)
  const animClasses = [
    'eq-bar-1',
    'eq-bar-2',
    'eq-bar-3',
    'eq-bar-4',
    'eq-bar-5',
    'eq-bar-6',
    'eq-bar-7',
    'eq-bar-8'
  ];

  return (
    <div
      className={`relative flex items-end justify-center gap-1.5 ${heightClasses} ${className}`}
      aria-label={isPlaying ? 'Music playing visualizer active' : 'Music playback idle'}
      role="img"
    >
      {/* Soft ambient neon glow behind visualizer when playing */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r from-purple-500/25 via-pink-500/25 to-indigo-500/20 blur-md rounded-full transition-opacity duration-700 pointer-events-none ${
          isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {Array.from({ length: barCount }).map((_, index) => {
        // Distribute bars across the 8 frequency profiles
        const animClass = animClasses[index % animClasses.length];
        
        // Natural resting curve when idle (calm gentle wave)
        const restingPercent = 14 + Math.sin((index / Math.max(1, barCount - 1)) * Math.PI) * 10;
        
        // Realistic frequency delay distribution
        const animDelay = isPlaying ? `${((index * 0.07) % 0.8).toFixed(2)}s` : undefined;

        return (
          <span
            key={index}
            className={`${barWidthClasses} rounded-full transition-all duration-300 relative z-10 ${
              isPlaying
                ? `bg-gradient-to-t from-purple-600 via-pink-500 to-indigo-400 ${animClass} shadow-[0_0_8px_rgba(236,72,153,0.35)]`
                : 'bg-slate-700/60 shadow-none'
            }`}
            style={{
              height: isPlaying ? undefined : `${restingPercent}%`,
              animationDelay: animDelay
            }}
          />
        );
      })}
    </div>
  );
};

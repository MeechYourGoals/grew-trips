import React from 'react';
import { getInitials, isValidAvatarUrl } from '../../utils/avatarUtils';

export interface CollaboratorItem {
  id: number | string;
  name: string;
  avatar?: string;
  role?: string;
}

interface CollaboratorsGridProps {
  participants: CollaboratorItem[];
  countLabel?: string;
  maxRows?: number; // approximate rows to show before clamping
  minColWidth?: number; // min width for each grid item
  onShowAll: () => void;
}

export const CollaboratorsGrid: React.FC<CollaboratorsGridProps> = ({
  participants,
  countLabel,
  maxRows = 2,
  minColWidth = 220,
  onShowAll,
}) => {
  // Approximate clamp height: each row ~ 72-84px depending on content
  const clampHeight = Math.max(72, Math.min(240, maxRows * 84));

  return (
    <section aria-labelledby="collab-title" className="relative">
      <div className="relative">
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${minColWidth}px, 1fr))`,
            maxHeight: `${clampHeight}px`,
            overflow: 'hidden',
          }}
          role="list"
          aria-label="Collaborators"
        >
          {participants.map((c) => (
            <button
              key={c.id}
              className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition"
              role="listitem"
              title={c.role ? `${c.name} • ${c.role}` : c.name}
            >
              {isValidAvatarUrl(c.avatar) ? (
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="h-8 w-8 rounded-full object-cover border border-white/20"
                  loading="lazy"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-white/10 text-white/80 grid place-items-center text-xs font-semibold border border-white/20">
                  {getInitials(c.name)}
                </div>
              )}
              <div className="flex-1 min-w-0 text-left">
                <div className="truncate text-sm font-medium text-white">{c.name}</div>
                {c.role && (
                  <div className="truncate text-xs text-gray-400">{c.role}</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* gradient fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg" />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-gray-400">{countLabel}</div>
        <button
          className="text-xs font-medium underline text-gray-200 hover:text-white"
          onClick={onShowAll}
          aria-label="Show all collaborators"
        >
          Show all
        </button>
      </div>
    </section>
  );
};

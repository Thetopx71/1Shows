'use client';

import { useState } from 'react';
import MediaCard from '@/components/media/MediaCard';
import ScrollableRow from '@/components/ui/ScrollableRow';

export interface MediaRowTab {
  id: string;
  label: string;
  items: any[];
}

export default function TabbedMediaRow({
  title,
  tabs,
}: {
  title: string;
  tabs: MediaRowTab[];
}) {
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0]?.id || '');

  const hasAnyItems = tabs.some((tab) => Array.isArray(tab.items) && tab.items.length > 0);
  if (!hasAnyItems) return null;

  const activeTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];
  const items = activeTab?.items || [];

  return (
    <div>
      <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-5 mb-5">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
          {title}
        </h2>

        <div className="ios-segmented-track overflow-x-auto hide-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTabId(tab.id)}
              className={
                activeTabId === tab.id
                  ? 'ios-segmented-btn-active'
                  : 'ios-segmented-btn-inactive'
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ScrollableRow>
        {items.map((item: any) => (
          <div key={`${activeTabId}-${item.id}`} className="poster-row-item">
            <MediaCard movie={item} />
          </div>
        ))}
      </ScrollableRow>
    </div>
  );
}

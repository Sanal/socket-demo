import { useRef, useSyncExternalStore } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { feedStore } from "../stores/feedStore";
import { FeedItem } from "./FeedItem";

export function Feed() {
  const items = useSyncExternalStore(
    feedStore.subscribe,
    feedStore.getSnapshot,
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: 640,
        overflow: "auto",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = items[virtualItem.index];

          return (
            <div
              key={item.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <FeedItem item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

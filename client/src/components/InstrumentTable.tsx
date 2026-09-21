import { useRef, useSyncExternalStore } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { instrumentStore } from "../stores/instrumentStore";
import { InstrumentRow } from "./InstrumentRow";

export function InstrumentTable() {
  const instruments = useSyncExternalStore(
    instrumentStore.subscribe,
    instrumentStore.getSnapshot,
  );

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: instruments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: "auto",
        overflow: "auto",
        backgroundColor: "#fafafa",
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: "relative",
          width: "100%",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const instrument = instruments[virtualItem.index];

          return (
            <div
              key={instrument.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <InstrumentRow instrument={instrument} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

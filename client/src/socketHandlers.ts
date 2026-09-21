import { socket } from "./socket";
import { feedStore } from "./stores/feedStore";
import { instrumentStore } from "./stores/instrumentStore";
import { scheduleFeedFlush } from "./stores/startFeedFlush";
import { scheduleInstrumentFlush } from "./stores/startInstrumentsFlush";

import type { Instrument, FeedItem } from "./types";

export function startSocketHandlers() {
  const handleInitialInstruments = (instruments: Instrument[]) => {
    instrumentStore.initialize(instruments);
  };

  const handleInstrumentUpdate = (instrument: Instrument) => {
    instrumentStore.update(instrument);
    scheduleInstrumentFlush();
  };

  const handleFeed = (item: FeedItem) => {
    feedStore.add(item);
    scheduleFeedFlush();
  };

  socket.on("feed", handleFeed);
  socket.on("instruments:init", handleInitialInstruments);
  socket.on("instrument:update", handleInstrumentUpdate);

  return () => {
    socket.off("feed", handleFeed);
    socket.off("instruments:init", handleInitialInstruments);
    socket.off("instrument:update", handleInstrumentUpdate);
  };
}

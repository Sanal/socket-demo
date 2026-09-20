import { useEffect, useState } from "react";
import { socket } from "./socket";

import type { Instrument, FeedItem } from "./types";

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const handleInitialInstruments = (data: Instrument[]) => {
      setInstruments(data);
    };

    const handleInstrumentUpdate = (instrument: Instrument) => {
      setInstruments((prev) =>
        prev.map((item) => (item.id === instrument.id ? instrument : item)),
      );
    };

    const handleFeed = (item: FeedItem) => {
      setFeed((prev) => [item, ...prev]);
    };

    socket.on("instrument:init", handleInitialInstruments);
    socket.on("instrument:update", handleInstrumentUpdate);
    socket.on("feed", handleFeed);

    return () => {
      socket.off("instruments:init", handleInitialInstruments);
      socket.off("instrument:update", handleInstrumentUpdate);
      socket.off("feed", handleFeed);
    };
  }, []);

  return (
    <div>
      <h1>Realtime Dashboard</h1>
      <h2>Instruments: {instruments.length}</h2>
      <h2>Feed: {feed.length}</h2>

      <h2>Instruments</h2>
      {instruments.map((instrument) => (
        <div key={instrument.id}>
          {instrument.symbol} {instrument.price.toFixed(2)}
        </div>
      ))}

      <h2>Feed</h2>
      {feed.map((item) => (
        <div key={item.id}>
          {item.symbol} {item.price.toFixed(2)}
        </div>
      ))}
    </div>
  );
}

export default App;

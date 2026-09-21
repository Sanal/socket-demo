import { Profiler, useEffect, useState } from "react";
import { socket } from "./socket";

import { InstrumentTable } from "./components/InstrumentTable";
import { Feed } from "./components/Feed";
import { Stats } from "./components/Stats";
import "./App.css";

function App() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Realtime Dashboard</h1>
        <p>
          Status:{" "}
          {connected ? (
            <span style={{ color: "green" }}>Connected</span>
          ) : (
            <span style={{ color: "red" }}>Disconnected</span>
          )}
        </p>
        <Stats />
      </header>

      <div className="content-grid">
        <section>
          <h2>Instruments</h2>
          <Profiler
            id="instruments"
            onRender={(id, phase, actualDuration) => {
              console.log({ id, phase, actualDuration });
            }}
          >
            <InstrumentTable />
          </Profiler>
        </section>

        <section>
          <h2>Feed</h2>
          <Feed />
        </section>
      </div>
    </div>
  );
}

export default App;

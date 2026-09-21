import express from "express";
import http from "http";
import { Server } from "socket.io";

import {
  createInitialInstruments,
  updateInstrument,
  createFeedItem,
} from "./generator.js";

import type { Instrument } from "./types.js";

const PORT = 3000;
const INSTRUMENT_UPDATES_PER_SECOND = 5000;
const FEED_EVENTS_PER_SECOND = 100;
const TICK_INTERVAL = 100;

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const instruments = new Map<number, Instrument>(
  createInitialInstruments().map((instrument) => [instrument.id, instrument]),
);

let instrumentUpdatesSent = 0;
let feedEventsSent = 0;

function getRandomInstrument() {
  const id = Math.floor(Math.random() * instruments.size);
  const instrument = instruments.get(id);

  return instrument;
}

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    clients: io.engine.clientsCount,
    instruments: instruments.size,
    instrumentUpdatesPerSecond: INSTRUMENT_UPDATES_PER_SECOND,
    feedEventsPerSecond: FEED_EVENTS_PER_SECOND,
  });
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.emit("instruments:init", Array.from(instruments.values()));

  socket.on("disconnect", (reason) => {
    (console.log(`Client disconnected: ${socket.id}`), reason);
  });
});

const instrumentUpdatesPerTick =
  INSTRUMENT_UPDATES_PER_SECOND / (1000 / TICK_INTERVAL);

const feedEventsPerTick = FEED_EVENTS_PER_SECOND / (1000 / TICK_INTERVAL);

setInterval(() => {
  for (let i = 0; i < instrumentUpdatesPerTick; i++) {
    const instrument = getRandomInstrument();

    if (!instrument) {
      continue;
    }

    const updated = updateInstrument(instrument);

    instruments.set(instrument.id, updated);

    io.emit("instrument:update", updated);

    instrumentUpdatesSent++;
  }
}, TICK_INTERVAL);

setInterval(() => {
  for (let i = 0; i < feedEventsPerTick; i++) {
    const instrument = getRandomInstrument();

    if (!instrument) {
      continue;
    }

    const feedItem = createFeedItem(instrument);

    io.emit("feed", feedItem);

    feedEventsSent++;
  }
}, TICK_INTERVAL);

setInterval(() => {
  console.log({
    instrumentUpdates: instrumentUpdatesSent,
    feedEvents: feedEventsSent,
    clients: io.engine.clientsCount,
  });

  instrumentUpdatesSent = 0;
  feedEventsSent = 0;
}, 1000);

httpServer.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Instrument updates: ${INSTRUMENT_UPDATES_PER_SECOND}/sec`);
  console.log(`Feed events: ${FEED_EVENTS_PER_SECOND}/sec`);
});

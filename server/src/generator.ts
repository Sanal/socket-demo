import type { Instrument, FeedItem } from "./types.js";

const SYMBOLS = ["BTC", "ETH", "SOL", "XRP", "DOGE", "BNB", "ADA", "DOT"];

export const INSTRUMENT_COUNT = 8;

let feedId = 0;

export function createInitialInstruments(): Instrument[] {
  return Array.from({ length: INSTRUMENT_COUNT }, (_, index) => {
    const symbol = SYMBOLS[index % SYMBOLS.length];

    return {
      id: index,
      symbol,
      price: Math.random() * 100000,
      change: 0,
      volume: Math.random() * 1000,
    };
  });
}

export function updateInstrument(instrument: Instrument): Instrument {
  const priceDelta = (Math.random() - 0.5) * 100;
  const price = Math.max(0, instrument.price + priceDelta);
  const change = ((price - instrument.price) / instrument.price) * 100;

  return {
    ...instrument,
    price,
    change,
    volume: instrument.volume + Math.random() * 10,
  };
}

export function createFeedItem(instrument: Instrument): FeedItem {
  feedId++;

  return {
    id: feedId,
    instrumentId: instrument.id,
    symbol: instrument.symbol,
    price: instrument.price,
    volume: Math.random() * 10,
    timestamp: Date.now(),
  };
}

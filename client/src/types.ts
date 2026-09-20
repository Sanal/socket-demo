export type Instrument = {
  id: number;
  symbol: string;
  price: number;
  change: number;
  volume: number;
};

export type FeedItem = {
  id: number;
  instrumentId: number;
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
};

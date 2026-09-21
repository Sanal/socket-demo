import type { Instrument } from "../types";

const instruments = new Map<number, Instrument>();

let snapshot: Instrument[] = [];

const listeners = new Set<() => void>();

export const instrumentStore = {
  getSnapshot() {
    return snapshot;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  initialize(initial: Instrument[]) {
    instruments.clear();

    for (const instrument of initial) {
      instruments.set(instrument.id, instrument);
    }

    publish();
  },

  update(instrument: Instrument) {
    instruments.set(instrument.id, instrument);
  },

  flush() {
    snapshot = Array.from(instruments.values());

    publish();
  },
};

function publish() {
  for (const listener of listeners) {
    listener();
  }
}

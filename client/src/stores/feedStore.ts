import type { FeedItem } from "../types";

const MAX_ITEMS = 1000;

let items: FeedItem[] = [];

const listeners = new Set<() => void>();

export const feedStore = {
  getSnapshot() {
    return items;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  add(item: FeedItem) {
    items = [item, ...items].slice(0, MAX_ITEMS);
  },

  flush() {
    for (const listener of listeners) {
      listener();
    }
  },
};

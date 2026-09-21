import { feedStore } from "./feedStore";

let feedFlushScheduled = false;

export function scheduleFeedFlush() {
  if (feedFlushScheduled) {
    return;
  }

  feedFlushScheduled = true;

  requestAnimationFrame(() => {
    feedFlushScheduled = false;

    feedStore.flush();
  });
}

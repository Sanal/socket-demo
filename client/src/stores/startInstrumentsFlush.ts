import { instrumentStore } from "./instrumentStore";

let framePending = false;

export function scheduleInstrumentFlush() {
  if (framePending) {
    return;
  }

  framePending = true;

  requestAnimationFrame(() => {
    framePending = false;

    instrumentStore.flush();
  });
}

import { memo } from "react";
import type { Instrument } from "../types";

type Props = {
  instrument: Instrument;
};

export const InstrumentRow = memo(function InstrumentRow({
  instrument,
}: Props) {
  return (
    <div className="instrument-row">
      <span>{instrument.symbol}</span>
      <span>{instrument.price?.toFixed(2)}</span>
      <span>{instrument.change?.toFixed(2)}%</span>
      <span>{instrument.volume?.toFixed(2)}</span>
    </div>
  );
});

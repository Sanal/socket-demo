import type { FeedItem as FeedItemType } from "../types";

type Props = {
  item: FeedItemType;
};

export function FeedItem({ item }: Props) {
  return (
    <div className="feed-item">
      <span>{item.symbol}</span>
      <span>{item.price?.toFixed(2)}</span>
      <span>{item.volume?.toFixed(3)}</span>
      <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
    </div>
  );
}

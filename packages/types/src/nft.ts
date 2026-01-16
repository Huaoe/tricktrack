export enum BadgeType {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  SPONSOR = 'sponsor',
}

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Record<string, string | number>;
}

export interface NFTBadge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  tokenId: number;
  metadataUri: string;
  metadata?: BadgeMetadata;
  mintedAt: Date;
}

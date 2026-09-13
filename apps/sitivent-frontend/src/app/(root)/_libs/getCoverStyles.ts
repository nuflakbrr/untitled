const coverStyles = [
  'featured-cover-orange',
  'featured-cover-green',
  'featured-cover-yellow',
  'featured-cover-accent',
];

export const getCoverStyles = (eventIds: string[]): string[] => {
  const seed = eventIds.reduce(
    (total, eventId) =>
      [...eventId].reduce((hash, character) => hash * 31 + character.charCodeAt(0), total),
    0
  );
  const variantCount = coverStyles.length - 1;
  const offset = Math.abs(seed) % variantCount;
  const patternOrder = [
    0,
    1 + offset,
    1 + ((offset + 1) % variantCount),
    1 + ((offset + 2) % variantCount),
  ];

  return eventIds.map((_, index) => coverStyles[patternOrder[index % patternOrder.length]]);
};

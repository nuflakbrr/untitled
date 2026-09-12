const coverStyles = ['featured-cover-orange', 'featured-cover-green', 'featured-cover-yellow'];

export const getCoverStyles = (eventIds: string[]): string[] =>
  eventIds.reduce<string[]>((styles, eventId, index) => {
    if (index === 0) {
      styles.push(coverStyles[0]);
      return styles;
    }

    const hash = [...eventId].reduce(
      (total, character) => total * 31 + character.charCodeAt(0),
      0
    );
    const previousStyle = styles.at(-1);
    const initialIndex = Math.abs(hash) % coverStyles.length;
    const styleIndex =
      coverStyles[initialIndex] === previousStyle
        ? (initialIndex + 1) % coverStyles.length
        : initialIndex;

    styles.push(coverStyles[styleIndex]);
    return styles;
  }, []);

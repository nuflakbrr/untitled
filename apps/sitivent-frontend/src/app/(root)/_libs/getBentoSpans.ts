const bentoPatterns = [
  'min-h-80 sm:col-span-2 sm:row-span-2 lg:min-h-0',
  'min-h-56 lg:min-h-0',
  'min-h-72 sm:row-span-2 lg:min-h-0',
  'min-h-56 lg:min-h-0',
  'min-h-56 sm:col-span-2 lg:min-h-0',
];

export const getBentoSpans = (index: number): string =>
  bentoPatterns[index % bentoPatterns.length];

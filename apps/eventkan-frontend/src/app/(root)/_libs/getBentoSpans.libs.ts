const bentoPatterns = [
  'col-span-1 min-h-77.5 lg:col-span-7',
  'col-span-1 min-h-77.5 lg:col-span-5',
  'col-span-1 min-h-77.5 lg:col-span-5',
  'col-span-1 min-h-77.5 lg:col-span-7',
  'col-span-1 min-h-77.5 lg:col-span-6',
  'col-span-1 min-h-77.5 lg:col-span-6',
];

export const getBentoSpans = (index: number): string =>
  bentoPatterns[index % bentoPatterns.length];
